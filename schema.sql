-- ==============================================================
-- OPTIWAREHOUSE DATABASE SCHEMA
-- HỆ THỐNG CƠ SỞ DỮ LIỆU KHO THÔNG MINH TINH GỌN (SME / WMS)
-- ==============================================================

-- 1. BẢNG KHÁCH HÀNG (CUSTOMERS)
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_code VARCHAR(20) UNIQUE NOT NULL,      -- Mã KH (vd: KH-1001)
    full_name VARCHAR(100) NOT NULL,                -- Họ và tên
    phone VARCHAR(20) NOT NULL,                     -- Số điện thoại
    email VARCHAR(100),                             -- Email liên hệ
    company_or_shop VARCHAR(150),                   -- Tên shop / Kho
    address TEXT,                                   -- Địa chỉ giao dịch
    channel VARCHAR(50) DEFAULT 'Shopee',           -- Kênh mua chính (Shopee, TikTok, Lazada, Trực tiếp)
    total_orders INTEGER DEFAULT 0,                 -- Tổng số đơn hàng đã đặt
    total_spent DECIMAL(15, 2) DEFAULT 0.00,        -- Tổng giá trị đã chi tiêu
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Ngày tạo
);

-- 2. BẢNG THÔNG TIN TƯ VẤN (CONSULTATIONS / LEADS TỪ WEBSITE)
CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name VARCHAR(100) NOT NULL,                -- Họ tên khách đăng ký tư vấn
    phone VARCHAR(20) NOT NULL,                     -- SĐT / Zalo
    email VARCHAR(100),                             -- Email nhận ứng dụng dùng thử
    warehouse_size VARCHAR(50),                     -- Quy mô kho (< 100m², 100 - 300m², 300 - 1000m²...)
    sales_channel VARCHAR(150),                     -- Kênh bán hàng chính (Shopee, TikTok, Offline...)
    note TEXT,                                      -- Ghi chú nhu cầu tư vấn
    status VARCHAR(30) DEFAULT 'Mới',               -- Trạng thái: 'Mới', 'Đã gọi tư vấn', 'Đang demo', 'Đã chốt hợp đồng', 'Đã hủy'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Thời gian gửi yêu cầu
);

-- 3. BẢNG ĐƠN HÀNG (ORDERS)
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code VARCHAR(30) UNIQUE NOT NULL,         -- Mã đơn hàng (vd: ORD-9021)
    customer_id INTEGER,                            -- Khóa ngoại liên kết bảng customers
    customer_name VARCHAR(100) NOT NULL,            -- Tên khách hàng nhận đơn
    customer_phone VARCHAR(20),                     -- SĐT nhận hàng
    channel VARCHAR(50) NOT NULL,                   -- Nguồn đơn: 'Shopee', 'TikTok Shop', 'Lazada', 'Kho lẻ'
    total_amount DECIMAL(15, 2) NOT NULL,           -- Tổng tiền đơn hàng
    status VARCHAR(50) DEFAULT 'Chờ soạn hàng',     -- Trạng thái: 'Chờ soạn hàng', 'Đang gom hàng AI', 'Đã kiểm barcode', 'Đã đóng gói', 'Đã bàn giao'
    picking_racks VARCHAR(100),                     -- Vị trí kệ cần lấy (vd: 'Kệ A-01, Kệ B-02')
    items_summary TEXT,                             -- Tóm tắt các món hàng (vd: 'Áo Polo x1, Quần Jean x1')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm phát sinh đơn
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- 4. BẢNG CHI TIẾT ĐƠN HÀNG (ORDER_ITEMS)
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,                      -- Khóa ngoại liên kết bảng orders
    sku VARCHAR(50) NOT NULL,                       -- Mã SKU sản phẩm (vd: SKU-POLO-L)
    product_name VARCHAR(150) NOT NULL,             -- Tên sản phẩm
    rack_location VARCHAR(50) NOT NULL,             -- Vị trí kệ lưu trữ (vd: Kệ A-01, Tầng 2)
    barcode VARCHAR(30) NOT NULL,                   -- Mã vạch sản phẩm (vd: 89360012301)
    quantity INTEGER NOT NULL DEFAULT 1,            -- Số lượng
    unit_price DECIMAL(15, 2) NOT NULL,             -- Đơn giá
    is_picked BOOLEAN DEFAULT 0,                    -- Đã quét mã nhặt hàng thành công chưa
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ==============================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- ==============================================================

