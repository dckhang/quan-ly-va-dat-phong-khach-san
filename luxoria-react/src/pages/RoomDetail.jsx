import { useState, useEffect } from "react"
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import { api, formatPrice } from "../api/client"
import { useAuth } from "../context/AuthContext"
import ReviewSection from "../components/ReviewSection"

export default function RoomDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuth()
  const [roomType, setRoomType] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paying, setPaying] = useState(false)
  const [step, setStep] = useState("form") // form | deposit | done
  const [bookingData, setBookingData] = useState(null)
  const [error, setError] = useState("")
  const [payMethod, setPayMethod] = useState("momo")
  const [form, setForm] = useState({ checkIn: "", checkOut: "", guests: 2, note: "" })

  useEffect(() => {
    api
      .getRoomType(id)
      .then((res) => setRoomType(res.data))
      .catch(() => setRoomType(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="text-center py-20 text-navy-700/60">Đang tải...</div>
  }
  if (!roomType) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-display mb-4">Không tìm thấy phòng</h2>
        <Link to="/search" className="text-gold-600 hover:underline">
          ← Quay lại
        </Link>
      </div>
    )
  }

  const hotel = roomType.hotelId || {}
  const nights =
    form.checkIn && form.checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24)
          )
        )
      : 0
  const total = nights * (roomType.basePrice || 0)
  const depositPreview = Math.round((total * 30) / 100)
  const remainingPreview = total - depositPreview

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!isLoggedIn) {
      navigate("/login", { state: { from: location.pathname } })
      return
    }
    if (!form.checkIn || !form.checkOut) {
      setError("Vui lòng chọn ngày nhận và trả phòng")
      return
    }
    if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      setError("Ngày trả phòng phải sau ngày nhận phòng")
      return
    }

    setSubmitting(true)
    try {
      const res = await api.createBooking({
        roomTypeId: roomType._id,
        checkInDate: form.checkIn,
        checkOutDate: form.checkOut,
        guests: form.guests,
        note: form.note,
      })
      setBookingData(res.data)
      setStep("deposit")
    } catch (err) {
      setError(err.message || "Đặt phòng thất bại")
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayDeposit = async () => {
    if (!bookingData?.booking?._id) return
    setPaying(true)
    setError("")
    try {
      const res = await api.payDeposit(bookingData.booking._id, payMethod)
      setBookingData({ ...bookingData, payment: res.data?.payment, waitingApproval: true })
      setStep("waiting")
    } catch (err) {
      setError(err.message || "Gửi yêu cầu thanh toán thất bại")
    } finally {
      setPaying(false)
    }
  }

  // ===== Bước 2: Thanh toán cọc 30% =====
  if (step === "deposit" && bookingData) {
    const b = bookingData.booking
    const deposit = bookingData.depositAmount ?? b.depositAmount
    const remaining = bookingData.remainingAmount ?? b.remainingAmount
    const totalPrice = bookingData.totalPrice ?? b.totalPrice
    const deadline = bookingData.depositDeadline
      ? new Date(bookingData.depositDeadline).toLocaleString("vi-VN")
      : ""
    const holdMin = bookingData.holdMinutes || 30

    return (
      <div className="max-w-lg mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
            <h2 className="font-display text-2xl mb-1">Chờ thanh toán cọc</h2>
            <p className="text-sm text-navy-700/70">
              Phòng đang được giữ trong <strong>{holdMin} phút</strong>
            </p>
            {deadline && (
              <p className="text-xs text-amber-700 mt-1">Hạn thanh toán: {deadline}</p>
            )}
          </div>

          <div className="bg-cream rounded-xl p-4 text-sm space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Phòng</span>
              <span className="font-medium">{b.roomName || roomType.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Chi nhánh</span>
              <span className="font-medium">{b.hotelName || hotel.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Ngày</span>
              <span>
                {form.checkIn} → {form.checkOut}
              </span>
            </div>
            <div className="border-t border-navy-900/10 pt-2 flex justify-between">
              <span>Tổng tiền</span>
              <span className="font-semibold">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-amber-800">
              <span>Cọc 30% (cần thanh toán ngay)</span>
              <span className="font-bold">{formatPrice(deposit)}</span>
            </div>
            <div className="flex justify-between text-navy-700/60">
              <span>Còn lại (khi nhận phòng)</span>
              <span>{formatPrice(remaining)}</span>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs font-medium text-navy-700 mb-2">Phương thức thanh toán cọc</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "momo", label: "MoMo" },
                { id: "vnpay", label: "VNPay" },
                { id: "bank_transfer", label: "Chuyển khoản" },
                { id: "credit_card", label: "Thẻ" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPayMethod(m.id)}
                  className={
                    "border rounded-xl py-2.5 text-sm transition " +
                    (payMethod === m.id
                      ? "border-gold-400 bg-gold-50 font-semibold text-navy-900"
                      : "border-gray-200 text-navy-700 hover:border-gold-300")
                  }
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

          <button
            type="button"
            onClick={handlePayDeposit}
            disabled={paying}
            className="w-full bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {paying ? "Đang gửi..." : "Xác nhận & hiện mã QR"}
          </button>
          <p className="text-xs text-center text-navy-700/50 mt-3">
            Nếu không thanh toán đúng hạn, đơn sẽ hủy và phòng được mở lại.
          </p>
        </div>
      </div>
    )
  }

  // ===== Bước 3: Hiện QR + chờ nhân viên duyệt =====
  if (step === "waiting" && bookingData) {
    const b = bookingData.booking
    const deposit = bookingData.depositAmount ?? b.depositAmount
    const methodLabel = {
      momo: "MoMo",
      vnpay: "VNPay",
      bank_transfer: "Chuyển khoản ngân hàng",
      credit_card: "Thẻ tín dụng",
      cash: "Tiền mặt",
    }[payMethod] || payMethod

    // QR thật từ public/
    const qrSrc = {
      momo: "/qr-mb.jpg",
      vnpay: "/qr-mb.jpg",
      bank_transfer: "/qr-bank.jpg",
      credit_card: "/qr-bank.jpg",
      cash: "/qr-bank.jpg",
    }[payMethod] || "/qr-bank.jpg"

    return (
      <div className="max-w-lg mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-5">
            <h2 className="font-display text-2xl mb-1">Quét QR để thanh toán cọc</h2>
            <p className="text-sm text-navy-700/70">
              Phương thức: <strong>{methodLabel}</strong>
            </p>
            <p className="text-lg font-semibold text-amber-800 mt-2">
              {formatPrice(deposit)}
            </p>
          </div>

          <div className="flex justify-center mb-5">
            <div className="w-56 h-56 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              <img
                src={qrSrc}
                alt="QR thanh toán"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none"
                  e.target.parentElement.innerHTML =
                    '<div class="text-center p-4 text-sm text-navy-700/60">Chưa có ảnh QR<br/><span class="text-xs">Hãy thêm file vào public/</span></div>'
                }}
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mb-5 text-center">
            <p className="font-semibold mb-1">Đang chờ nhân viên duyệt</p>
            <p>
              Sau khi bạn chuyển khoản / quét QR, nhân viên sẽ kiểm tra và xác nhận.
              Đơn <strong>chưa</strong> được coi là thành công cho đến khi được duyệt.
            </p>
          </div>

          <div className="bg-cream rounded-xl p-4 text-xs text-navy-700/70 space-y-1 mb-5">
            <p>Mã đơn: <strong>{String(b._id).slice(-8).toUpperCase()}</strong></p>
            <p>Phòng: {b.roomName} · {b.hotelName}</p>
            <p>Trạng thái: <strong className="text-orange-700">Chờ thanh toán cọc / chờ duyệt</strong></p>
          </div>

          <Link
            to="/my-bookings"
            className="block w-full text-center bg-navy-900 text-white font-semibold py-3 rounded-xl hover:bg-navy-800 transition"
          >
            Xem đơn của tôi
          </Link>
          <p className="text-xs text-center text-navy-700/50 mt-3">
            Bạn có thể đóng trang này. Khi nhân viên duyệt, trạng thái đơn sẽ đổi thành &quot;Đã đặt cọc&quot;.
          </p>
        </div>
      </div>
    )
  }

  // ===== Bước 4: Thành công (chỉ khi staff đã duyệt – dùng khi poll sau này) =====
  if (step === "done") {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-2xl mb-2">Đã đặt cọc thành công!</h2>
          <p className="text-navy-700/70 mb-6">
            Nhân viên đã duyệt thanh toán cọc. Phần còn lại thanh toán khi nhận phòng.
          </p>
          <Link
            to="/my-bookings"
            className="bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold px-5 py-2.5 rounded-full transition"
          >
            Xem đơn của tôi
          </Link>
        </div>
      </div>
    )
  }

  // ===== Bước 1: Form đặt phòng =====
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link
        to={"/hotels/" + (hotel._id || hotel)}
        className="text-sm text-gold-600 hover:underline mb-4 inline-block"
      >
        ← {hotel.name || "Chi nhánh"}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden mb-6">
            <img
              src={(roomType.images && roomType.images[0]) || hotel.image}
              alt={roomType.name}
              className="w-full h-72 object-cover"
            />
          </div>
          <h1 className="font-display text-3xl text-navy-900 mb-2">{roomType.name}</h1>
          <p className="text-navy-700/60 mb-4">
            {hotel.name} · {roomType.size} · Tối đa {roomType.capacity} khách
          </p>
          <p className="text-navy-700/80 leading-relaxed mb-6">{roomType.description}</p>
          <h3 className="font-semibold mb-3">Tiện nghi</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {(roomType.amenities || []).map((a) => (
              <span key={a} className="bg-cream text-navy-800 text-sm px-3 py-1.5 rounded-full">
                {a}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <p className="text-2xl font-semibold text-navy-900 mb-1">
              {formatPrice(roomType.basePrice)}
              <span className="text-sm font-normal text-navy-700/50"> / đêm</span>
            </p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-navy-700 mb-1">
                  Ngày nhận phòng
                </label>
                <input
                  type="date"
                  required
                  value={form.checkIn}
                  onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy-700 mb-1">
                  Ngày trả phòng
                </label>
                <input
                  type="date"
                  required
                  value={form.checkOut}
                  onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy-700 mb-1">Số khách</label>
                <select
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                >
                  {Array.from({ length: roomType.capacity || 2 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} người
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-navy-700 mb-1">Ghi chú</label>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Yêu cầu đặc biệt..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold-400 resize-none"
                />
              </div>
              {nights > 0 && (
                <div className="border-t pt-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>
                      {formatPrice(roomType.basePrice)} × {nights} đêm
                    </span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-amber-800">
                    <span>Cọc 30% (sau khi đặt)</span>
                    <span className="font-medium">{formatPrice(depositPreview)}</span>
                  </div>
                  <div className="flex justify-between text-navy-700/60">
                    <span>Còn lại khi nhận phòng</span>
                    <span>{formatPrice(remainingPreview)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-1">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold py-3 rounded-xl transition disabled:opacity-60"
              >
                {submitting
                  ? "Đang xử lý..."
                  : isLoggedIn
                  ? "Đặt phòng ngay"
                  : "Đăng nhập để đặt phòng"}
              </button>
              {!isLoggedIn && (
                <p className="text-xs text-amber-700 text-center">
                  Bạn cần đăng nhập trước khi đặt phòng
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {roomType && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <ReviewSection target="roomType" targetId={roomType._id} title="Đánh giá loại phòng" />
        </div>
      )}
    </div>
  )
}
