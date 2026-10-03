import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Số phòng là bắt buộc"],
      trim: true,
    },
    roomTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
      index: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
    floor: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance", "cleaning"],
      default: "available",
    },
  },
  { timestamps: true }
);

// Mỗi khách sạn không được trùng số phòng
roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model("Room", roomSchema);
