import { hotels, rooms, users, bookings, formatPrice } from "../../data/mockData"
import { Link } from "react-router-dom"

export default function AdminDashboard() {
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.totalPrice, 0)

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Tổng quan hệ thống</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Khách sạn</p>
          <p className="text-3xl font-bold text-navy-900 mt-1">{hotels.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Phòng</p>
          <p className="text-3xl font-bold text-navy-900 mt-1">{rooms.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Người dùng</p>
          <p className="text-3xl font-bold text-navy-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Doanh thu (demo)</p>
          <p className="text-xl font-bold text-green-600 mt-1">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/hotels" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition text-center">
          <p className="font-semibold text-navy-900">Quản lý khách sạn</p>
          <p className="text-sm text-gray-500 mt-1">Thêm / Sửa / Xóa</p>
        </Link>
        <Link to="/admin/rooms" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition text-center">
          <p className="font-semibold text-navy-900">Quản lý phòng</p>
          <p className="text-sm text-gray-500 mt-1">Thêm / Sửa / Xóa</p>
        </Link>
        <Link to="/admin/users" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition text-center">
          <p className="font-semibold text-navy-900">Quản lý người dùng</p>
          <p className="text-sm text-gray-500 mt-1">Thêm / Sửa / Xóa</p>
        </Link>
      </div>
    </div>
  )
}
