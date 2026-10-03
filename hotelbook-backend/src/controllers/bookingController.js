import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";
import Hotel from "../models/Hotel.js";
import Payment from "../models/Payment.js";

const DEPOSIT_PERCENT = 30;
const DEPOSIT_HOLD_MINUTES = 30;

const isRoomAvailable = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const query = {
    roomId,
    status: {
      $in: ["awaiting_deposit", "deposit_paid", "confirmed", "checked_in", "fully_paid"],
    },
    checkInDate: { $lt: new Date(checkOut) },
    checkOutDate: { $gt: new Date(checkIn) },
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };
  const conflict = await Booking.findOne(query);
  return !conflict;
};

export const expireUnpaidDeposits = async () => {
  const now = new Date();
  const expired = await Booking.find({
    status: "awaiting_deposit",
    depositDeadline: { $lt: now },
  });
  for (const b of expired) {
    b.status = "expired";
    await b.save();
  }
  return expired.length;
};

export const createBooking = async (req, res) => {
  try {
    const { roomTypeId, checkInDate, checkOutDate, guests, note, guestName, guestPhone, guestEmail } = req.body;

    if (!roomTypeId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn loại phòng và ngày nhận/trả phòng." });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return res.status(400).json({ success: false, message: "Ngày trả phòng phải sau ngày nhận phòng." });
    }
    if (checkIn < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ success: false, message: "Không thể chọn ngày nhận phòng trong quá khứ." });
    }

    await expireUnpaidDeposits();

    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType || !roomType.isActive) {
      return res.status(404).json({ success: false, message: "Không tìm thấy loại phòng." });
    }
    if (guests > roomType.capacity) {
      return res.status(400).json({ success: false, message: `Phòng chỉ chứa tối đa ${roomType.capacity} khách.` });
    }

    const rooms = await Room.find({ roomTypeId, status: { $in: ["available", "cleaning"] } });
    let availableRoom = null;
    for (const room of rooms) {
      if (await isRoomAvailable(room._id, checkIn, checkOut)) {
        availableRoom = room;
        break;
      }
    }
    if (!availableRoom) {
      return res.status(400).json({ success: false, message: "Không còn phòng trống trong khoảng thời gian này." });
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * roomType.basePrice;
    const depositAmount = Math.round((totalPrice * DEPOSIT_PERCENT) / 100);
    const remainingAmount = totalPrice - depositAmount;
    const hotel = await Hotel.findById(roomType.hotelId);
    const deadline = new Date(Date.now() + DEPOSIT_HOLD_MINUTES * 60 * 1000);

    const booking = await Booking.create({
      userId: req.user._id,
      hotelId: roomType.hotelId,
      roomId: availableRoom._id,
      roomTypeId: roomType._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: guests || 1,
      totalPrice,
      depositPercent: DEPOSIT_PERCENT,
      depositAmount,
      remainingAmount,
      status: "awaiting_deposit",
      depositDeadline: deadline,
      note: note || "",
      hotelName: hotel?.name || "",
      roomName: roomType.name,
      roomNumber: availableRoom.roomNumber,
      guestName: guestName || req.user.fullName,
      guestPhone: guestPhone || req.user.phone || "",
      guestEmail: guestEmail || req.user.email,
    });

    await Payment.create({
      bookingId: booking._id,
      type: "deposit",
      amount: depositAmount,
      method: "cash",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: `Đặt phòng thành công. Vui lòng thanh toán cọc ${DEPOSIT_PERCENT}% trong ${DEPOSIT_HOLD_MINUTES} phút.`,
      data: { booking, depositAmount, remainingAmount, totalPrice, depositDeadline: deadline, holdMinutes: DEPOSIT_HOLD_MINUTES },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    await expireUnpaidDeposits();
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("hotelId", "name city image address")
      .populate("roomTypeId", "name");
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    await expireUnpaidDeposits();
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.hotelId) filter.hotelId = req.query.hotelId;
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email phone")
      .populate("hotelId", "name city")
      .populate("roomTypeId", "name");
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const transitions = {
      deposit_paid: ["confirmed", "cancelled", "rejected"],
      confirmed: ["checked_in", "cancelled"],
      checked_in: ["fully_paid", "checked_out"],
      fully_paid: ["checked_out"],
    };

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt phòng." });
    }

    const allowed = transitions[booking.status] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Không thể chuyển từ '${booking.status}' sang '${status}'. Cho phép: ${allowed.join(", ") || "không có"}`,
      });
    }

    if (status === "confirmed") {
      const available = await isRoomAvailable(booking.roomId, booking.checkInDate, booking.checkOutDate, booking._id);
      if (!available) {
        return res.status(400).json({ success: false, message: "Phòng đã được đặt bởi đơn khác. Không thể xác nhận." });
      }
    }
    if (status === "checked_in") {
      await Room.findByIdAndUpdate(booking.roomId, { status: "occupied" });
    }
    if (status === "checked_out") {
      await Room.findByIdAndUpdate(booking.roomId, { status: "cleaning" });
    }
    if (status === "cancelled" || status === "rejected") {
      const room = await Room.findById(booking.roomId);
      if (room && room.status === "occupied") {
        await Room.findByIdAndUpdate(booking.roomId, { status: "available" });
      }
    }

    booking.status = status;
    await booking.save();
    res.json({ success: true, message: `Cập nhật trạng thái thành '${status}' thành công.`, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    await expireUnpaidDeposits();
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "fullName email phone")
      .populate("hotelId", "name city address phone")
      .populate("roomTypeId", "name basePrice bedType view")
      .populate("roomId", "roomNumber floor");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn." });
    }
    if (req.user.role === "customer" && booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Không có quyền xem đơn này." });
    }

    const payments = await Payment.find({ bookingId: booking._id }).sort({ createdAt: 1 });
    res.json({ success: true, data: { ...booking.toObject(), payments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn." });
    }
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Không có quyền hủy đơn này." });
    }
    const cancellable = ["awaiting_deposit", "deposit_paid", "confirmed"];
    if (!cancellable.includes(booking.status)) {
      return res.status(400).json({ success: false, message: "Không thể hủy đơn ở trạng thái hiện tại." });
    }
    booking.status = "cancelled";
    await booking.save();
    res.json({ success: true, message: "Đã hủy đơn đặt phòng.", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
