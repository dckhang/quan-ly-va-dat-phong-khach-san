import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { api } from "../api/client"
import { useAuth } from "../context/AuthContext"

function Stars({ value, size = "text-base", onSelect }) {
  const v = Math.round(value || 0)
  return (
    <span className={`${size} text-gold-400 select-none`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!onSelect}
          onClick={() => onSelect && onSelect(i)}
          className={onSelect ? "cursor-pointer hover:scale-110 transition inline-block" : "cursor-default"}
        >
          {i <= v ? "★" : "☆"}
        </button>
      ))}
    </span>
  )
}

/**
 * target: "hotel" | "roomType"
 * targetId: hotelId or roomTypeId
 */
export default function ReviewSection({ target, targetId, title = "Đánh giá" }) {
  const { isLoggedIn, user } = useAuth()
  const location = useLocation()
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({ avgRating: 0, count: 0 })
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")

  const load = () => {
    if (!targetId) return
    setLoading(true)
    const params = target === "hotel" ? { hotelId: targetId } : { roomTypeId: targetId }
    api
      .getReviews(params)
      .then((res) => {
        setReviews(res.data || [])
        setStats(res.stats || { avgRating: 0, count: 0 })
      })
      .catch(() => {
        setReviews([])
        setStats({ avgRating: 0, count: 0 })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [targetId, target])

  const alreadyReviewed =
    isLoggedIn &&
    user &&
    reviews.some((r) => (r.userId?._id || r.userId) === user.id || (r.userId?._id || r.userId) === user._id)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr("")
    setMsg("")
    if (!isLoggedIn) return
    setSubmitting(true)
    try {
      const body =
        target === "hotel"
          ? { hotelId: targetId, rating, comment }
          : { roomTypeId: targetId, rating, comment }
      await api.createReview(body)
      setMsg("Cảm ơn bạn đã gửi đánh giá!")
      setComment("")
      setRating(5)
      load()
    } catch (ex) {
      setErr(ex.message || "Gửi đánh giá thất bại")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-display text-xl text-navy-900">{title}</h2>
        <div className="flex items-center gap-2 text-sm">
          <Stars value={stats.avgRating} />
          <span className="font-semibold text-navy-900">{stats.avgRating || "—"}</span>
          <span className="text-navy-700/50">({stats.count} đánh giá)</span>
        </div>
      </div>

      {/* Form gửi đánh giá */}
      {isLoggedIn && user?.role === "customer" && !alreadyReviewed && (
        <form onSubmit={handleSubmit} className="border border-gray-100 rounded-xl p-4 mb-6 bg-cream/50">
          <p className="text-sm font-medium text-navy-800 mb-2">Viết đánh giá của bạn</p>
          <div className="mb-3">
            <span className="text-xs text-navy-700/60 mr-2">Số sao:</span>
            <Stars value={rating} size="text-2xl" onSelect={setRating} />
          </div>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gold-400 resize-none mb-3"
          />
          {err && <p className="text-red-500 text-xs mb-2">{err}</p>}
          {msg && <p className="text-green-600 text-xs mb-2">{msg}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-gold-400 hover:bg-gold-500 text-navy-900 text-sm font-semibold px-4 py-2 rounded-full disabled:opacity-60"
          >
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      )}

      {isLoggedIn && alreadyReviewed && (
        <p className="text-sm text-navy-700/60 mb-4">Bạn đã đánh giá rồi. Cảm ơn phản hồi của bạn!</p>
      )}

      {!isLoggedIn && (
        <p className="text-sm text-navy-700/60 mb-4">
          <Link to="/login" state={{ from: location.pathname }} className="text-gold-600 hover:underline">
            Đăng nhập
          </Link>{" "}
          để gửi đánh giá.
        </p>
      )}

      {/* Danh sách */}
      {loading ? (
        <p className="text-sm text-navy-700/50">Đang tải đánh giá...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-navy-700/50">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r._id} className="border-t border-gray-100 pt-4 first:border-0 first:pt-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-medium text-sm text-navy-900">
                  {r.userId?.fullName || "Khách"}
                </span>
                <span className="text-xs text-navy-700/40">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : ""}
                </span>
              </div>
              <Stars value={r.rating} size="text-sm" />
              {r.comment && (
                <p className="text-sm text-navy-700/80 mt-1.5 leading-relaxed">{r.comment}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
