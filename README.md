# HotelBook – Website Quản lý và Đặt phòng Khách sạn

Đồ án xây dựng hệ thống website **đặt phòng nhiều khách sạn / nhiều chi nhánh** trực tuyến. Khách hàng tìm phòng, đặt cọc và thanh toán; nhân viên xử lý đơn, check-in/check-out; quản trị viên quản lý toàn bộ hệ thống.

## Mục tiêu

- Hỗ trợ khách hàng tìm kiếm, xem và đặt phòng khách sạn trực tuyến.
- Hỗ trợ nhân viên/quản trị viên quản lý khách sạn, phòng, người dùng, đơn đặt phòng và thanh toán.
- Giảm thời gian xử lý và nâng cao hiệu quả quản lý so với phương pháp truyền thống.

## Đối tượng sử dụng

| Vai trò | Chức năng chính |
|---------|-----------------|
| **Khách hàng** | Tìm kiếm phòng, xem chi tiết, đặt phòng, đặt cọc/thanh toán, xem và hủy đơn, viết đánh giá, đọc bài viết |
| **Nhân viên** | Xác nhận/từ chối đơn, check-in/check-out, cập nhật trạng thái phòng, thu tiền còn lại, hoàn tiền |
| **Quản trị viên** | Quản lý khách sạn, loại phòng, phòng, người dùng, đơn đặt phòng, đánh giá, bài viết |

## Chức năng chính

- Đăng ký / Đăng nhập (JWT), phân quyền theo vai trò (customer / staff / admin).
- Tìm kiếm khách sạn theo thành phố, từ khóa, số sao, khoảng giá; tìm phòng còn trống theo ngày nhận/trả phòng và số khách.
- Đặt phòng với **cọc 30%**, giữ phòng **30 phút**; quá hạn chưa cọc thì đơn tự chuyển sang hết hạn.
- Thanh toán mô phỏng: tiền mặt, chuyển khoản, MoMo, VNPay, thẻ tín dụng. Hỗ trợ trả cọc, trả phần còn lại và hoàn tiền.
- Khách hàng xem lịch sử đơn và hủy đơn (trước khi check-in).
- Đánh giá khách sạn, bài viết/blog, trang giới thiệu.
- Dashboard cho nhân viên và quản trị viên.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend (`luxoria-react`) | React 19, Vite 6, Tailwind CSS 4, React Router DOM 7 |
| Backend (`hotelbook-backend`) | Node.js, Express 4, Mongoose 8, JWT, bcryptjs, CORS, Morgan |
| Cơ sở dữ liệu | MongoDB |

## Cấu trúc thư mục

```
.
├── hotelbook-backend/      # REST API (Node.js + Express + MongoDB)
│   └── src/
│       ├── config/         # Kết nối MongoDB
│       ├── models/         # User, Hotel, RoomType, Room, Booking, Payment, Review, Article
│       ├── controllers/
│       ├── routes/
│       ├── middlewares/    # Xác thực JWT, phân quyền
│       ├── utils/          # generateToken, seed dữ liệu mẫu
│       ├── app.js
│       └── server.js
├── luxoria-react/          # Giao diện web (React + Vite)
│   └── src/
│       ├── api/            # Client gọi API
│       ├── components/
│       ├── context/        # AuthContext
│       ├── layouts/        # MainLayout, DashboardLayout
│       └── pages/          # Trang khách hàng, staff/, admin/
├── khung đồ án.docx
├── Đoàn Chí Khang_Chương 1,2.docx
└── README.md
```

## Yêu cầu hệ thống

- Node.js 18 trở lên
- MongoDB chạy local (`mongodb://127.0.0.1:27017`) hoặc MongoDB Atlas

## Cài đặt và chạy

### 1. Backend

```bash
cd hotelbook-backend
npm install
cp .env.example .env      # chỉnh MONGODB_URI, JWT_SECRET nếu cần
npm run seed              # nạp dữ liệu mẫu (xóa dữ liệu cũ)
npm run dev               # http://localhost:5000
```

Biến môi trường (`hotelbook-backend/.env`):

| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `PORT` | Cổng server | `5000` |
| `MONGODB_URI` | Chuỗi kết nối MongoDB | `mongodb://127.0.0.1:27017/hotelbook` |
| `JWT_SECRET` | Khóa ký JWT (đặt chuỗi riêng, bí mật) | – |
| `JWT_EXPIRES_IN` | Thời hạn token | `7d` |

Kiểm tra server: `GET http://localhost:5000/api/health`

### 2. Frontend

```bash
cd luxoria-react
npm install
npm run dev               # http://localhost:5173
```

Biến môi trường (`luxoria-react/.env`):

| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `VITE_API_URL` | Địa chỉ API backend | `http://localhost:5000/api` |

Build production: `npm run build`, xem thử: `npm run preview`.

## Tài khoản demo (sau khi chạy `npm run seed`)

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Quản trị viên | admin@hotel.com | 123456 |
| Nhân viên | staff@hotel.com | 123456 |
| Khách hàng | customer@gmail.com | 123456 |

Dữ liệu mẫu gồm các khách sạn/chi nhánh tại Hà Nội, Đà Nẵng, Nha Trang, Phú Quốc, Hội An, Sapa, Vũng Tàu, Đà Lạt cùng loại phòng, phòng, đánh giá và bài viết.

## Các trang giao diện

**Khách hàng:** `/` Trang chủ · `/search` Tìm kiếm · `/hotels/:id` Chi tiết khách sạn · `/rooms/:id` Chi tiết phòng và đặt phòng · `/login` · `/register` · `/my-bookings` · `/about` · `/blog` · `/blog/:id`

**Nhân viên:** `/staff` · `/staff/bookings` · `/staff/checkin`

**Quản trị viên:** `/admin` · `/admin/hotels` · `/admin/rooms` · `/admin/users` · `/admin/bookings` · `/admin/reviews` · `/admin/articles`

## API

Tiền tố `/api`. Chi tiết từng endpoint xem [hotelbook-backend/README.md](hotelbook-backend/README.md).

| Nhóm | Endpoint gốc | Ghi chú |
|------|--------------|---------|
| Auth | `/api/auth` | register, login, me, profile |
| Hotels | `/api/hotels` | Tìm kiếm công khai, CRUD (admin) |
| Rooms | `/api/rooms` | Tìm phòng trống, loại phòng, phòng vật lý |
| Bookings | `/api/bookings` | Tạo đơn, đơn của tôi, hủy, đổi trạng thái (staff/admin) |
| Payments | `/api/payments` | Trả cọc, trả phần còn lại, hoàn tiền |
| Reviews | `/api/reviews` | Đánh giá khách sạn |
| Articles | `/api/articles` | Bài viết/blog |
| Users | `/api/users` | Quản lý người dùng (admin) |

## Luồng trạng thái đơn đặt phòng

```
awaiting_deposit → deposit_paid → confirmed → checked_in → fully_paid → checked_out
awaiting_deposit → expired        (quá 30 phút chưa cọc)
deposit_paid / confirmed → cancelled hoặc rejected
```

## Lưu ý

- Thanh toán là **mô phỏng**, chưa tích hợp cổng thanh toán thật (MoMo, VNPay).
- Mật khẩu tài khoản demo chỉ dùng cho môi trường học tập; hãy đổi `JWT_SECRET` và mật khẩu khi triển khai thật.

## Tiến độ đồ án

| Checkpoint | Nội dung | Trạng thái |
|------------|----------|------------|
| CP1. Đăng ký đề tài | Tên đề tài, mục tiêu, phạm vi, công nghệ | Hoàn thành |
| CP2. Phân tích | Yêu cầu nghiệp vụ, use case, dữ liệu, ràng buộc | Hoàn thành |
| CP3. Thiết kế | Kiến trúc, CSDL, UI/UX | Hoàn thành |
| CP4. Triển khai | Lập trình chức năng cốt lõi | Hoàn thành |
| CP5. Kiểm thử | Test case, sửa lỗi, tối ưu | Hoàn thành |
| CP6. Báo cáo & Demo | Báo cáo cuối, source code, video demo | Hoàn thành |

## Tác giả

Đoàn Chí Khang