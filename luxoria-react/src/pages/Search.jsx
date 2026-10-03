import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { api } from "../api/client"

export default function Search() {
  const [searchParams] = useSearchParams()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    minPrice: "",
    maxPrice: "",
    stars: "",
  })

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filters.city) params.city = filters.city
    if (filters.stars) params.stars = filters.stars
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice

    api.getHotels(params)
      .then((res) => setHotels(res.data || []))
      .catch(() => setHotels([]))
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-navy-900 mb-6">
        Kết quả tìm kiếm {filters.city && `– ${filters.city}`}
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24 space-y-4">
            <h3 className="font-semibold text-navy-900">Bộ lọc chi nhánh</h3>
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">Thành phố</label>
              <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-400">
                <option value="">Tất cả</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Nha Trang">Nha Trang</option>
                <option value="Phú Quốc">Phú Quốc</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Lạt">Đà Lạt</option>
                <option value="Sapa">Sapa</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">Hạng sao tối thiểu</label>
              <select value={filters.stars} onChange={(e) => setFilters({ ...filters, stars: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-400">
                <option value="">Tất cả</option>
                <option value="3">3 sao+</option>
                <option value="4">4 sao+</option>
                <option value="5">5 sao</option>
              </select>
            </div>
            <button onClick={() => setFilters({ city: "", minPrice: "", maxPrice: "", stars: "" })}
              className="w-full text-sm text-navy-700/60 hover:text-navy-900 underline">Xóa bộ lọc</button>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <p className="text-navy-700/60">Đang tải...</p>
          ) : (
            <>
              <p className="text-sm text-navy-700/60 mb-4">{hotels.length} chi nhánh tìm thấy</p>
              {hotels.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center text-navy-700/60">Không tìm thấy chi nhánh phù hợp.</div>
              ) : (
                <div className="space-y-4">
                  {hotels.map((hotel) => (
                    <Link key={hotel._id} to={`/hotels/${hotel._id}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col sm:flex-row">
                      <div className="sm:w-56 h-44 sm:h-auto shrink-0">
                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-gold-400 text-sm mb-1">{"★".repeat(hotel.starRating || 3)}</div>
                          <h3 className="font-display text-xl text-navy-900 mb-1">{hotel.name}</h3>
                          <p className="text-sm text-navy-700/60 mb-2">{hotel.city} · {hotel.address}</p>
                          <p className="text-sm text-navy-700/80 line-clamp-2">{hotel.description}</p>
                        </div>
                        <span className="text-sm text-gold-600 font-medium mt-3">Xem phòng →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
