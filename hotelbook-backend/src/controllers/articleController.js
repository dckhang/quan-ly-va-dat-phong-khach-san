import Article from "../models/Article.js";

export const getArticles = async (req, res) => {
  try {
    const filter = {};
    if (req.query.published !== "all") filter.isPublished = true;
    if (req.query.featured === "true") filter.isFeatured = true;
    if (req.query.category) filter.category = req.query.category;

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(req.query.limit) || 50)
      .select(req.query.full === "true" ? undefined : "-content");

    res.json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article || (!article.isPublished && req.user?.role !== "admin")) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài viết." });
    }
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, category, authorName, isPublished, isFeatured } =
      req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Thiếu tiêu đề hoặc nội dung." });
    }
    const article = await Article.create({
      title,
      excerpt: excerpt || content.slice(0, 150) + "...",
      content,
      coverImage: coverImage || "",
      category: category || "cam-nang",
      authorName: authorName || "Kensington",
      isPublished: isPublished !== false,
      isFeatured: !!isFeatured,
    });
    res.status(201).json({ success: true, message: "Đã tạo bài viết.", data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết." });

    const fields = [
      "title",
      "excerpt",
      "content",
      "coverImage",
      "category",
      "authorName",
      "isPublished",
      "isFeatured",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) article[f] = req.body[f];
    });
    await article.save();
    res.json({ success: true, message: "Đã cập nhật bài viết.", data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết." });
    await article.deleteOne();
    res.json({ success: true, message: "Đã xóa bài viết." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
