# OptiWarehouse - Smart Mini WMS with AI 🚀

Hệ thống quản lý kho thông minh tinh gọn thế hệ mới tích hợp Trí Tuệ Nhân Tạo (AI) dành riêng cho doanh nghiệp vừa & nhỏ (SMEs), chủ shop thương mại điện tử (Shopee, TikTok Shop, Lazada).

---

## 📂 Cấu trúc dự án:

```
optiwarehouse/
├── index.html     # Website Landing Page giới thiệu sản phẩm & tính năng
├── app.html       # Ứng dụng Quản lý kho MVP Dashboard (Bản dùng thử hoạt động thực tế)
└── README.md      # Tài liệu hướng dẫn sử dụng & triển khai
```

---

## 🌟 Các tính năng cốt lõi trong Bản thử nghiệm (MVP App - `app.html`):

1. **📊 Tổng quan vận hành (Dashboard):**
   - Theo dõi số lượng đơn chờ soạn từ Shopee/TikTok Shop theo thời gian thực.
   - Thống kê thời gian soạn hàng trung bình, tỷ lệ độ chính xác kiểm kê (99.9%).
   - Nút mô phỏng *"Bắn đơn test từ TikTok/Shopee"* để xem hệ thống nhận đơn mới tức thì.

2. **🚀 AI Gom & Soạn đơn thông minh (Smart Batch Picking):**
   - Tự động gom nhiều đơn hàng thành 1 chuyến lấy hàng duy nhất.
   - Chỉ dẫn nhân viên di chuyển theo lộ trình ngắn nhất (rút ngắn quãng đường từ 160m xuống 42m).
   - Tích hợp âm thanh phản hồi bíp khi quét mã vạch và thanh đo tiến độ soạn hàng.

3. **📦 Sơ đồ Kệ hàng 2D & Tối ưu vị trí (Smart Slotting):**
   - Trực quan hóa mặt bằng kho 8 kệ hàng theo chuẩn vị trí Vàng – Bạc – Đồng.
   - AI tự động phát hiện hàng bán chạy ở góc xa và đề xuất nút: *"Chấp nhận dời về Kệ A-01 gần cửa"*.

4. **📈 AI Dự báo Nhu cầu (Demand Forecasting):**
   - Phân tích chuỗi thời gian, cảnh báo nguy cơ hết hàng trước ngày Mega Sale (Runway days).
   - Tự động gợi ý số lượng cần nhập thêm kèm nút *"Tạo Lệnh Đặt Hàng (PO)"*.

5. **📷 Máy Quét Mã Vạch Barcode / QR Simulator:**
   - Khung camera quét mã trực tiếp, kiểm tra khớp mã sản phẩm và cảnh báo nếu nhặt nhầm kích thước / màu sắc.

---

## 🚀 Cách mở và kiểm tra trực tiếp:

* **Trang Landing Page:** 👉 [http://localhost:3000](http://localhost:3000)
* **Ứng dụng Quản lý kho (MVP Dashboard):** 👉 [http://localhost:3000/app.html](http://localhost:3000/app.html)

---

## 🌐 Xuất bản lên GitHub:
Khi bạn tải 3 file (`index.html`, `app.html`, `README.md`) lên GitHub và bật **GitHub Pages**, bạn sẽ có 2 đường link chạy online miễn phí:
- Landing Page: `https://<username>.github.io/optiwarehouse/`
- Ứng dụng Dashboard: `https://<username>.github.io/optiwarehouse/app.html`
