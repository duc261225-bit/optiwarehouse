/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT CHO OPTIWAREHOUSE.AI
 * 1. Tự động lưu thông tin khách đăng ký vào Google Sheet (Bao gồm Email)
 * 2. Tự động gửi Email gửi kèm link Ứng Dụng Dùng Thử (App Mini WMS) cho khách
 * ==============================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 1. Kiểm tra tiêu đề trang tính
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian Đăng Ký",
        "Họ và Tên",
        "Số Điện Thoại",
        "Email",
        "Quy Mô Kho",
        "Kênh Bán Hàng",
        "Ghi Chú Nhu Cầu",
        "Trạng Thái"
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#ea580c").setFontColor("#ffffff");
    } else {
      // Nếu tiêu đề cũ chỉ có 7 cột chưa có Email thì tự động thêm cột Email
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var hasEmail = headers.some(function(h) { 
        return h && h.toString().toLowerCase().indexOf("email") !== -1; 
      });
      if (!hasEmail) {
        sheet.insertColumnAfter(3);
        sheet.getRange(1, 4).setValue("Email").setFontWeight("bold").setBackground("#ea580c").setFontColor("#ffffff");
      }
    }
    
    // 2. Đọc dữ liệu gửi lên (hỗ trợ cả JSON body và URL-encoded parameters)
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var timeStr = data.created_at || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");
    var fullName = data.full_name || "Quý khách";
    var phone = data.phone || "";
    var email = (data.email || "").trim();
    var warehouseSize = data.warehouse_size || "Chưa xác định";
    var salesChannel = data.sales_channel || "Chưa cung cấp";
    var note = data.note || "Đăng ký nhận bản dùng thử từ Website Landing Page";
    
    // 3. Thêm dòng mới vào Google Sheet (8 cột chuẩn)
    sheet.appendRow([
      timeStr,
      fullName,
      "'" + phone, // Dấu ' để không bị mất số 0 đầu SĐT
      email,
      warehouseSize,
      salesChannel,
      note,
      "Mới"
    ]);
    
    // 4. GỬI EMAIL TỰ ĐỘNG KÈM THEO SẢN PHẨM DÙNG THỬ (APP)
    if (email && email.indexOf("@") !== -1 && email.indexOf(".") !== -1) {
      try {
        sendTrialAppEmail(email, fullName, phone, warehouseSize, salesChannel);
      } catch (mailErr) {
        Logger.log("Lỗi gửi email tự động: " + mailErr.toString());
      }
    }
    
    return ContentService.createTextOutput("SUCCESS").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Hàm gửi email tự động kèm sản phẩm dùng thử (Web App OptiWarehouse)
 */
