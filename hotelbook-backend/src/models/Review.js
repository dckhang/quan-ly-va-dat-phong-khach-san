import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    roomTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "RoomType" },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    target: { type: String, enum: ["hotel", "roomType"], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000, default: "" },
    // Admin: hiện trên trang chủ (chỉ đánh giá tích cực thường được chọn)
    isFeatured: { type: Boolean, default: false },
    // Admin: ẩn đánh giá xấu / spam
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index(
  { userId: 1, hotelId: 1, target: 1 },
  { unique: true, partialFilterExpression: { target: "hotel" } }
);
reviewSchema.index(
  { userId: 1, roomTypeId: 1, target: 1 },
  { unique: true, partialFilterExpression: { target: "roomType" } }
);

export default mongoose.model("Review", reviewSchema);
