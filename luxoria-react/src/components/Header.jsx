export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-gold-400 flex items-center justify-center">
            <span className="font-display text-gold-400 text-xl font-bold">L</span>
          </div>
          <div>
            <div className="font-display text-lg tracking-wide leading-none">LUXORIA</div>
            <div className="text-[10px] tracking-[0.25em] text-gold-400 uppercase">Hotel & Resort</div>
          </div>
        </a>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="/" className="text-gold-400 border-b border-gold-400 pb-0.5">TRANG CHỦ</a>
          <a href="#rooms" className="hover:text-gold-400 transition">PHÒNG</a>
          <a href="#services" className="hover:text-gold-400 transition">DỊCH VỤ & TIỆN ÍCH</a>
          <a href="#experience" className="hover:text-gold-400 transition">TRẢI NGHIỆM</a>
          <a href="#offers" className="hover:text-gold-400 transition">ƯU ĐÃI</a>
          <a href="#about" className="hover:text-gold-400 transition">VỀ CHÚNG TÔI</a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <a
            href="#booking"
            className="hidden sm:inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold text-sm px-5 py-2.5 rounded-full transition"
          >
            ĐẶT PHÒNG
          </a>
          <button className="lg:hidden text-white" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
