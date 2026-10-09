import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    excerpt: { type: String, default: "", maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: {
      type: String,
      enum: ["tin-tuc", "cam-nang", "uu-dai", "khac"],
      default: "cam-nang",
    },
    authorName: { type: String, default: "Kensington" },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

articleSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug =
      this.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36);
  }
  next();
});

export default mongoose.model("Article", articleSchema);
