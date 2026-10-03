import { useState } from "react"
import { bookings as initial, formatPrice } from "../../data/mockData"

export default function StaffCheckin() {
  const [list, setList] = useState(
    initial.filter((b) => b.status === "confirmed" || b.status === "checked_in")
  )

  const updateStatus = (id, status) => {
    setList((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Check-in / Check-out</h2>

      <div className="space-y-4">
        {list.map((b) => (
          <div key={b.id} className="bg-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{b.id} – {b.hotelName}</p>
              <p className="text-sm text-gray-500">{b.roomName} · {b.checkIn} → {b.checkOut}</p>
              <p className="text-sm mt-1">
                Trạng thái:{" "}
                <span className="font-medium">
                  {b.status === "confirmed" ? "Chờ check-in" : "Đang ở (đã check-in)"}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              {b.status === "confirmed" && (
                <button
                  onClick={() => updateStatus(b.id, "checked_in")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  Check-in
                </button>
              )}
              {b.status === "checked_in" && (
                <button
                  onClick={() => updateStatus(b.id, "checked_out")}
                  className="bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  Check-out
                </button>
              )}
            </div>
          </div>
        ))}
        {list.filter((b) => b.status !== "checked_out").length === 0 && (
          <p className="text-gray-500">Không còn đơn nào cần check-in/out.</p>
        )}
      </div>
    </div>
  )
}
