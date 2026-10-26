# OptiWarehouse - Smart Mini WMS & CSDL Tích Hợp 🚀

Hệ thống quản lý kho thông minh tinh gọn thế hệ mới tích hợp Trí Tuệ Nhân Tạo (AI) và **Hệ Thống Cơ Sở Dữ Liệu (CSDL)** hoàn chỉnh dành riêng cho doanh nghiệp vừa & nhỏ (SMEs), chủ shop thương mại điện tử (Shopee, TikTok Shop, Lazada).

---

## 📂 Cấu trúc dự án:

```
optiwarehouse/
├── index.html     # Website Landing Page tinh gọn (Giao diện đơn giản, hiện đại, lưu CSDL)
├── app.html       # Ứng dụng Quản lý kho & CSDL CRM (Bản dùng thử hoạt động thực tế)
├── schema.sql     # File cấu trúc CSDL chuẩn (PostgreSQL, SQLite, MySQL)
├── database.py    # Bộ điều khiển CSDL bằng Python SQLite
└── README.md      # Tài liệu hướng dẫn sử dụng & triển khai
```

---

## 🌟 1. Cơ Sở Dữ Liệu (CSDL) Đã Xây Dựng:

Hệ thống được thiết kế với 3 bảng dữ liệu cốt lõi (xem chi tiết tại [`schema.sql`](file:///C:/Users/Admin/.gemini/antigravity/scratch/optiwarehouse/schema.sql)):

1. **`consultations` (Lưu thông tin tư vấn):**
   - Lưu trữ tự động họ tên, SĐT, quy mô kho, kênh bán, ghi chú và trạng thái (`Mới`, `Đã gọi tư vấn`, `Đang demo`, `Đã chốt hợp đồng`).
   - Tự động ghi nhận mỗi khi có khách gửi form tại trang Landing Page `index.html`.
   - Có nút **"Chuyển thành Khách Hàng"** chỉ với 1 click.

2. **`customers` (Danh bạ khách hàng CRM):**
   - Quản lý mã khách hàng (`KH-1001`), họ tên, SĐT, tên Shop/doanh nghiệp, địa chỉ, kênh bán chính, tổng số đơn và tổng tiền chi tiêu.
   - Có nút tạo đơn hàng nhanh cho khách.

3. **`orders` & `order_items` (Quản lý đơn hàng):**
   - Quản lý mã đơn (`ORD-9021`), khách hàng, kênh bán (Shopee, TikTok Shop, Lazada), tổng tiền, kệ soạn hàng (`Kệ A-01, Kệ B-02`), và trạng thái đơn hàng (`Chờ soạn hàng`, `Đang gom hàng AI`, `Đã đóng gói`, `Đã bàn giao`).

---

## 🌟 2. Các Tính Năng Đặc Trưng Được Giữ Lại & Đơn Giản Hóa:

1. **🚀 AI Gom & Soạn Đơn (Batch Picking):**
   - Tự động gom nhiều đơn hàng thành 1 chuyến duy nhất, tính lộ trình đi bộ ngắn nhất qua các kệ (giảm từ 160m xuống 42m).
   - Tích hợp tiếng bíp âm thanh và quét mã vạch xác nhận.

2. **📦 Sơ đồ Kệ Hàng 2D & Tối ưu vị trí (Smart Slotting):**
   - Phân cấp vị trí kho: Vàng (gần cửa xuất), Bạc, Đồng.
   - AI tự động phát hiện hàng bán chạy và đề xuất dời về vị trí thuận tiện.

3. **📈 AI Dự Báo Nhu Cầu (Demand Forecasting):**
   - Phân tích chuỗi thời gian, cảnh báo cháy hàng trước ngày Mega Sale sàn.

4. **📷 Máy Quét Mã Vạch Thông Minh:**
   - Giả lập camera quét mã vạch và QR code trực tiếp.

5. **📥 Xuất Dữ Liệu Ra File Excel / CSV:**
   - Nút xuất file CSV (chuẩn UTF-8 không lỗi tiếng Việt) cho cả 3 bảng Tư vấn, Khách hàng và Đơn hàng.

---

## 🚀 Cách mở và kiểm tra trên máy:

* **Trang Landing Page tinh gọn:** 👉 [http://localhost:3000](http://localhost:3000)
* **Ứng dụng Quản lý kho & CSDL (MVP Dashboard):** 👉 [http://localhost:3000/app.html](http://localhost:3000/app.html)

---

## ⚡ Hướng dẫn cấu hình Gửi Email Tự Động & Google Sheet (1 phút):
1. Mở file Google Sheet quản lý đơn: **"Danh sách đơn mua"**.
2. Trên menu chọn **Tiện ích mở rộng (Extensions)** > **Apps Script**.
3. Dán toàn bộ nội dung từ file [`google_apps_script.js`](file:///C:/Users/Admin/.gemini/antigravity/scratch/optiwarehouse/google_apps_script.js) vào trình biên tập.
4. Bấm **Triển khai (Deploy)** > **Quản lý bản triển khai (Manage deployments)** > Sửa bản hiện tại (hoặc Triển khai mới) > Chọn **Phiên bản mới (New version)** > Bấm **Triển khai**.
5. Giờ đây, mỗi khi khách điền Form tại `index.html`:
   - Google Sheet sẽ tự động lưu thông tin (kèm Email).
   - Hệ thống tự động gửi email chào mừng kèm link mở ứng dụng `app.html` cho khách hàng!

---

## 🌐 Cập nhật lên GitHub (30 giây):
Tải đè các file mới (`index.html`, `app.html`, `schema.sql`, `google_apps_script.js`, `README.md`) lên GitHub tại:
👉 [https://github.com/duc261225-bit/optiwarehouse](https://github.com/duc261225-bit/optiwarehouse)
Web online sẽ tự động cập nhật tại:
👉 [https://duc261225-bit.github.io/optiwarehouse/](https://duc261225-bit.github.io/optiwarehouse/)
