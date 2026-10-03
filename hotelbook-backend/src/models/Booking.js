import mongoose from "mongoose";

/**
 * Luồng trạng thái:
 * awaiting_deposit → deposit_paid → confirmed → checked_in → fully_paid → checked_out
 * awaiting_deposit → expired → cancelled  (không thanh toán cọc đúng hạn)
 * bất kỳ (trước checked_in) → cancelled
 */
const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    roomTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },
    checkInDate: {
      type: Date,
      required: [true, "Ngày nhận phòng là bắt buộc"],
    },
    checkOutDate: {
      type: Date,
      required: [true, "Ngày trả phòng là bắt buộc"],
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    // Giá
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    depositPercent: {
      type: Number,
      default: 30, // 30%
    },
    depositAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "awaiting_deposit", // Chờ thanh toán cọc
        "deposit_paid", // Đã đặt cọc
        "confirmed", // Đã xác nhận (nhân viên)
        "checked_in", // Đã nhận phòng
        "fully_paid", // Đã thanh toán đủ
        "checked_out", // Đã trả phòng
        "expired", // Hết thời gian giữ phòng (không cọc)
        "cancelled", // Đã hủy
        "rejected", // Nhân viên từ chối
      ],
      default: "awaiting_deposit",
      index: true,
    },
    // Hạn thanh toán cọc (vd: 30 phút sau khi tạo đơn)
    depositDeadline: {
      type: Date,
    },
    note: {
      type: String,
      default: "",
    },
    // Snapshot hiển thị
    hotelName: String,
    roomName: String,
    roomNumber: String,
    guestName: String,
    guestPhone: String,
    guestEmail: String,
  },
  { timestamps: true }
);

bookingSchema.pre("validate", function (next) {
  if (this.checkOutDate <= this.checkInDate) {
    this.invalidate("checkOutDate", "Ngày trả phòng phải sau ngày nhận phòng");
  }
  next();
});

export default mongoose.model("Booking", bookingSchema);
