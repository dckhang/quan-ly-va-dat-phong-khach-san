export default function Hero() {
  return (
    <section className="hero-bg min-h-screen flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-6 w-full py-20">
        <div className="max-w-2xl text-white mb-12">
          <p className="text-gold-400 tracking-[0.2em] text-sm uppercase mb-4">
            Nơi tranh sâu gặp gỡ sự thư giãn
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
            LUXURY
            <br />
            BEYOND COMPARE
          </h1>
          <p className="text-white/85 text-lg leading-relaxed max-w-lg">
            Trải nghiệm nghỉ dưỡng đẳng cấp quốc tế với dịch vụ tinh tế, không gian sang trọng
            và những khoảnh khắc khó quên bên bờ vịnh tuyệt đẹp.
          </p>
        </div>

        {/* Search Form */}
        <div className="glass rounded-2xl shadow-2xl p-4 md:p-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1.5">Địa điểm</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 bg-white">
                <svg className="w-5 h-5 text-gold-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <select className="w-full bg-transparent text-sm outline-none text-navy-800">
                  <option>Đà Nẵng, Việt Nam</option>
                  <option>Nha Trang, Việt Nam</option>
                  <option>Phú Quốc, Việt Nam</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1.5">Ngày nhận phòng</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 bg-white">
                <svg className="w-5 h-5 text-gold-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input type="date" defaultValue="2025-05-24" className="w-full bg-transparent text-sm outline-none text-navy-800" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1.5">Ngày trả phòng</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 bg-white">
                <svg className="w-5 h-5 text-gold-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input type="date" defaultValue="2025-05-26" className="w-full bg-transparent text-sm outline-none text-navy-800" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1.5">Khách</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 bg-white">
                <svg className="w-5 h-5 text-gold-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <select className="w-full bg-transparent text-sm outline-none text-navy-800">
                  <option>2 người lớn, 0 trẻ em</option>
                  <option>1 người lớn</option>
                  <option>2 người lớn, 1 trẻ em</option>
                  <option>2 người lớn, 2 trẻ em</option>
                  <option>3 người lớn</option>
                  <option>4 người lớn</option>
                </select>
              </div>
            </div>

            <div>
              <button className="w-full bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-gold-400/30">
                TÌM PHÒNG
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
