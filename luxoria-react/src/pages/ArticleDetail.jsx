import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { api } from "../api/client"

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getArticle(id)
      .then((res) => setArticle(res.data))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-20 text-navy-700/60">Đang tải...</div>
  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-display mb-4">Không tìm thấy bài viết</h2>
        <Link to="/blog" className="text-gold-600 hover:underline">
          ← Về danh sách bài viết
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/blog" className="text-sm text-gold-600 hover:underline">
          ← Tất cả bài viết
        </Link>
        <h1 className="font-display text-3xl md:text-4xl text-navy-900 mt-4 mb-3 leading-tight">
          {article.title}
        </h1>
        <p className="text-sm text-navy-700/50 mb-6">
          {article.createdAt ? new Date(article.createdAt).toLocaleDateString("vi-VN") : ""}
          {article.authorName ? ` · ${article.authorName}` : ""}
        </p>
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8"
          />
        )}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          {article.content.split("\n").map((p, i) =>
            p.trim() ? (
              <p key={i} className="text-navy-800 leading-relaxed mb-4 text-[15px]">
                {p}
              </p>
            ) : (
              <br key={i} />
            )
          )}
        </div>
      </div>
    </div>
  )
}
