import { useState, useEffect } from "react"
import { api, formatPrice } from "../../api/client"

export default function AdminHotels() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: "", address: "", city: "", starRating: 4, description: "", image: "",
  })
  const [error, setError] = useState("")

  const load = () => {
    setLoading(true)
    api.getHotels()
      .then((res) => setList(res.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await api.createHotel({
        ...form,
        starRating: Number(form.starRating),
        image: form.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400",
      })
      setShowForm(false)
      setForm({ name: "", address: "", city: "", starRating: 4, description: "", image: "" })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Xóa chi nhánh này?")) return
    try {
      await api.deleteHotel(id)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Quản lý chi nhánh</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý 5–6 chi nhánh khách sạn theo khu vực</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold text-sm px-4 py-2 rounded-lg transition">
          {showForm ? "Đóng" : "+ Thêm chi nhánh"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl p-5 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required placeholder="Tên chi nhánh (vd: HotelBook Đà Nẵng)" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-400" />
          <select required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-400">
            <option value="">Chọn thành phố</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Nha Trang">Nha Trang</option>
            <option value="Phú Quốc">Phú Quốc</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Lạt">Đà Lạt</option>
            <option value="Sapa">Sapa</option>
          </select>
          <input required placeholder="Địa chỉ chi tiết" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-400 sm:col-span-2" />
          <input placeholder="Mô tả ngắn" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-400 sm:col-span-2" />
          <input placeholder="URL ảnh (để trống = ảnh mặc định)" value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-400" />
          <select value={form.starRating} onChange={(e) => setForm({ ...form, starRating: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-400">
            {[3, 4, 5].map((s) => <option key={s} value={s}>{s} sao</option>)}
          </select>
          <button type="submit" className="sm:col-span-2 bg-navy-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-navy-800">
            Lưu chi nhánh
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Chi nhánh</th>
                <th className="px-4 py-3 font-medium">Thành phố</th>
                <th className="px-4 py-3 font-medium">Hạng</th>
                <th className="px-4 py-3 font-medium">Địa chỉ</th>
                <th className="px-4 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {list.map((h) => (
                <tr key={h._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{h.name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-cream text-navy-800 text-xs px-2 py-0.5 rounded-full">{h.city}</span>
                  </td>
                  <td className="px-4 py-3">{"★".repeat(h.starRating || 3)}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{h.address}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(h._id)} className="text-red-600 hover:underline text-xs">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Chưa có chi nhánh. Hãy seed hoặc thêm mới.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
