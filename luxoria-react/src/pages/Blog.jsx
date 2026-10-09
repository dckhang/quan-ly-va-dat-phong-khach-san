import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "../api/client"

const catLabel = {
  "tin-tuc": "Tin tức",
  "cam-nang": "Cẩm nang",
  "uu-dai": "Ưu đãi",
  khac: "Khác",
}

export default function Blog() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("")

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (category) params.category = category
    api
      .getArticles(params)
      .then((res) => setList(res.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-navy-900 text-white py-14 px-6 text-center">
        <p className="text-gold-400 text-sm tracking-widest uppercase mb-2">Kensington Journal</p>
        <h1 className="font-display text-4xl md:text-5xl">Bài viết</h1>
        <p className="text-white/70 mt-3 max-w-lg mx-auto text-sm">
          Cẩm nang du lịch, tin tức chi nhánh và mẹo đặt phòng hữu ích
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { v: "", l: "Tất cả" },
            { v: "cam-nang", l: "Cẩm nang" },
            { v: "tin-tuc", l: "Tin tức" },
            { v: "uu-dai", l: "Ưu đãi" },
          ].map((c) => (
            <button
              key={c.v || "all"}
              onClick={() => setCategory(c.v)}
              className={
                "px-4 py-1.5 rounded-full text-sm font-medium transition " +
                (category === c.v
                  ? "bg-navy-900 text-white"
                  : "bg-white text-navy-800 hover:bg-gray-100")
              }
            >
              {c.l}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-navy-700/50 py-12">Đang tải...</p>
        ) : list.length === 0 ? (
          <p className="text-center text-navy-700/50 py-12">Chưa có bài viết.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((a) => (
              <Link
                key={a._id}
                to={`/blog/${a._id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      a.coverImage ||
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600"
                    }
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs text-gold-600 font-medium uppercase">
                    {catLabel[a.category] || a.category}
                  </span>
                  <h2 className="font-display text-lg text-navy-900 mt-1 mb-2 line-clamp-2">
                    {a.title}
                  </h2>
                  <p className="text-sm text-navy-700/70 line-clamp-3">{a.excerpt}</p>
                  <p className="text-xs text-navy-700/40 mt-3">
                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString("vi-VN") : ""}
                    {a.authorName ? ` · ${a.authorName}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
