# HotelBook – Frontend (Đồ án Quản lý & Đặt phòng khách sạn)

Nền tảng tìm kiếm và đặt phòng **nhiều khách sạn** theo đúng đề tài.

## Công nghệ
- React 19 + Vite
- Tailwind CSS 4
- React Router DOM

## Cài đặt & Chạy

```bash
npm install
npm run dev
```

Mở `http://localhost:5173`

## Tài khoản demo

| Vai trò     | Email              | Mật khẩu |
|-------------|--------------------|----------|
| Admin       | admin@hotel.com    | 123456   |
| Nhân viên   | staff@hotel.com    | 123456   |
| Khách hàng  | bất kỳ email       | bất kỳ   |

## Các trang đã có

### Khách hàng
- `/` – Trang chủ + form tìm kiếm
- `/search` – Kết quả tìm kiếm + bộ lọc
- `/hotels/:id` – Chi tiết khách sạn + danh sách phòng
- `/rooms/:id` – Chi tiết phòng + form đặt phòng
- `/login` – Đăng nhập
- `/register` – Đăng ký
- `/my-bookings` – Lịch sử đơn đặt phòng

### Nhân viên
- `/staff` – Dashboard
- `/staff/bookings` – Xác nhận / Từ chối đơn
- `/staff/checkin` – Check-in / Check-out

### Admin
- `/admin` – Dashboard tổng quan
- `/admin/hotels` – Quản lý khách sạn (CRUD)
- `/admin/rooms` – Quản lý phòng
- `/admin/users` – Quản lý người dùng

## Cấu trúc

```
src/
├── data/mockData.js
├── layouts/
│   ├── MainLayout.jsx
│   └── DashboardLayout.jsx
├── pages/
│   ├── Home.jsx
│   ├── Search.jsx
│   ├── HotelDetail.jsx
│   ├── RoomDetail.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── MyBookings.jsx
│   ├── staff/
│   └── admin/
├── App.jsx
└── index.css
```

## Ghi chú
- Dữ liệu hiện tại là **mock data** (chưa nối Backend).
- Khi có API Node.js + MongoDB, chỉ cần thay thế các hàm fetch trong từng page.
