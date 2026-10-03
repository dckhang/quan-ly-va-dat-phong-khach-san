export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full border-2 border-gold-400 flex items-center justify-center">
                <span className="font-display text-gold-400 text-xl font-bold">L</span>
              </div>
              <div>
                <div className="font-display text-lg tracking-wide leading-none">LUXORIA</div>
                <div className="text-[10px] tracking-[0.25em] text-gold-400 uppercase">Hotel & Resort</div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              Nơi lưu giữ những khoảnh khắc quý giá và mang đến trải nghiệm nghỉ dưỡng vượt trên mọi kỳ vọng.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold-400 hover:border-gold-400 hover:text-navy-900 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.239-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold-400 hover:border-gold-400 hover:text-navy-900 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold-400 hover:border-gold-400 hover:text-navy-900 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold tracking-wide mb-5">LIÊN HỆ</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-gold-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>Khu Resort Bãi Biển, Sơn Trà,<br />Đà Nẵng, Việt Nam</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-gold-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+84 236 3888 888</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-gold-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@luxoria-resort.com</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold tracking-wide mb-5">LIÊN KẾT NHANH</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="#" className="hover:text-gold-400 transition">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Chính sách</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Liên hệ</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Blog</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold tracking-wide mb-5">BẢN TIN</h4>
            <p className="text-sm text-white/70 mb-4">Đăng ký để nhận ưu đãi đặc biệt và trải nghiệm độc quyền.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gold-400 placeholder:text-white/40"
              />
              <button type="submit" className="bg-gold-400 hover:bg-gold-500 text-navy-900 px-4 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>© 2025 Kensington Hotels. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold-400 transition">Chính sách bảo mật</a>
            <a href="#" className="hover:text-gold-400 transition">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
