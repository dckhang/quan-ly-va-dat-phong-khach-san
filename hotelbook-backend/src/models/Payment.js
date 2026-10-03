import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    // deposit = tiền cọc | remaining = phần còn lại | full = thanh toán hết
    type: {
      type: String,
      enum: ["deposit", "remaining", "full", "refund"],
      default: "deposit",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ["cash", "bank_transfer", "momo", "vnpay", "credit_card"],
      default: "cash",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paidAt: {
      type: Date,
    },
    transactionId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
