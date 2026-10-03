import { useState, useEffect } from "react"
import { api, formatPrice } from "../../api/client"

const statusMap = {
  awaiting_deposit: { label: "Chờ thanh toán / duyệt cọc", color: "bg-orange-100 text-orange-800" },
  deposit_paid: { label: "Đã đặt cọc", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  checked_in: { label: "Đã nhận phòng", color: "bg-green-100 text-green-800" },
  fully_paid: { label: "Đã thanh toán đủ", color: "bg-emerald-100 text-emerald-800" },
  checked_out: { label: "Đã trả phòng", color: "bg-gray-100 text-gray-700" },
  expired: { label: "Hết hạn", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
  rejected: { label: "Từ chối", color: "bg-red-100 text-red-700" },
}

export default function AdminBookings() {
  const [list, setList] = useState([])
  const [filter, setFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")

  const load = () => {
    setLoading(true)
    const params = filter ? { status: filter } : {}
    api
      .getAllBookings(params)
      .then((res) => setList(res.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [filter])

  const confirmDeposit = async (id) => {
    setMsg("")
    try {
      await api.confirmDeposit(id)
      setMsg("Đã duyệt cọc thành công.")
      load()
    } catch (e) {
      setMsg(e.message || "Duyệt cọc thất bại")
    }
  }

  const updateStatus = async (id, status) => {
    setMsg("")
    try {
      await api.updateBookingStatus(id, status)
      setMsg("Cập nhật trạng thái thành công.")
      load()
    } catch (e) {
      setMsg(e.message || "Cập nhật thất bại")
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold">Đơn đặt phòng</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-400"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="awaiting_deposit">Chờ duyệt cọc</option>
          <option value="deposit_paid">Đã đặt cọc</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="checked_in">Đã nhận phòng</option>
          <option value="fully_paid">Đã thanh toán đủ</option>
          <option value="checked_out">Đã trả phòng</option>
          <option value="cancelled">Đã hủy</option>
          <option value="expired">Hết hạn</option>
        </select>
      </div>

      {msg && (
        <p className="mb-4 text-sm text-navy-800 bg-cream px-3 py-2 rounded-lg">{msg}</p>
      )}

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : list.length === 0 ? (
        <p className="text-gray-500">Không có đơn nào.</p>
      ) : (
        <div className="space-y-4">
          {list.map((b) => {
            const st = statusMap[b.status] || statusMap.awaiting_deposit
            const checkIn = b.checkInDate
              ? new Date(b.checkInDate).toLocaleDateString("vi-VN")
              : ""
            const checkOut = b.checkOutDate
              ? new Date(b.checkOutDate).toLocaleDateString("vi-VN")
              : ""
            const guest = b.userId?.fullName || b.guestName || "—"
            return (
              <div
                key={b._id}
                className="bg-white rounded-xl p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      #{String(b._id).slice(-6).toUpperCase()}
                    </span>
                    <span className={"text-xs px-2 py-0.5 rounded-full " + st.color}>
                      {st.label}
                    </span>
                  </div>
                  <p className="font-medium">
                    {b.hotelName || b.hotelId?.name} – {b.roomName || b.roomTypeId?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {checkIn} → {checkOut} · {b.guests} khách · {guest}
                  </p>
                  <p className="text-sm mt-1">
                    Tổng: <strong>{formatPrice(b.totalPrice)}</strong>
                    {" · "}
                    Cọc: <strong className="text-amber-700">{formatPrice(b.depositAmount)}</strong>
                    {" · "}
                    Còn lại: {formatPrice(b.remainingAmount)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {b.status === "awaiting_deposit" && (
                    <button
                      onClick={() => confirmDeposit(b._id)}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
                    >
                      Duyệt cọc
                    </button>
                  )}
                  {b.status === "deposit_paid" && (
                    <>
                      <button
                        onClick={() => updateStatus(b._id, "confirmed")}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                      >
                        Xác nhận đơn
                      </button>
                      <button
                        onClick={() => updateStatus(b._id, "rejected")}
                        className="bg-red-100 text-red-700 text-sm font-medium px-4 py-2 rounded-lg"
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                  {b.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(b._id, "checked_in")}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                    >
                      Check-in
                    </button>
                  )}
                  {(b.status === "checked_in" || b.status === "fully_paid") && (
                    <button
                      onClick={() => updateStatus(b._id, "checked_out")}
                      className="bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-4 py-2 rounded-lg"
                    >
                      Check-out
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
