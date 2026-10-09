import { useState, useEffect } from "react"
import { api } from "../../api/client"

const empty = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "cam-nang",
  isPublished: true,
  isFeatured: false,
}

export default function AdminArticles() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [msg, setMsg] = useState("")
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .getArticles({ published: "all", full: "true" })
      .then((res) => setList(res.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setMsg("")
    try {
      if (editingId) {
        await api.updateArticle(editingId, form)
        setMsg("Đã cập nhật bài viết.")
      } else {
        await api.createArticle(form)
        setMsg("Đã thêm bài viết.")
      }
      setForm(empty)
      setEditingId(null)
      setShowForm(false)
      load()
    } catch (err) {
      setMsg(err.message || "Lỗi lưu bài viết")
    }
  }

  const edit = (a) => {
    setForm({
      title: a.title || "",
      excerpt: a.excerpt || "",
      content: a.content || "",
      coverImage: a.coverImage || "",
      category: a.category || "cam-nang",
      isPublished: a.isPublished !== false,
      isFeatured: !!a.isFeatured,
    })
    setEditingId(a._id)
    setShowForm(true)
  }

  const remove = async (id) => {
    if (!confirm("Xóa bài viết này?")) return
    try {
      await api.deleteArticle(id)
      load()
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold">Quản lý bài viết</h2>
        <button
          onClick={() => {
            setForm(empty)
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="bg-gold-400 hover:bg-gold-500 text-navy-900 text-sm font-semibold px-4 py-2 rounded-lg"
        >
          {showForm ? "Đóng form" : "+ Thêm bài viết"}
        </button>
      </div>

      {msg && <p className="mb-4 text-sm bg-cream px-3 py-2 rounded-lg">{msg}</p>}

      {showForm && (
        <form onSubmit={submit} className="bg-white rounded-xl p-5 shadow-sm mb-6 space-y-3">
          <input
            required
            placeholder="Tiêu đề"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Tóm tắt (excerpt)"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="URL ảnh bìa"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="cam-nang">Cẩm nang</option>
            <option value="tin-tuc">Tin tức</option>
            <option value="uu-dai">Ưu đãi</option>
            <option value="khac">Khác</option>
          </select>
          <textarea
            required
            rows={6}
            placeholder="Nội dung bài viết"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              />
              Xuất bản
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              Hiện trang chủ
            </label>
          </div>
          <button type="submit" className="bg-navy-900 text-white text-sm font-medium px-4 py-2 rounded-lg">
            {editingId ? "Cập nhật" : "Tạo bài viết"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : list.length === 0 ? (
        <p className="text-gray-500">Chưa có bài viết.</p>
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <div key={a._id} className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {a.category} · {a.isPublished ? "Đã xuất bản" : "Nháp"}
                  {a.isFeatured ? " · Trang chủ" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => edit(a)} className="text-sm px-3 py-1.5 bg-gray-100 rounded-lg">
                  Sửa
                </button>
                <button onClick={() => remove(a._id)} className="text-sm px-3 py-1.5 bg-red-50 text-red-700 rounded-lg">
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
