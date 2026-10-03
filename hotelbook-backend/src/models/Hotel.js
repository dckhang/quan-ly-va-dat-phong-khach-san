import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên khách sạn là bắt buộc"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Địa chỉ là bắt buộc"],
    },
    // Địa chỉ chi tiết
    district: { type: String, default: "" }, // Quận/Huyện
    ward: { type: String, default: "" }, // Phường/Xã
    city: {
      type: String,
      required: [true, "Thành phố là bắt buộc"],
      index: true,
    },
    province: { type: String, default: "" }, // Tỉnh
    // Tọa độ (để hiển thị bản đồ sau này)
    latitude: { type: Number },
    longitude: { type: Number },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    images: [String],
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    amenities: [String],
    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "12:00" },
    phone: { type: String, default: "" },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);
