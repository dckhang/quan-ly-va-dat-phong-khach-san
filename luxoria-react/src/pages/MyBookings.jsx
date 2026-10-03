import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api, formatPrice } from "../api/client"
import { useAuth } from "../context/AuthContext"

const statusMap = {
  awaiting_deposit: { label: "Chờ thanh toán cọc", color: "bg-orange-100 text-orange-800" },
  deposit_paid: { label: "Đã đặt cọc", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  checked_in: { label: "Đã nhận phòng", color: "bg-green-100 text-green-800" },
  fully_paid: { label: "Đã thanh toán đủ", color: "bg-emerald-100 text-emerald-800" },
  checked_out: { label: "Đã trả phòng", color: "bg-gray-100 text-gray-700" },
  expired: { label: "Hết hạn giữ phòng", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
  rejected: { label: "Từ chối", color: "bg-red-100 text-red-700" },
}

export default function MyBookings() {
  const { isLoggedIn, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate("/login", { state: { from: "/my-bookings" } })
      return
    }
    if (isLoggedIn) {
      api.getMyBookings()
        .then((res) => setBookings(res.data || []))
        .catch(() => setBookings([]))
        .finally(() => setLoading(false))
    }
  }, [isLoggedIn, authLoading, navigate])

  if (authLoading || !isLoggedIn) return null

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-navy-900 mb-6">Đơn đặt phòng của tôi</h1>
      {loading ? (
        <p className="text-navy-700/60">Đang tải...</p>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-navy-700/60 mb-4">Bạn chưa có đơn đặt phòng nào.</p>
          <Link to="/search" className="text-gold-600 font-medium hover:underline">Tìm chi nhánh →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const st = statusMap[b.status] || statusMap.pending
            const checkIn = b.checkInDate ? new Date(b.checkInDate).toLocaleDateString("vi-VN") : ""
            const checkOut = b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString("vi-VN") : ""
            return (
              <div key={b._id} className="bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-navy-900 text-sm">{String(b._id).slice(-6).toUpperCase()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                  </div>
                  <p className="font-display text-lg">{b.hotelName || b.hotelId?.name}</p>
                  <p className="text-sm text-navy-700/60">{b.roomName || b.roomTypeId?.name} · Phòng {b.roomNumber}</p>
                  <p className="text-sm text-navy-700/60 mt-1">{checkIn} → {checkOut} · {b.guests} khách</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-navy-900">{formatPrice(b.totalPrice)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
