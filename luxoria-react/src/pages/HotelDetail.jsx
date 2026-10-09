import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { api, formatPrice } from "../api/client"
import ReviewSection from "../components/ReviewSection"

export default function HotelDetail() {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
  const [siblings, setSiblings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .getHotel(id)
      .then(async (res) => {
        const h = res.data
        setHotel(h)
        if (h?.city) {
          try {
            const list = await api.getHotels({ city: h.city })
            const others = (list.data || []).filter((x) => x._id !== h._id)
            setSiblings(others)
          } catch {
            setSiblings([])
          }
        }
      })
      .catch(() => setHotel(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="text-center py-20 text-navy-700/60">Đang tải...</div>
  }

  if (!hotel) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-display mb-4">Không tìm thấy chi nhánh</h2>
        <Link to="/search" className="text-gold-600 hover:underline">
          ← Quay lại
        </Link>
      </div>
    )
  }

  const roomTypes = hotel.roomTypes || []

  return (
    <div>
      {/* Hero */}
      <div className="h-64 md:h-80 relative">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white max-w-7xl mx-auto">
          <div className="flex items-center gap-1 text-gold-400 text-sm mb-2">
            {"★".repeat(hotel.starRating || 3)}
            <span className="text-white/70 ml-1">{hotel.starRating} sao</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl mb-1">{hotel.name}</h1>
          <p className="text-white/90 text-sm md:text-base">{hotel.address}</p>
          {hotel.availableRooms != null && (
            <p className="mt-2 text-sm">
              <span className="bg-white/20 px-2 py-0.5 rounded">
                Còn trống: <strong>{hotel.availableRooms}</strong> / {hotel.totalRooms} phòng
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Giới thiệu ngắn */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="font-display text-xl mb-3">Giới thiệu</h2>
          <p className="text-navy-700/80 text-sm leading-relaxed">{hotel.description}</p>
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {hotel.amenities.map((a) => (
                <span key={a} className="bg-cream text-navy-800 text-xs px-2.5 py-1 rounded-full">
                  {a}
                </span>
              ))}
            </div>
          )}
          {hotel.latitude && hotel.longitude && (
            <a
              href={"https://www.google.com/maps?q=" + hotel.latitude + "," + hotel.longitude}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 text-sm text-gold-600 hover:underline"
            >
              Xem trên Google Maps →
            </a>
          )}
        </div>

        {/* Danh sách phòng */}
        <h2 className="font-display text-2xl mb-6">Danh sách phòng</h2>
        {roomTypes.length === 0 ? (
          <p className="text-navy-700/60 mb-10">Chưa có loại phòng.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {roomTypes.map((rt) => (
              <div
                key={rt._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={(rt.images && rt.images[0]) || hotel.image}
                    alt={rt.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-lg">{rt.name}</h3>
                    {rt.availableRooms != null && (
                      <span
                        className={
                          "text-xs px-2 py-0.5 rounded-full shrink-0 " +
                          (rt.availableRooms > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-700")
                        }
                      >
                        {rt.availableRooms > 0
                          ? "Còn " + rt.availableRooms + " phòng"
                          : "Hết phòng"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-navy-700/60 mb-2">
                    {rt.size} · Tối đa {rt.capacity} khách
                    {rt.bedType ? " · " + rt.bedType : ""}
                  </p>
                  {rt.view && (
                    <p className="text-sm text-navy-700/70 mb-1">
                      <span className="font-medium">View: </span>
                      {rt.view}
                    </p>
                  )}
                  {rt.bathroom && (
                    <p className="text-sm text-navy-700/70 mb-1">
                      <span className="font-medium">Phòng tắm: </span>
                      {rt.bathroom}
                    </p>
                  )}
                  <p className="text-sm text-navy-700/80 leading-relaxed mb-3 line-clamp-3">
                    {rt.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(rt.amenities || []).map((a) => (
                      <span
                        key={a}
                        className="text-xs bg-cream text-navy-700 px-2 py-0.5 rounded-full"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="font-semibold text-navy-900">
                      {formatPrice(rt.basePrice)}
                      <span className="text-sm font-normal text-navy-700/50"> / đêm</span>
                    </p>
                    <Link
                      to={"/rooms/" + rt._id}
                      className={
                        "text-sm font-semibold px-4 py-2 rounded-full transition " +
                        (rt.availableRooms === 0
                          ? "bg-gray-200 text-gray-500 pointer-events-none"
                          : "bg-gold-400 hover:bg-gold-500 text-navy-900")
                      }
                    >
                      {rt.availableRooms === 0 ? "Hết phòng" : "Đặt phòng"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chi nhánh khác cùng thành phố – địa điểm khác */}
        <ReviewSection target="hotel" targetId={hotel._id} title="Đánh giá chi nhánh" />

        {siblings.length > 0 && (
          <div>
            <h2 className="font-display text-2xl mb-2">
              Chi nhánh khác tại {hotel.city}
            </h2>
            <p className="text-sm text-navy-700/60 mb-6">
              Cùng khu vực nhưng địa điểm khác nhau
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {siblings.map((s) => (
                <Link
                  key={s._id}
                  to={"/hotels/" + s._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col sm:flex-row"
                >
                  <div className="sm:w-44 h-36 sm:h-auto shrink-0">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1">
                    <div className="flex items-center gap-1 text-gold-400 text-xs mb-1">
                      {"★".repeat(s.starRating || 3)}
                    </div>
                    <h3 className="font-display text-lg text-navy-900 mb-1">{s.name}</h3>
                    <p className="text-sm text-navy-700/70 mb-2">{s.address}</p>
                    {s.availableRooms != null && (
                      <p className="text-xs text-green-700">
                        Còn {s.availableRooms}/{s.totalRooms} phòng
                      </p>
                    )}
                    <span className="inline-block mt-2 text-sm text-gold-600 font-medium">
                      Xem chi nhánh →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
