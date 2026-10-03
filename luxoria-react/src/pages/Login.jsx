import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { api } from "../api/client"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const from = location.state?.from || "/"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await api.login({ email: form.email, password: form.password })
      const { user, token } = res.data
      login(user, token)
      if (user.role === "admin") navigate("/admin")
      else if (user.role === "staff") navigate("/staff")
      else navigate(from)
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Kiểm tra Backend đã chạy chưa?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="font-display text-2xl text-center mb-1">Đăng nhập</h1>
        <p className="text-sm text-navy-700/60 text-center mb-6">Chào mừng trở lại HotelBook</p>

        {location.state?.from && (
          <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-4 text-center">
            Vui lòng đăng nhập để tiếp tục đặt phòng
          </p>
        )}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1">Email</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold-400"
              placeholder="email@example.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1">Mật khẩu</label>
            <input type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold-400"
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold py-3 rounded-xl transition disabled:opacity-60">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-sm text-center mt-5 text-navy-700/60">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-gold-600 font-medium hover:underline">Đăng ký</Link>
        </p>
        <div className="mt-6 p-3 bg-cream rounded-xl text-xs text-navy-700/70 space-y-1">
          <p className="font-medium">Tài khoản demo (sau khi seed Backend):</p>
          <p>Admin: admin@hotel.com / 123456</p>
          <p>Staff: staff@hotel.com / 123456</p>
          <p>Khách: customer@gmail.com / 123456</p>
        </div>
      </div>
    </div>
  )
}
