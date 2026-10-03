import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "../../api/client"

export default function StaffDashboard() {
  const [counts, setCounts] = useState({ awaiting: 0, depositPaid: 0, confirmed: 0 })

  useEffect(() => {
    api.getAllBookings().then((res) => {
      const data = res.data || []
      setCounts({
        awaiting: data.filter((b) => b.status === "awaiting_deposit").length,
        depositPaid: data.filter((b) => b.status === "deposit_paid").length,
        confirmed: data.filter((b) => b.status === "confirmed").length,
      })
    }).catch(() => {})
  }, [])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Tổng quan nhân viên</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Chờ duyệt cọc</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{counts.awaiting}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Đã cọc – chờ xác nhận</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{counts.depositPaid}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Đã xác nhận – chờ check-in</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{counts.confirmed}</p>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap">
        <Link to="/staff/bookings" className="bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold px-5 py-2.5 rounded-xl">
          Xử lý đơn
        </Link>
        <Link to="/staff/checkin" className="border border-navy-900 text-navy-900 font-medium px-5 py-2.5 rounded-xl">
          Check-in / Check-out
        </Link>
      </div>
    </div>
  )
}
