const reviews = [
  {
    quote: "Kỳ nghỉ tuyệt vời nhất của chúng tôi. Dịch vụ hoàn hảo, không gian sang trọng và view tuyệt đẹp!",
    name: "Jennifer Moore",
    role: "Khách hàng quốc tế",
    initials: "JM",
  },
  {
    quote: "Từ nhân viên đến ẩm thực, mọi thứ đều mượt mà. Chúng tôi chắc chắn sẽ quay lại.",
    name: "Nguyễn Thanh Tùng",
    role: "TP. Hồ Chí Minh, Việt Nam",
    initials: "NT",
  },
  {
    quote: "Một resort thực sự 5 sao+. Mọi chi tiết đều chỉn chu và đẳng cấp.",
    name: "Sophie Dubois",
    role: "Paris, Pháp",
    initials: "SD",
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-gold-500 tracking-[0.2em] text-sm uppercase mb-3">Khách hàng nói gì</p>
          <h2 className="font-display text-4xl md:text-5xl text-navy-900">Cảm nhận từ khách quý</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-gold-400 text-2xl mb-4">“</div>
              <p className="text-navy-800 leading-relaxed mb-6">{r.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-navy-800 flex items-center justify-center text-white font-medium">
                  {r.initials}
                </div>
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-sm text-navy-700/60">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
