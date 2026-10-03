import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "../api/client"

export default function Home() {
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState({ city: "", checkIn: "", checkOut: "", guests: 2 })

  useEffect(() => {
    api.getHotels()
      .then((res) => setHotels(res.data || []))
      .catch(() => setHotels([]))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.city) params.set("city", search.city)
    if (search.checkIn) params.set("checkIn", search.checkIn)
    if (search.checkOut) params.set("checkOut", search.checkOut)
    if (search.guests) params.set("guests", search.guests)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div>
      <section className="relative bg-navy-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 max-w-2xl leading-tight">
            Hệ thống đặt phòng 6 chi nhánh Kensington
          </h1>
          <p className="text-white/80 text-lg mb-10 max-w-xl">
            Đà Nẵng · Nha Trang · Phú Quốc · Hà Nội · Đà Lạt · Sapa
          </p>
          <form onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-4xl grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">Chi nhánh / Thành phố</label>
              <select value={search.city} onChange={(e) => setSearch({ ...search, city: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-400">
                <option value="">Tất cả chi nhánh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Nha Trang">Nha Trang</option>
                <option value="Phú Quốc">Phú Quốc</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Lạt">Đà Lạt</option>
                <option value="Sapa">Sapa</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">Ngày nhận</label>
              <input type="date" value={search.checkIn} onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">Ngày trả</label>
              <input type="date" value={search.checkOut} onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">Số khách</label>
              <select value={search.guests} onChange={(e) => setSearch({ ...search, guests: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-400">
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} người</option>)}
              </select>
            </div>
            <button type="submit" className="bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold py-2.5 rounded-xl transition">
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-gold-500 text-sm tracking-widest uppercase mb-1">Chi nhánh</p>
            <h2 className="font-display text-3xl md:text-4xl text-navy-900">6 chi nhánh Kensington</h2>
          </div>
          <Link to="/search" className="text-sm font-medium text-gold-600 hover:underline hidden sm:inline">Xem tất cả →</Link>
        </div>
        {loading ? (
          <p className="text-center text-navy-700/60 py-12">Đang tải chi nhánh...</p>
        ) : hotels.length === 0 ? (
          <p className="text-center text-navy-700/60 py-12">
            Chưa có dữ liệu. Chạy Backend rồi <code className="bg-cream px-1 rounded">npm run seed</code>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <Link key={hotel._id} to={`/hotels/${hotel._id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group">
                <div className="h-48 overflow-hidden">
                  <img src={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400"}
                    alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-gold-400 text-sm mb-1">
                    {"★".repeat(hotel.starRating || 3)}
                    <span className="text-navy-700/50 text-xs ml-1">{hotel.starRating}.0</span>
                  </div>
                  <h3 className="font-display text-lg text-navy-900 mb-1">{hotel.name}</h3>
                  <p className="text-sm text-navy-700/60">{hotel.city} · {hotel.address}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
