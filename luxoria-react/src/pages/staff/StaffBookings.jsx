import { useState } from "react"
import { bookings as initial, formatPrice } from "../../data/mockData"

const statusMap = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Đã từ chối", color: "bg-red-100 text-red-700" },
}

export default function StaffBookings() {
  const [list, setList] = useState(initial.filter((b) => b.status === "pending" || b.status === "confirmed"))

  const updateStatus = (id, status) => {
    setList((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Đơn đặt phòng cần xử lý</h2>

      <div className="space-y-4">
        {list.length === 0 ? (
          <p className="text-gray-500">Không còn đơn nào cần xử lý.</p>
        ) : (
          list.map((b) => {
            const st = statusMap[b.status] || statusMap.pending
            return (
              <div key={b.id} className="bg-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{b.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                  </div>
                  <p className="font-medium">{b.hotelName} – {b.roomName}</p>
                  <p className="text-sm text-gray-500">{b.checkIn} → {b.checkOut} · {b.guests} khách</p>
                  <p className="text-sm font-semibold mt-1">{formatPrice(b.totalPrice)}</p>
                </div>
                {b.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(b.id, "confirmed")}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                      Xác nhận
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, "cancelled")}
                      className="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                      Từ chối
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
