import { useState, useEffect } from "react"
import { api, formatPrice } from "../../api/client"

const statusMap = {
  awaiting_deposit: { label: "Chờ duyệt cọc", color: "bg-orange-100 text-orange-800" },
  deposit_paid: { label: "Đã đặt cọc", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  checked_in: { label: "Đã nhận phòng", color: "bg-green-100 text-green-800" },
  fully_paid: { label: "Đã thanh toán đủ", color: "bg-emerald-100 text-emerald-800" },
}

export default function StaffBookings() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")

  const load = () => {
    setLoading(true)
    api
      .getAllBookings()
      .then((res) => {
        const data = (res.data || []).filter((b) =>
          ["awaiting_deposit", "deposit_paid", "confirmed", "checked_in"].includes(b.status)
        )
        setList(data)
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const confirmDeposit = async (id) => {
    try {
      await api.confirmDeposit(id)
      setMsg("Đã duyệt cọc.")
      load()
    } catch (e) {
      setMsg(e.message)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.updateBookingStatus(id, status)
      setMsg("Đã cập nhật.")
      load()
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Đơn cần xử lý</h2>
      {msg && <p className="mb-4 text-sm bg-cream px-3 py-2 rounded-lg">{msg}</p>}
      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : list.length === 0 ? (
        <p className="text-gray-500">Không còn đơn cần xử lý.</p>
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
            return (
              <div
                key={b._id}
                className="bg-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      #{String(b._id).slice(-6).toUpperCase()}
                    </span>
                    <span className={"text-xs px-2 py-0.5 rounded-full " + st.color}>
                      {st.label}
                    </span>
                  </div>
                  <p className="font-medium">
                    {b.hotelName} – {b.roomName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {checkIn} → {checkOut} · {b.guests} khách
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    Cọc: {formatPrice(b.depositAmount)} / Tổng {formatPrice(b.totalPrice)}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
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
                        className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
                      >
                        Xác nhận
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
                      className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
                    >
                      Check-in
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
