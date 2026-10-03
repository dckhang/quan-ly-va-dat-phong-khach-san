import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../api/client"
import { useAuth } from "../context/AuthContext"

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirm: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }
    if (form.password.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự")
      return
    }
    setLoading(true)
    try {
      const res = await api.register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })
      login(res.data.user, res.data.token)
      navigate("/")
    } catch (err) {
      setError(err.message || "Đăng ký thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="font-display text-2xl text-center mb-1">Đăng ký tài khoản</h1>
        <p className="text-sm text-navy-700/60 text-center mb-6">Tạo tài khoản để đặt phòng</p>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1">Họ và tên</label>
            <input type="text" required value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1">Email</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1">Số điện thoại</label>
            <input type="tel" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1">Mật khẩu</label>
            <input type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1">Xác nhận mật khẩu</label>
            <input type="password" required value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold-400" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold py-3 rounded-xl transition disabled:opacity-60">
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        <p className="text-sm text-center mt-5 text-navy-700/60">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-gold-600 font-medium hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
