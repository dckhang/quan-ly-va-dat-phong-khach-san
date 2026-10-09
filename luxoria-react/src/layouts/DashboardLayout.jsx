import { Outlet, Link, useLocation, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function DashboardLayout({ role = "admin" }) {
  const location = useLocation()
  const { user, isLoggedIn, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải...</div>
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Chỉ đúng role mới vào
  if (role === "admin" && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg">Bạn không có quyền Admin.</p>
        <p className="text-sm text-gray-500">Đang đăng nhập: {user?.email} ({user?.role})</p>
        <Link to="/login" className="text-gold-600 underline">Đăng nhập bằng tài khoản Admin</Link>
        <Link to="/" className="text-sm text-gray-500">Về trang chủ</Link>
      </div>
    )
  }
  if (role === "staff" && !["staff", "admin"].includes(user?.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg">Bạn không có quyền Nhân viên.</p>
        <Link to="/login" className="text-gold-600 underline">Đăng nhập staff</Link>
      </div>
    )
  }

  const adminLinks = [
    { to: "/admin", label: "Tổng quan" },
    { to: "/admin/hotels", label: "Quản lý khách sạn" },
    { to: "/admin/rooms", label: "Quản lý phòng" },
    { to: "/admin/users", label: "Quản lý người dùng" },
    { to: "/admin/bookings", label: "Đơn đặt phòng" },
    { to: "/admin/reviews", label: "Đánh giá" },
    { to: "/admin/articles", label: "Bài viết" },
  ]

  const staffLinks = [
    { to: "/staff", label: "Tổng quan" },
    { to: "/staff/bookings", label: "Đơn chờ xử lý" },
    { to: "/staff/checkin", label: "Check-in / Check-out" },
  ]

  const links = role === "admin" ? adminLinks : staffLinks
  const title = role === "admin" ? "Admin Dashboard" : "Nhân viên"

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-navy-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="font-display text-lg tracking-wide">KENSINGTON</Link>
          <div className="text-xs text-gold-400 mt-1">{title}</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={
                "block px-4 py-2.5 rounded-lg text-sm transition " +
                (location.pathname === l.to
                  ? "bg-gold-400 text-navy-900 font-semibold"
                  : "hover:bg-white/10")
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="text-sm text-white/60 hover:text-gold-400">
            ← Về trang chủ
          </Link>
        </div>
      </aside>

      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-semibold text-lg text-navy-900">{title}</h1>
          <div className="text-sm text-gray-500">
            {user?.fullName || user?.email} ({user?.role})
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
