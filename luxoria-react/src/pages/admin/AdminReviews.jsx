import { useState, useEffect } from "react"
import { api } from "../../api/client"

export default function AdminReviews() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [msg, setMsg] = useState("")

  const load = () => {
    setLoading(true)
    const params = {}
    if (filter === "featured") params.featured = "true"
    if (filter === "hidden") params.hidden = "true"
    if (filter === "visible") params.hidden = "false"
    api
      .getAllReviewsAdmin(params)
      .then((res) => setList(res.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [filter])

  const toggleFeatured = async (r) => {
    setMsg("")
    try {
      await api.updateReviewAdmin(r._id, { isFeatured: !r.isFeatured })
      setMsg(r.isFeatured ? "Đã bỏ khỏi trang chủ." : "Đã đưa lên trang chủ.")
      load()
    } catch (e) {
      setMsg(e.message || "Lỗi cập nhật")
    }
  }

  const toggleHidden = async (r) => {
    setMsg("")
    try {
      await api.updateReviewAdmin(r._id, { isHidden: !r.isHidden })
      setMsg(r.isHidden ? "Đã hiện lại đánh giá." : "Đã ẩn đánh giá.")
      load()
    } catch (e) {
      setMsg(e.message || "Lỗi cập nhật")
    }
  }

  const remove = async (id) => {
    if (!confirm("Xóa đánh giá này?")) return
    try {
      await api.deleteReview(id)
      setMsg("Đã xóa.")
      load()
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold">Quản lý đánh giá</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Tất cả</option>
          <option value="featured">Đang hiện trang chủ</option>
          <option value="visible">Đang hiện (không ẩn)</option>
          <option value="hidden">Đã ẩn</option>
        </select>
      </div>

      {msg && <p className="mb-4 text-sm bg-cream px-3 py-2 rounded-lg">{msg}</p>}

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : list.length === 0 ? (
        <p className="text-gray-500">Chưa có đánh giá.</p>
      ) : (
        <div className="space-y-4">
          {list.map((r) => (
            <div
              key={r._id}
              className={
                "bg-white rounded-xl p-5 shadow-sm " + (r.isHidden ? "opacity-60" : "")
              }
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium">{r.userId?.fullName || "Khách"}</span>
                    <span className="text-gold-400 text-sm">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </span>
                    {r.isFeatured && (
                      <span className="text-xs bg-gold-400/20 text-amber-800 px-2 py-0.5 rounded-full">
                        Trang chủ
                      </span>
                    )}
                    {r.isHidden && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        Đã ẩn
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {r.target === "hotel"
                      ? r.hotelId?.name || "Chi nhánh"
                      : `Phòng: ${r.roomTypeId?.name || "—"}`}
                    {r.hotelId?.city ? ` · ${r.hotelId.city}` : ""}
                  </p>
                  {r.comment && (
                    <p className="text-sm text-navy-800 mt-2 leading-relaxed">"{r.comment}"</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString("vi-VN") : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.target === "hotel" && r.rating >= 4 && !r.isHidden && (
                    <button
                      onClick={() => toggleFeatured(r)}
                      className={
                        "text-sm px-3 py-1.5 rounded-lg font-medium " +
                        (r.isFeatured
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gold-400 text-navy-900")
                      }
                    >
                      {r.isFeatured ? "Bỏ khỏi trang chủ" : "Đưa lên trang chủ"}
                    </button>
                  )}
                  <button
                    onClick={() => toggleHidden(r)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700"
                  >
                    {r.isHidden ? "Hiện lại" : "Ẩn"}
                  </button>
                  <button
                    onClick={() => remove(r._id)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-red-50 text-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-6">
        * Chỉ đánh giá chi nhánh từ 4 sao trở lên mới được đưa lên trang chủ.
      </p>
    </div>
  )
}
