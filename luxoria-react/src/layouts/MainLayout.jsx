import { Outlet, Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isLoggedIn, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header className="sticky top-0 z-50 bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full border-2 border-gold-400 flex items-center justify-center">
              <span className="font-display text-gold-400 text-lg font-bold">H</span>
            </div>
            <div>
              <div className="font-display text-base tracking-wide leading-none">HOTELBOOK</div>
              <div className="text-[9px] tracking-[0.2em] text-gold-400 uppercase">Booking Platform</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-gold-400 transition">Trang chủ</Link>
            <Link to="/search" className="hover:text-gold-400 transition">Tìm khách sạn</Link>
            {isLoggedIn && user?.role === "customer" && (
              <Link to="/my-bookings" className="hover:text-gold-400 transition">Đơn của tôi</Link>
            )}
            {isLoggedIn && user?.role === "staff" && (
              <Link to="/staff" className="hover:text-gold-400 transition">Nhân viên</Link>
            )}
            {isLoggedIn && user?.role === "admin" && (
              <Link to="/admin" className="hover:text-gold-400 transition">Admin</Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-sm hidden sm:inline">Xin chào, {user?.fullName}</span>
                <button onClick={logout} className="text-sm text-gold-400 hover:underline">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm hover:text-gold-400 transition hidden sm:inline">
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-gold-400 hover:bg-gold-500 text-navy-900 text-sm font-semibold px-4 py-2 rounded-full transition"
                >
                  Đăng ký
                </Link>
              </>
            )}
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-navy-800 px-4 py-3 space-y-2 text-sm">
            <Link to="/" className="block py-1" onClick={() => setMenuOpen(false)}>Trang chủ</Link>
            <Link to="/search" className="block py-1" onClick={() => setMenuOpen(false)}>Tìm khách sạn</Link>
            {isLoggedIn && user?.role === "customer" && (
              <Link to="/my-bookings" className="block py-1" onClick={() => setMenuOpen(false)}>Đơn của tôi</Link>
            )}
            {!isLoggedIn && (
              <Link to="/login" className="block py-1" onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
            )}
            {isLoggedIn && (
              <button className="block py-1 text-gold-400" onClick={() => { logout(); setMenuOpen(false) }}>
                Đăng xuất
              </button>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-navy-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="font-display text-lg mb-2">HOTELBOOK</div>
            <p className="text-white/60 text-sm">Nền tảng tìm kiếm và đặt phòng khách sạn trực tuyến hàng đầu.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm tracking-wide">LIÊN KẾT</h4>
            <ul className="space-y-1.5 text-sm text-white/60">
              <li><Link to="/search" className="hover:text-gold-400">Tìm khách sạn</Link></li>
              <li><Link to="/login" className="hover:text-gold-400">Đăng nhập</Link></li>
              <li><Link to="/register" className="hover:text-gold-400">Đăng ký</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm tracking-wide">LIÊN HỆ</h4>
            <p className="text-sm text-white/60">Email: support@hotelbook.vn</p>
            <p className="text-sm text-white/60">Hotline: 1900 1234</p>
          </div>
        </div>
        <div className="border-t border-white/10 text-center text-xs text-white/40 py-4">
          © 2025 HotelBook. Đồ án tốt nghiệp.
        </div>
      </footer>
    </div>
  )
}
