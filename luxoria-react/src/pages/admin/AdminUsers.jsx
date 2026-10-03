import { useState } from "react"
import { users as initial } from "../../data/mockData"

const roleLabel = {
  customer: "Khách hàng",
  staff: "Nhân viên",
  admin: "Quản trị",
}

export default function AdminUsers() {
  const [list, setList] = useState(initial)

  const handleDelete = (id) => {
    if (confirm("Xóa người dùng này?")) {
      setList(list.filter((u) => u.id !== id))
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Quản lý người dùng</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Họ tên</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Số điện thoại</th>
              <th className="px-4 py-3 font-medium">Vai trò</th>
              <th className="px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3 font-medium">{u.fullName}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-cream px-2 py-0.5 rounded-full">{roleLabel[u.role]}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline text-xs">
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
