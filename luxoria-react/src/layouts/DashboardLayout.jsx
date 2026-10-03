import { Outlet, Link, useLocation } from "react-router-dom"

export default function DashboardLayout({ role = "admin" }) {
  const location = useLocation()

  const adminLinks = [
    { to: "/admin", label: "Tổng quan" },
    { to: "/admin/hotels", label: "Quản lý khách sạn" },
    { to: "/admin/rooms", label: "Quản lý phòng" },
    { to: "/admin/users", label: "Quản lý người dùng" },
    { to: "/admin/bookings", label: "Đơn đặt phòng" },
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
      {/* Sidebar */}
      <aside className="w-64 bg-navy-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="font-display text-lg tracking-wide">HOTELBOOK</Link>
          <div className="text-xs text-gold-400 mt-1">{title}</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`block px-4 py-2.5 rounded-lg text-sm transition ${
                location.pathname === l.to
                  ? "bg-gold-400 text-navy-900 font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="text-sm text-white/60 hover:text-gold-400">← Về trang chủ</Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-semibold text-lg text-navy-900">{title}</h1>
          <div className="text-sm text-gray-500">Xin chào, {role === "admin" ? "Admin" : "Nhân viên"}</div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
