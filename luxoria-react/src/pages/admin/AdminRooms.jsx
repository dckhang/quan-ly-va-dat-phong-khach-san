import { useState } from "react"
import { rooms as initial, hotels, formatPrice } from "../../data/mockData"

export default function AdminRooms() {
  const [list, setList] = useState(initial)

  const handleDelete = (id) => {
    if (confirm("Xóa phòng này?")) {
      setList(list.filter((r) => r.id !== id))
    }
  }

  const getHotelName = (hotelId) => hotels.find((h) => h.id === hotelId)?.name || "—"

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Quản lý phòng</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Tên phòng</th>
              <th className="px-4 py-3 font-medium">Khách sạn</th>
              <th className="px-4 py-3 font-medium">Loại</th>
              <th className="px-4 py-3 font-medium">Sức chứa</th>
              <th className="px-4 py-3 font-medium">Giá</th>
              <th className="px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3">{getHotelName(r.hotelId)}</td>
                <td className="px-4 py-3">{r.type}</td>
                <td className="px-4 py-3">{r.capacity} người</td>
                <td className="px-4 py-3">{formatPrice(r.price)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline text-xs">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