function sendTrialAppEmail(recipientEmail, customerName, phone, warehouseSize, salesChannel) {
  var appUrl = "https://duc261225-bit.github.io/optiwarehouse/app.html";
  var websiteUrl = "https://duc261225-bit.github.io/optiwarehouse/";
  var zaloContact = "0916.280.365";
  var zaloLink = "https://zalo.me/0916280365";

  var subject = "[OptiWarehouse.AI] Gửi bạn bản trải nghiệm Ứng Dụng Quản Lý Kho Thông Minh (Dùng Thử Miễn Phí)";
  
  var htmlBody = 
    '<div style="font-family: \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">' +
      '<!-- Header -->' +
      '<div style="background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); padding: 32px 24px; text-align: center; color: #ffffff;">' +
        '<div style="font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">OptiWarehouse<span style="color: #fed7aa;">.AI</span></div>' +
        '<p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.95; font-weight: 500;">Hệ Thống Quản Lý Kho Thông Minh & CSDL Tinh Gọn Cho Doanh Nghiệp</p>' +
      '</div>' +
      
      '<!-- Nội dung thư -->' +
      '<div style="padding: 30px 24px; color: #334155; line-height: 1.6;">' +
        '<h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Xin chào <strong>' + customerName + '</strong>,</h2>' +
        '<p style="font-size: 14px; margin-bottom: 20px;">' +
          'Cảm ơn bạn đã đăng ký trải nghiệm giải pháp <strong>OptiWarehouse.AI</strong>. Chúng tôi xin gửi bạn đường dẫn truy cập trực tiếp vào <strong>Bản Dùng Thử Ứng Dụng Quản Lý Kho & CSDL (Mini WMS)</strong> dưới đây:' +
        '</p>' +

        '<!-- Khung hộp sản phẩm dùng thử -->' +
        '<div style="background-color: #fff7ed; border: 2px dashed #f97316; border-radius: 14px; padding: 24px 20px; text-align: center; margin: 24px 0;">' +
          '<div style="font-size: 32px; margin-bottom: 6px;">📦 🚀</div>' +
          '<h3 style="margin: 0 0 8px 0; color: #c2410c; font-size: 17px; font-weight: 800;">Ứng Dụng Quản Lý Kho Thông Minh (Web App)</h3>' +
          '<p style="font-size: 13px; color: #7c2d12; margin-bottom: 20px; line-height: 1.5;">' +
            'Hệ thống đã nạp sẵn dữ liệu mô phỏng thực tế. Bạn có thể mở trực tiếp trên điện thoại hoặc máy tính ngay lập tức mà không cần cài đặt.' +
          '</p>' +
          '<a href="' + appUrl + '" target="_blank" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 15px; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.35);">' +
            '👉 MỞ ỨNG DỤNG DÙNG THỬ NGAY' +
          '</a>' +
          '<p style="font-size: 11px; color: #9a3412; margin-top: 12px; margin-bottom: 0;">' +
            'Hoặc truy cập link: <a href="' + appUrl + '" target="_blank" style="color: #ea580c; font-weight: 600;">' + appUrl + '</a>' +
          '</p>' +
        '</div>' +

        '<!-- Các tính năng nổi bật -->' +
        '<h3 style="font-size: 15px; color: #0f172a; margin-top: 24px; margin-bottom: 12px;">🌟 Các tính năng sẵn sàng để bạn trải nghiệm ngay trong App:</h3>' +
        '<ul style="padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.9; margin: 0 0 20px 0;">' +
          '<li><strong>⚡ AI Gom Đơn & Lộ Trình Soạn Hàng:</strong> Tự động tính đường đi ngắn nhất trong kho, tiết kiệm đến 70% thời gian nhặt hàng.</li>' +
          '<li><strong>📍 Sơ Đồ Kệ Hàng 2D (Smart Slotting):</strong> Xem trực quan vị trí các kệ Zone Vàng, Bạc, Đồng và đề xuất dời hàng bán chạy.</li>' +
          '<li><strong>📷 Máy Quét Mã Vạch Barcode / QR:</strong> Quét kiểm đếm đơn hàng và vị trí kho nhanh chóng.</li>' +
          '<li><strong>👥 CSDL Khách Hàng (CRM) & Đơn Hàng:</strong> Quản lý danh bạ khách, tiếp nhận đơn và cập nhật trạng thái kho.</li>' +
          '<li><strong>📥 Xuất Báo Cáo Excel / CSV:</strong> Tải toàn bộ dữ liệu đơn hàng và khách hàng chuẩn tiếng Việt chỉ với 1 click.</li>' +
        '</ul>' +

        '<!-- Thông tin khách đã đăng ký -->' +
        '<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin: 20px 0; font-size: 12px; color: #475569;">' +
          '<strong style="color: #0f172a;">Thông tin ghi nhận của bạn:</strong><br>' +
          '• Họ và tên: <strong>' + customerName + '</strong><br>' +
          '• Số điện thoại: <strong>' + phone + '</strong><br>' +
          '• Quy mô kho: <strong>' + warehouseSize + '</strong><br>' +
          '• Kênh bán chính: <strong>' + salesChannel + '</strong>' +
        '</div>' +

        '<p style="font-size: 13px; color: #475569; margin-top: 18px;">' +
          'Thông tin của bạn đã được tiếp nhận và đội ngũ chuyên viên của <strong>OptiWarehouse.AI</strong> sẽ liên hệ với bạn sớm nhất để đồng hành và hỗ trợ giải pháp kho phù hợp nhất.' +
        '</p>' +
      '</div>' +

      '<!-- Footer -->' +
      '<div style="background-color: #0f172a; padding: 22px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #1e293b;">' +
        '<p style="margin: 0 0 6px 0; color: #ffffff; font-weight: 600;">Cần hỗ trợ kỹ thuật hoặc tư vấn kho trực tiếp?</p>' +
        '<p style="margin: 0 0 10px 0;">' +
          'Hotline / Zalo: <a href="' + zaloLink + '" target="_blank" style="color: #fb923c; font-weight: bold; text-decoration: none;">' + zaloContact + '</a> | ' +
          'Website: <a href="' + websiteUrl + '" target="_blank" style="color: #38bdf8; text-decoration: none;">OptiWarehouse.AI</a>' +
        '</p>' +
        '<p style="margin: 0; font-size: 11px; color: #64748b;">' +
          '© 2026 OptiWarehouse.AI. Bản quyền thuộc về hệ thống quản lý kho thông minh tinh gọn.' +
        '</p>' +
      '</div>' +
    '</div>';

  MailApp.sendEmail({
    to: recipientEmail,
    subject: subject,
    htmlBody: htmlBody
  });
}

function doGet(e) {
  return ContentService.createTextOutput("OptiWarehouse Webhook & Auto Email đang hoạt động tốt!");
}
