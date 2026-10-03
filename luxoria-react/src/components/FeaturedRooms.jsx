const rooms = [
  {
    id: 1,
    name: "Deluxe Ocean View",
    size: "42 m²",
    rating: 4.8,
    price: "5.800.000",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Premier Suite",
    size: "68 m²",
    rating: 4.9,
    price: "9.800.000",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Luxury Pool Villa",
    size: "120 m²",
    rating: 5.0,
    price: "15.800.000",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Executive Sea View",
    size: "55 m²",
    rating: 4.7,
    price: "7.800.000",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop",
  },
]

export default function FeaturedRooms() {
  return (
    <section id="rooms" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-gold-500 tracking-[0.2em] text-sm uppercase mb-3">Khám phá</p>
          <h2 className="font-display text-4xl md:text-5xl text-navy-900 mb-4">Phòng nổi bật</h2>
          <p className="text-navy-700/70 max-w-xl mx-auto">
            Những lựa chọn nghỉ dưỡng sang trọng, được thiết kế để mang lại sự thoải mái tuyệt đối.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group"
            >
              <div className="relative overflow-hidden h-56">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl mb-1">{room.name}</h3>
                <p className="text-sm text-navy-700/60 mb-3">Diện tích: {room.size}</p>
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-gold-400">★★★★★</span>
                  <span className="text-xs text-navy-700/50 ml-1">{room.rating}</span>
                </div>
                <p className="text-navy-900 font-semibold mb-4">
                  Từ {room.price} VND <span className="text-sm font-normal text-navy-700/60">/ đêm</span>
                </p>
                <a
                  href={`/rooms/${room.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-500 transition"
                >
                  Xem chi tiết
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/rooms"
            className="inline-flex items-center gap-2 border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white font-medium px-8 py-3 rounded-full transition"
          >
            XEM TẤT CẢ PHÒNG
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
