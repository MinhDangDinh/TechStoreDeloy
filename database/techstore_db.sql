USE techstore_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    address VARCHAR(255) NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    stock INT DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled') DEFAULT 'pending',
    receiver_name VARCHAR(100) NULL,
    receiver_phone VARCHAR(20) NULL,
    shipping_address VARCHAR(255) NULL,
    shipping_method VARCHAR(50) NULL,
    payment_method VARCHAR(50) NULL,
    note TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO users (fullname, email, password, role)
VALUES
('Admin TechStore', 'admin@gmail.com', '123456', 'admin'),
('Nguyen Van A', 'user@gmail.com', '123456', 'customer');

INSERT INTO products (name, price, description, image, stock, category)
VALUES
('Laptop Dell Inspiron 15', 15000000, 'Laptop văn phòng, RAM 8GB, SSD 512GB', 'dell.jpg', 10, 'Laptop'),
('iPhone 15', 22000000, 'Điện thoại Apple iPhone 15 128GB', 'iphone15.jpg', 8, 'Phone'),
('Tai nghe Sony WH-1000XM5', 7500000, 'Tai nghe chống ồn cao cấp', 'sony.jpg', 15, 'Headphone'),
('Bàn phím cơ AKKO 3087', 1500000, 'Bàn phím cơ layout TKL, switch êm và keycap PBT', 'akko.jpg', 20, 'Keyboard'),
('Chuột Logitech G304', 850000, 'Chuột gaming không dây, cảm biến HERO tiết kiệm pin', 'g304.jpg', 25, 'Mouse'),
('MacBook Air M3 13 inch', 28990000, 'Laptop mỏng nhẹ, chip Apple M3, RAM 8GB, SSD 256GB', 'macbook-air-m3.jpg', 7, 'Laptop'),
('ASUS ROG Zephyrus G14', 42990000, 'Laptop gaming 14 inch, Ryzen 9, RTX 4060, màn hình 165Hz', 'rog-g14.jpg', 5, 'Laptop'),
('Samsung Galaxy S24', 19990000, 'Điện thoại Android cao cấp, màn hình AMOLED 120Hz, bộ nhớ 256GB', 'galaxy-s24.jpg', 12, 'Phone'),
('iPad Air M2 11 inch', 16990000, 'Máy tính bảng Apple M2, hỗ trợ Apple Pencil Pro', 'ipad-air-m2.jpg', 9, 'Tablet'),
('Màn hình LG UltraGear 27GP850', 7990000, 'Màn hình gaming 27 inch QHD, tần số quét 165Hz', 'lg-ultragear.jpg', 11, 'Monitor'),
('SSD Samsung 990 EVO 1TB', 2490000, 'Ổ cứng SSD NVMe Gen 4 dung lượng 1TB, tốc độ cao', 'samsung-990-evo.jpg', 18, 'Storage'),
('Loa Bluetooth JBL Charge 5', 3990000, 'Loa di động chống nước IP67, âm bass mạnh, pin lâu', 'jbl-charge-5.jpg', 14, 'Speaker'),
('Webcam Logitech Brio 4K', 5290000, 'Webcam 4K HDR cho họp trực tuyến và livestream', 'logitech-brio.jpg', 10, 'Accessory'),
('Router TP-Link Archer AX73', 3290000, 'Router Wi-Fi 6 băng tần kép, phù hợp nhà nhiều thiết bị', 'archer-ax73.jpg', 16, 'Network'),
('Tay cầm Xbox Wireless Controller', 1690000, 'Tay cầm chơi game không dây cho PC, Xbox và thiết bị di động', 'xbox-controller.jpg', 22, 'Gaming'),
('Dell XPS 13 Plus', 34990000, 'Laptop ultrabook vỏ nhôm, màn hình 13.4 inch, Intel Core Ultra 7', 'dell-xps-13-plus.jpg', 6, 'Laptop'),
('Lenovo Legion Slim 5', 32990000, 'Laptop gaming mỏng, Ryzen 7, RTX 4060, tản nhiệt tối ưu', 'lenovo-legion-slim-5.jpg', 8, 'Laptop'),
('Google Pixel 8 Pro', 23990000, 'Điện thoại Android camera AI, màn hình OLED 120Hz, bộ nhớ 256GB', 'pixel-8-pro.jpg', 9, 'Phone'),
('Samsung Galaxy Tab S9 FE', 11990000, 'Máy tính bảng Android chống nước, bút S Pen, pin dùng cả ngày', 'galaxy-tab-s9-fe.jpg', 13, 'Tablet'),
('Màn hình Dell UltraSharp U2723QE', 13990000, 'Màn hình 27 inch 4K, tấm nền IPS Black, hub USB-C 90W', 'dell-u2723qe.jpg', 7, 'Monitor'),
('Tai nghe AirPods Pro 2', 5990000, 'Tai nghe không dây chống ồn chủ động, hộp sạc USB-C', 'airpods-pro-2.jpg', 20, 'Headphone'),
('Bàn phím Keychron K2 Pro', 2890000, 'Bàn phím cơ không dây layout 75%, hot-swap, hỗ trợ Mac và Windows', 'keychron-k2-pro.jpg', 17, 'Keyboard'),
('Chuột Logitech MX Master 3S', 2490000, 'Chuột văn phòng cao cấp, cuộn MagSpeed, kết nối đa thiết bị', 'mx-master-3s.jpg', 19, 'Mouse'),
('Ổ cứng WD Black SN850X 2TB', 4990000, 'SSD NVMe Gen 4 hiệu năng cao cho PC gaming và máy trạm', 'wd-black-sn850x.jpg', 12, 'Storage'),
('Micro HyperX QuadCast S', 3290000, 'Micro USB RGB cho streamer, nhiều chế độ thu âm, chân chống rung', 'hyperx-quadcast-s.jpg', 10, 'Accessory'),
('Loa Marshall Emberton II', 4490000, 'Loa Bluetooth nhỏ gọn, âm thanh 360 độ, chống nước IP67', 'marshall-emberton-2.jpg', 11, 'Speaker'),
('Bộ Mesh TP-Link Deco X50', 4590000, 'Hệ thống Wi-Fi 6 Mesh phủ sóng rộng cho nhà nhiều tầng', 'deco-x50.jpg', 15, 'Network');

/*
SHOW TABLES;

SELECT * FROM users;
SELECT * FROM products;
*/
