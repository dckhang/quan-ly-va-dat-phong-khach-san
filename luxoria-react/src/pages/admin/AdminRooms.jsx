import { useState, useEffect } from "react"
import { api } from "../../api/client"

export default function AdminRooms() {
  const [hotels, setHotels] = useState([])
  const [hotelId, setHotelId] = useState("")
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.getHotels().then((res) => {
      const data = res.data || []
      setHotels(data)
      if (data[0]) setHotelId(data[0]._id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!hotelId) return
    setLoading(true)
    api
      .getRooms({ hotelId })
      .then((res) => setRooms(res.data || []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false))
  }, [hotelId])

  const setStatus = async (id, status) => {
    try {
      await api.updateRoomStatus(id, status)
      setRooms((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)))
    } catch (e) {
      alert(e.message)
    }
  }

  const statusColor = {
    available: "bg-green-100 text-green-800",
    occupied: "bg-blue-100 text-blue-800",
    cleaning: "bg-yellow-100 text-yellow-800",
    maintenance: "bg-red-100 text-red-700",
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold">Quản lý phòng</h2>
        <select
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm max-w-xs"
        >
          {hotels.map((h) => (
            <option key={h._id} value={h._id}>
              {h.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Số phòng</th>
                <th className="px-4 py-3">Tầng</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{r.roomNumber}</td>
                  <td className="px-4 py-3">{r.floor}</td>
                  <td className="px-4 py-3">{r.roomTypeId?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={"text-xs px-2 py-0.5 rounded-full " + (statusColor[r.status] || "")}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => setStatus(r._id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="available">available</option>
                      <option value="occupied">occupied</option>
                      <option value="cleaning">cleaning</option>
                      <option value="maintenance">maintenance</option>
                    </select>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Chưa có phòng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
