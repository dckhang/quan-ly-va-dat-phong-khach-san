# HotelBook Backend API

Backend cho hệ thống **Quản lý & Đặt phòng khách sạn** (đồ án).

## Công nghệ
- Node.js + Express
- MongoDB + Mongoose
- JWT (xác thực + phân quyền)
- bcryptjs (hash mật khẩu)

## Cài đặt

```bash
# 1. Cài dependencies
npm install

# 2. Copy file môi trường
cp .env.example .env
# (chỉnh MONGODB_URI nếu cần)

# 3. Chạy MongoDB (local hoặc Atlas)

# 4. Seed dữ liệu mẫu
npm run seed

# 5. Chạy server
npm run dev
```

Server chạy tại: `http://localhost:5000`

## Tài khoản demo (sau khi seed)

| Vai trò   | Email               | Mật khẩu |
|-----------|---------------------|----------|
| Admin     | admin@hotel.com     | 123456   |
| Nhân viên | staff@hotel.com     | 123456   |
| Khách     | customer@gmail.com  | 123456   |

## API Endpoints

### Auth
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/auth/register` | Đăng ký | Public |
| POST | `/api/auth/login` | Đăng nhập | Public |
| GET | `/api/auth/me` | Thông tin user hiện tại | Login |
| PUT | `/api/auth/profile` | Cập nhật profile | Login |

### Hotels
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| GET | `/api/hotels` | Danh sách + tìm kiếm | Public |
| GET | `/api/hotels/:id` | Chi tiết khách sạn | Public |
| POST | `/api/hotels` | Thêm khách sạn | Admin |
| PUT | `/api/hotels/:id` | Sửa khách sạn | Admin |
| DELETE | `/api/hotels/:id` | Xóa (soft) | Admin |

### Rooms
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| GET | `/api/rooms/search` | Tìm phòng còn trống | Public |
| GET | `/api/rooms/types/:id` | Chi tiết loại phòng | Public |
| POST | `/api/rooms/types` | Thêm loại phòng | Admin |
| PUT | `/api/rooms/types/:id` | Sửa loại phòng | Admin |
| DELETE | `/api/rooms/types/:id` | Xóa loại phòng | Admin |
| GET | `/api/rooms` | Danh sách phòng vật lý | Staff/Admin |
| POST | `/api/rooms` | Thêm phòng vật lý | Admin |
| PUT | `/api/rooms/:id/status` | Cập nhật trạng thái phòng | Staff/Admin |

### Bookings
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/bookings` | Tạo đơn đặt phòng | Customer |
| GET | `/api/bookings/my` | Đơn của tôi | Customer |
| GET | `/api/bookings` | Tất cả đơn | Staff/Admin |
| GET | `/api/bookings/:id` | Chi tiết đơn | Login |
| PUT | `/api/bookings/:id/status` | Xác nhận / Check-in / Check-out | Staff/Admin |

### Payments
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/payments/:bookingId/pay` | Thanh toán đơn (mô phỏng MoMo/VNPay) | Customer |
| GET | `/api/payments/booking/:bookingId` | Xem thanh toán của 1 đơn | Login |
| GET | `/api/payments` | Danh sách thanh toán | Staff/Admin |
| PUT | `/api/payments/:id/refund` | Hoàn tiền | Staff/Admin |

**Phương thức:** `cash`, `bank_transfer`, `momo`, `vnpay`, `credit_card`

### Users (Admin)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/users` | Danh sách user |
| POST | `/api/users` | Tạo user (staff/admin) |
| PUT | `/api/users/:id` | Sửa user |
| DELETE | `/api/users/:id` | Khóa user |

## Query params tìm kiếm

**GET /api/hotels**
- `city`, `keyword`, `stars`, `minPrice`, `maxPrice`

**GET /api/rooms/search**
- `city`, `hotelId`, `checkIn`, `checkOut`, `guests`

## Trạng thái đơn đặt phòng
`pending` → `confirmed` / `rejected` → `checked_in` → `checked_out`

## Cấu trúc thư mục
```
src/
├── config/db.js
├── models/        User, Hotel, RoomType, Room, Booking, Payment
├── controllers/
├── routes/
├── middlewares/auth.js
├── utils/
├── app.js
└── server.js
```
