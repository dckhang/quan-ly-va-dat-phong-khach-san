const services = [
  {
    title: "Hồ bơi vô cực",
    desc: "Bể bơi vô cực hướng biển tuyệt đẹp, thư giãn trong không gian đẳng cấp.",
    icon: (
      <svg className="w-7 h-7 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "Spa & Wellness",
    desc: "Chăm sóc toàn diện body & tâm hồn với liệu trình cao cấp và yoga bên bờ vịnh.",
    icon: (
      <svg className="w-7 h-7 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: "Nhà hàng fine dining",
    desc: "Ẩm thực tinh hoa từ đầu bếp quốc tế, kết hợp nguyên liệu địa phương chọn lọc.",
    icon: (
      <svg className="w-7 h-7 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Đưa đón sân bay",
    desc: "Dịch vụ đưa đón sang trọng bằng xe limousine và tốc hành cao cấp.",
    icon: (
      <svg className="w-7 h-7 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-gold-500 tracking-[0.2em] text-sm uppercase mb-3">Trải nghiệm đẳng cấp</p>
          <h2 className="font-display text-4xl md:text-5xl text-navy-900 mb-4">Dịch vụ & Tiện ích</h2>
          <p className="text-navy-700/70 max-w-xl mx-auto">
            Những dịch vụ tinh hoa được thiết kế để nâng tầm kỳ nghỉ của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-cream rounded-2xl p-8 text-center hover:shadow-lg transition">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-gold-400/15 flex items-center justify-center">
                {s.icon}
              </div>
              <h3 className="font-display text-xl mb-2">{s.title}</h3>
              <p className="text-sm text-navy-700/70 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
