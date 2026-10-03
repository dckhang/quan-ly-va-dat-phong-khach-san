import { useState, useEffect } from "react"
import { api } from "../../api/client"

export default function AdminUsers() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getUsers()
      .then((res) => setList(res.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  const roleLabel = { admin: "Admin", staff: "Nhân viên", customer: "Khách hàng" }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Quản lý người dùng</h2>
      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Họ tên</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">SĐT</th>
                <th className="px-4 py-3 font-medium">Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{u.fullName}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-cream px-2 py-0.5 rounded-full">
                      {roleLabel[u.role] || u.role}
                    </span>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Chưa có user
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
