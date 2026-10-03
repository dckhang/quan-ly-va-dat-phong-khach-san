import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Tên loại phòng là bắt buộc"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    bedType: { type: String, default: "" },
    view: { type: String, default: "" },
    bathroom: { type: String, default: "" },
    extraInfo: { type: String, default: "" },
    basePrice: {
      type: Number,
      required: [true, "Giá cơ bản là bắt buộc"],
      min: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      default: 2,
    },
    size: {
      type: String,
      default: "",
    },
    amenities: [String],
    images: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RoomType", roomTypeSchema);