-- Thêm khách hàng mẫu
INSERT OR IGNORE INTO customers (id, customer_code, full_name, phone, email, company_or_shop, address, channel, total_orders, total_spent) VALUES
(1, 'KH-1001', 'Nguyễn Thị Mai', '0988123456', 'mai.nguyen@gmail.com', 'Shop Thời Trang Mây', 'Đống Đa, Hà Nội', 'Shopee', 8, 4850000),
(2, 'KH-1002', 'Trần Văn Hoàng', '0912345678', 'hoang.tran@gmail.com', 'Tổng Kho Gia Dụng HN', 'Cầu Giấy, Hà Nội', 'TikTok Shop', 15, 12600000),
(3, 'KH-1003', 'Lê Hữu Đạt', '0977889900', 'dat.le@gmail.com', 'Đạt Sneaker Store', 'Quận 1, TP. HCM', 'Lazada', 5, 3450000);

-- Thêm yêu cầu tư vấn mẫu (như khi khách điền ở landing page)
INSERT OR IGNORE INTO consultations (id, full_name, phone, warehouse_size, sales_channel, note, status) VALUES
(1, 'Phạm Quang Đức', '0916280365', '100 - 300m²', 'TikTok Shop, Shopee', 'Cần tư vấn giải pháp gom đơn tự động và quét mã vạch cho 3 nhân viên', 'Mới'),
(2, 'Vũ Minh Châu', '0903112233', 'Kho nhỏ (< 100m²)', 'Shopee, Facebook', 'Quan tâm tính năng cảnh báo tồn kho và dự báo nhập hàng', 'Đã gọi tư vấn'),
(3, 'Hoàng Tuấn Anh', '0944556677', '300 - 1000m²', 'Chuỗi 2 kho tại Hà Nội', 'Cần tích hợp quản lý theo hạn sử dụng hàng mỹ phẩm', 'Đang demo');

-- Thêm đơn hàng mẫu
INSERT OR IGNORE INTO orders (id, order_code, customer_id, customer_name, customer_phone, channel, total_amount, status, picking_racks, items_summary) VALUES
(1, 'ORD-9021', 1, 'Nguyễn Thị Mai', '0988123456', 'Shopee', 350000, 'Chờ soạn hàng', 'Kệ A-01', 'Áo Thun Polo Regular (Size L) x 1'),
(2, 'ORD-9022', 2, 'Trần Văn Hoàng', '0912345678', 'TikTok Shop', 780000, 'Chờ soạn hàng', 'Kệ A-02, Kệ D-01', 'Quần Jean Slimfit Nam x 1, Thắt Lưng Da x 1'),
(3, 'ORD-9023', 3, 'Lê Hữu Đạt', '0977889900', 'Shopee', 590000, 'Chờ soạn hàng', 'Kệ B-02', 'Giày Sneaker Vintage (Size 41) x 1'),
(4, 'ORD-9020', 1, 'Nguyễn Thị Mai', '0988123456', 'Lazada', 890000, 'Đã đóng gói', 'Kệ B-01', 'Áo Khoác Gió Bomber x 2');

-- Thêm chi tiết món hàng cho ORD-9021 và ORD-9022
INSERT OR IGNORE INTO order_items (id, order_id, sku, product_name, rack_location, barcode, quantity, unit_price, is_picked) VALUES
(1, 1, 'SKU-POLO-L', 'Áo Thun Polo Regular Size L', 'Kệ A-01', '89360012301', 1, 350000, 0),
(2, 2, 'SKU-JEAN-31', 'Quần Jean Slimfit Nam Size 31', 'Kệ A-02', '89360012302', 1, 490000, 0),
(3, 2, 'SKU-BELT-01', 'Thắt Lưng Da Bò Handmade', 'Kệ D-01', '89360012304', 1, 290000, 0),
(4, 3, 'SKU-SNEAKER-41', 'Giày Sneaker Vintage Size 41', 'Kệ B-02', '89360012303', 1, 590000, 0),
(5, 4, 'SKU-BOMBER-M', 'Áo Khoác Gió Bomber', 'Kệ B-01', '89360012305', 2, 445000, 1);
