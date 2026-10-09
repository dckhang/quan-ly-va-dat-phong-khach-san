export default function About() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <div className="relative h-64 md:h-80 bg-navy-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400"
          alt="Kensington"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <p className="text-gold-400 text-sm tracking-[0.25em] uppercase mb-2">Về chúng tôi</p>
            <h1 className="font-display text-4xl md:text-5xl">Kensington Hotels</h1>
            <p className="mt-3 text-white/80 max-w-xl mx-auto text-sm md:text-base">
              Chuỗi lưu trú cao cấp — kết nối những điểm đến đẹp nhất Việt Nam
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14 space-y-14">
        {/* Giới thiệu */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl text-navy-900 mb-4">Câu chuyện thương hiệu</h2>
          <div className="space-y-4 text-navy-700/85 leading-relaxed text-[15px]">
            <p>
              Kensington ra đời từ mong muốn mang đến trải nghiệm lưu trú tinh tế, đồng nhất về tiêu chuẩn phục vụ
              nhưng vẫn giữ bản sắc từng vùng miền. Thay vì chỉ vận hành một khách sạn đơn lẻ, chúng tôi xây dựng
              một nền tảng giúp du khách dễ dàng khám phá và đặt phòng tại nhiều điểm đến — từ phố cổ Hà Nội,
              biển Đà Nẵng – Nha Trang – Phú Quốc, đến Đà Lạt, Sapa, Hội An và Vũng Tàu.
            </p>
            <p>
              Mỗi chi nhánh Kensington được chọn vị trí thuận tiện, thiết kế ấm cúng và tiện nghi hiện đại.
              Dù bạn đi công tác cuối tuần hay nghỉ dưỡng dài ngày, hệ thống đặt phòng trực tuyến giúp bạn
              so sánh, chọn ngày và giữ chỗ chỉ trong vài bước.
            </p>
          </div>
        </section>

        {/* Số liệu */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: "12+", l: "Chi nhánh" },
            { n: "8", l: "Điểm đến" },
            { n: "24/7", l: "Hỗ trợ đặt phòng" },
            { n: "30%", l: "Đặt cọc giữ chỗ" },
          ].map((item) => (
            <div key={item.l} className="bg-white rounded-2xl p-5 text-center shadow-sm">
              <p className="font-display text-2xl md:text-3xl text-gold-500">{item.n}</p>
              <p className="text-sm text-navy-700/70 mt-1">{item.l}</p>
            </div>
          ))}
        </section>

        {/* Sứ mệnh */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-display text-xl text-navy-900 mb-3">Sứ mệnh</h3>
            <p className="text-navy-700/80 text-sm leading-relaxed">
              Mang lại quy trình đặt phòng minh bạch, nhanh chóng và an toàn: xem phòng – đặt cọc –
              được xác nhận bởi đội ngũ vận hành – nhận phòng đúng lịch. Chúng tôi đặt trải nghiệm
              của khách hàng và sự vận hành ổn định của từng chi nhánh làm trọng tâm.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-display text-xl text-navy-900 mb-3">Giá trị cốt lõi</h3>
            <ul className="text-sm text-navy-700/80 space-y-2 leading-relaxed">
              <li>• <strong>Tinh tế</strong> — không gian và dịch vụ chỉn chu</li>
              <li>• <strong>Minh bạch</strong> — giá, cọc và trạng thái đơn rõ ràng</li>
              <li>• <strong>Đồng bộ</strong> — tiêu chuẩn chung trên mọi chi nhánh</li>
              <li>• <strong>Tận tâm</strong> — hỗ trợ trước, trong và sau chuyến đi</li>
            </ul>
          </div>
        </section>

        {/* Điểm đến */}
        <section>
          <h2 className="font-display text-2xl text-navy-900 mb-4">Hệ thống điểm đến</h2>
          <p className="text-navy-700/80 text-sm leading-relaxed mb-4">
            Kensington hiện diện tại các thành phố và điểm du lịch trọng điểm, với nhiều chi nhánh
            cùng khu vực nhưng địa điểm khác nhau để bạn linh hoạt lựa chọn.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Đà Nẵng",
              "Nha Trang",
              "Phú Quốc",
              "Hà Nội",
              "Đà Lạt",
              "Sapa",
              "Hội An",
              "Vũng Tàu",
            ].map((c) => (
              <span
                key={c}
                className="bg-navy-900 text-white text-xs px-3 py-1.5 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* Liên hệ */}
        <section className="bg-navy-900 text-white rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl mb-2">Liên hệ với chúng tôi</h2>
          <p className="text-white/70 text-sm mb-6">
            Đội ngũ Kensington sẵn sàng hỗ trợ đặt phòng và giải đáp thắc mắc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a href="tel:19001234" className="bg-gold-400 text-navy-900 font-semibold px-5 py-2.5 rounded-full">
              Hotline: 1900 1234
            </a>
            <a
              href="mailto:support@kensington.vn"
              className="border border-white/30 hover:border-gold-400 px-5 py-2.5 rounded-full transition"
            >
              support@kensington.vn
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
