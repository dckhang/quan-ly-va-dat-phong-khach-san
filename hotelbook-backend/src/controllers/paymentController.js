import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import { expireUnpaidDeposits } from "./bookingController.js";

// GET /api/payments/booking/:bookingId
export const getPaymentByBooking = async (req, res) => {
  try {
    const payments = await Payment.find({ bookingId: req.params.bookingId }).sort({ createdAt: 1 });
    if (!payments.length) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thông tin thanh toán." });
    }
    if (req.user.role === "customer") {
      const booking = await Booking.findById(req.params.bookingId);
      if (!booking || booking.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Không có quyền xem." });
      }
    }
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/payments/:bookingId/pay-deposit  – thanh toán cọc 30%
export const payDeposit = async (req, res) => {
  try {
    await expireUnpaidDeposits();
    const { method } = req.body;
    const validMethods = ["cash", "bank_transfer", "momo", "vnpay", "credit_card"];
    if (!method || !validMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        message: `Phương thức không hợp lệ. Cho phép: ${validMethods.join(", ")}`,
      });
    }

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt phòng." });
    }
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Bạn không phải chủ đơn này." });
    }
    if (booking.status === "expired") {
      return res.status(400).json({
        success: false,
        message: "Đơn đã hết thời gian giữ phòng. Vui lòng đặt lại.",
      });
    }
    if (booking.status !== "awaiting_deposit") {
      return res.status(400).json({
        success: false,
        message: `Đơn không ở trạng thái chờ cọc (hiện tại: ${booking.status}).`,
      });
    }
    if (booking.depositDeadline && new Date() > booking.depositDeadline) {
      booking.status = "expired";
      await booking.save();
      return res.status(400).json({
        success: false,
        message: "Đã hết thời gian thanh toán cọc. Đơn đã hủy, phòng được mở lại.",
      });
    }

    let payment = await Payment.findOne({ bookingId: booking._id, type: "deposit" });
    if (!payment) {
      payment = await Payment.create({
        bookingId: booking._id,
        type: "deposit",
        amount: booking.depositAmount,
        method,
        status: "pending",
      });
    }
    if (payment.status === "paid") {
      return res.status(400).json({ success: false, message: "Đã thanh toán cọc rồi." });
    }

    // Mô phỏng cổng thanh toán – luôn thành công
    const transactionId = `DEP${Date.now()}${Math.floor(Math.random() * 1000)}`;
    payment.method = method;
    payment.status = "paid";
    payment.paidAt = new Date();
    payment.transactionId = transactionId;
    await payment.save();

    booking.status = "deposit_paid";
    await booking.save();

    res.json({
      success: true,
      message: "Thanh toán cọc thành công! Đơn đang chờ nhân viên xác nhận.",
      data: {
        payment,
        booking: {
          id: booking._id,
          status: booking.status,
          depositAmount: booking.depositAmount,
          remainingAmount: booking.remainingAmount,
          totalPrice: booking.totalPrice,
        },
        gateway: { provider: method, transactionId, amount: payment.amount, paidAt: payment.paidAt },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/payments/:bookingId/pay-remaining  – thanh toán phần còn lại (khi check-in / trước checkout)
export const payRemaining = async (req, res) => {
  try {
    const { method } = req.body;
    const validMethods = ["cash", "bank_transfer", "momo", "vnpay", "credit_card"];
    if (!method || !validMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        message: `Phương thức không hợp lệ. Cho phép: ${validMethods.join(", ")}`,
      });
    }

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn." });
    }

    // Customer chỉ thanh toán đơn mình; staff/admin thanh toán hộ được
    if (
      req.user.role === "customer" &&
      booking.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Không có quyền." });
    }

    if (!["confirmed", "checked_in"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "Chỉ thanh toán phần còn lại khi đơn đã xác nhận hoặc đã nhận phòng.",
      });
    }

    const existing = await Payment.findOne({
      bookingId: booking._id,
      type: "remaining",
      status: "paid",
    });
    if (existing) {
      return res.status(400).json({ success: false, message: "Đã thanh toán đủ rồi." });
    }

    const transactionId = `REM${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const payment = await Payment.create({
      bookingId: booking._id,
      type: "remaining",
      amount: booking.remainingAmount,
      method,
      status: "paid",
      paidAt: new Date(),
      transactionId,
    });

    booking.status = "fully_paid";
    await booking.save();

    res.json({
      success: true,
      message: "Thanh toán phần còn lại thành công. Đơn đã thanh toán đủ.",
      data: { payment, booking: { id: booking._id, status: booking.status } },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Legacy: POST /api/payments/:bookingId/pay → chuyển sang pay deposit nếu đang awaiting
export const processPayment = async (req, res) => {
  return payDeposit(req, res);
};

export const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thanh toán." });
    }
    if (payment.status !== "paid") {
      return res.status(400).json({ success: false, message: "Chỉ hoàn tiền giao dịch đã thanh toán." });
    }
    payment.status = "refunded";
    await payment.save();
    await Booking.findByIdAndUpdate(payment.bookingId, { status: "cancelled" });
    res.json({ success: true, message: "Hoàn tiền thành công. Đơn đã hủy.", data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "bookingId",
        select: "hotelName roomName totalPrice status userId depositAmount remainingAmount",
        populate: { path: "userId", select: "fullName email" },
      });
    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
