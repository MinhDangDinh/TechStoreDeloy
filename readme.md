# TechStore
## 1. Công nghệ sử dụng
### Frontend
- ReactJS
- Vite
- React Router DOM
- Axios
- CSS
### Backend
- Node.js
- Express.js
- MySQL2
- JSON Web Token
- bcryptjs
- multer
- cors
- dotenv
### Database
- MySQL
### Công cụ phát triển
- Visual Studio Code
- MySQL Workbench
- Thunder Client / Postman
## 2. Cấu trúc thư mục
```text
TechStore/
├─ backend/
│  ├─ app.js
│  ├─ package.json
│  ├─ config/
│  │  └─ db.js
│  ├─ middleware/
│  │  └─ authMiddleware.js
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  ├─ productRoutes.js
│  │  ├─ orderRoutes.js
│  │  └─ userRoutes.js
│  └─ uploads/
│     └─ products/
│        └─ no-image.png
│
├─ frontend/
│  ├─ package.json
│  ├─ index.html
│  └─ src/
│     ├─ App.jsx
│     ├─ main.jsx
│     ├─ App.css
│     ├─ services/
│     │  └─ api.js
│     ├─ components/
│     │  ├─ Header.jsx
│     │  └─ ProductImage.jsx
│     └─ pages/
│        ├─ Home.jsx
│        ├─ Login.jsx
│        ├─ Register.jsx
│        ├─ ProductDetail.jsx
│        ├─ Cart.jsx
│        ├─ Checkout.jsx
│        ├─ MyOrders.jsx
│        ├─ Profile.jsx
│        ├─ AdminProducts.jsx
│        └─ AdminOrders.jsx
│
├─ database/
│  └─ techstore_db.sql
│
└─ README.md
```
## 3. Các chức năng chính
### Customer
- Đăng ký tài khoản.
- Đăng nhập và đăng xuất.
- Xem danh sách sản phẩm.
- Tìm kiếm sản phẩm theo tên.
- Lọc sản phẩm theo danh mục.
- Xem chi tiết sản phẩm.
- Thêm sản phẩm vào giỏ hàng.
- Cập nhật số lượng hoặc xóa sản phẩm khỏi giỏ hàng.
- Checkout mô phỏng.
- Nhập thông tin người nhận, số điện thoại, địa chỉ giao hàng và ghi chú.
- Chọn phương thức vận chuyển.
- Chọn phương thức thanh toán mô phỏng.
- Xem danh sách đơn hàng của mình.
- Cập nhật hồ sơ cá nhân.
- Đổi mật khẩu.
### Admin
- Đăng nhập và đăng xuất.
- Xem danh sách sản phẩm.
- Thêm sản phẩm mới.
- Upload ảnh sản phẩm từ máy tính.
- Sửa thông tin sản phẩm.
- Giữ ảnh cũ hoặc thay ảnh mới khi sửa sản phẩm.
- Xóa sản phẩm.
- Xem danh sách tất cả đơn hàng.
- Xem thông tin giao hàng và thanh toán của đơn hàng.
- Cập nhật trạng thái đơn hàng.
## 4. Yêu cầu trước khi chạy
Máy cần cài đặt:
- Node.js
- MySQL
- MySQL Workbench hoặc công cụ quản lý MySQL tương đương
- Visual Studio Code
## 5. Cài đặt database
Mở MySQL Workbench và chạy file SQL:
```text
database/techstore_db.sql
```
File này dùng để tạo database `techstore_db`, tạo các bảng cần thiết và thêm dữ liệu mẫu.
Sau khi import thành công, database cần có các bảng chính:
```text
users
products
orders
order_items
```
## 6. Cấu hình backend
Vào thư mục `backend` và tạo file `.env`.
Có thể copy từ file `.env.example` nếu có:
```bash
copy .env.example .env
```
Nội dung file `.env` mẫu:
```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=techstore_db
DB_PORT=3306

JWT_SECRET=techstore_secret_key
```
Sửa `DB_USER` và `DB_PASSWORD` theo cấu hình MySQL trên máy đang chạy.
## 7. Chạy backend
Mở terminal tại thư mục project:
```bash
cd backend
npm install
npm run dev
```
Backend chạy tại:
```text
http://localhost:5000
```
Kiểm tra backend bằng trình duyệt:
```text
http://localhost:5000
```
Nếu backend chạy đúng, màn hình sẽ hiển thị thông báo API đang hoạt động.
## 8. Chạy frontend
Mở terminal mới tại thư mục project:
```bash
cd frontend
npm install
npm run dev
```
Frontend chạy tại:
```text
http://localhost:5173
```
Mở trình duyệt và truy cập:
```text
http://localhost:5173
```
# 9. Tài khoản đăng nhập mẫu
Có thể sử dụng tài khoản mẫu trong database sau khi import file SQL.
### Admin
```text
Email: admin@techstore.com
Password: 123456
```
### Customer
```text
Email: user@techstore.com
Password: 123456
```

Nếu tài khoản mẫu khác với thông tin trên, vui lòng kiểm tra trực tiếp trong bảng `users` của database.


## 13. Ghi chú

Project được xây dựng phục vụ mục đích học tập . Một số chức năng như thanh toán trực tuyến thật, gửi email xác nhận, đánh giá sản phẩm, dashboard thống kê và deploy production chưa được triển khai trong phiên bản hiện tại.
