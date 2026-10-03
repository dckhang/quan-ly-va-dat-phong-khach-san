import { bookings, formatPrice } from "../../data/mockData"
import { Link } from "react-router-dom"

export default function StaffDashboard() {
  const pending = bookings.filter((b) => b.status === "pending").length
  const confirmed = bookings.filter((b) => b.status === "confirmed").length
  const checkedIn = bookings.filter((b) => b.status === "checked_in").length

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Tổng quan hôm nay</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Chờ xác nhận</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{pending}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Đã xác nhận</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{confirmed}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Đang ở (check-in)</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{checkedIn}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Link to="/staff/bookings" className="bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold px-5 py-2.5 rounded-lg transition text-sm">
          Xử lý đơn chờ
        </Link>
        <Link to="/staff/checkin" className="border border-navy-900 text-navy-900 font-medium px-5 py-2.5 rounded-lg hover:bg-navy-900 hover:text-white transition text-sm">
          Check-in / Check-out
        </Link>
      </div>

      <h3 className="font-semibold mb-3">Đơn gần đây</h3>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Mã đơn</th>
              <th className="px-4 py-3 font-medium">Khách sạn</th>
              <th className="px-4 py-3 font-medium">Ngày</th>
              <th className="px-4 py-3 font-medium">Tổng tiền</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="px-4 py-3 font-medium">{b.id}</td>
                <td className="px-4 py-3">{b.hotelName}</td>
                <td className="px-4 py-3">{b.checkIn} → {b.checkOut}</td>
                <td className="px-4 py-3">{formatPrice(b.totalPrice)}</td>
                <td className="px-4 py-3 capitalize">{b.status.replace("_", " ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
