import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api, formatPrice } from "../../api/client"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ hotels: 0, bookings: 0, users: 0, revenue: 0, awaiting: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.getHotels().catch(() => ({ data: [] })),
      api.getAllBookings().catch(() => ({ data: [] })),
      api.getUsers().catch(() => ({ data: [] })),
    ]).then(([h, b, u]) => {
      const bookings = b.data || []
      const revenue = bookings
        .filter((x) => ["deposit_paid", "confirmed", "checked_in", "fully_paid", "checked_out"].includes(x.status))
        .reduce((s, x) => s + (x.depositAmount || 0) + (x.status === "fully_paid" || x.status === "checked_out" ? (x.remainingAmount || 0) : 0), 0)
      setStats({
        hotels: (h.data || []).length,
        bookings: bookings.length,
        users: (u.data || []).length,
        revenue,
        awaiting: bookings.filter((x) => x.status === "awaiting_deposit").length,
      })
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-500">Đang tải...</p>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Tổng quan hệ thống</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Chi nhánh</p>
          <p className="text-3xl font-bold text-navy-900 mt-1">{stats.hotels}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Đơn đặt phòng</p>
          <p className="text-3xl font-bold text-navy-900 mt-1">{stats.bookings}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Người dùng</p>
          <p className="text-3xl font-bold text-navy-900 mt-1">{stats.users}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Chờ duyệt cọc</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{stats.awaiting}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
        <p className="text-sm text-gray-500">Doanh thu ước tính (đã cọc / đã đủ)</p>
        <p className="text-2xl font-bold text-green-600 mt-1">{formatPrice(stats.revenue)}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/hotels" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition text-center">
          <p className="font-semibold text-navy-900">Chi nhánh</p>
          <p className="text-sm text-gray-500 mt-1">Thêm / Xóa</p>
        </Link>
        <Link to="/admin/bookings" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition text-center">
          <p className="font-semibold text-navy-900">Đơn đặt phòng</p>
          <p className="text-sm text-gray-500 mt-1">Duyệt cọc / Xác nhận</p>
        </Link>
        <Link to="/admin/rooms" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition text-center">
          <p className="font-semibold text-navy-900">Phòng</p>
          <p className="text-sm text-gray-500 mt-1">Trạng thái phòng</p>
        </Link>
        <Link to="/admin/users" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition text-center">
          <p className="font-semibold text-navy-900">Người dùng</p>
          <p className="text-sm text-gray-500 mt-1">Phân quyền</p>
        </Link>
      </div>
    </div>
  )
}
