import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";
import Booking from "../models/Booking.js";

// GET /api/rooms  – tìm phòng còn trống theo ngày
export const searchRooms = async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut, guests, city } = req.query;

    // Lấy room types phù hợp
    let roomTypeFilter = { isActive: true };
    if (hotelId) roomTypeFilter.hotelId = hotelId;
    if (guests) roomTypeFilter.capacity = { $gte: Number(guests) };

    let roomTypes = await RoomType.find(roomTypeFilter).populate("hotelId", "name city address starRating image");

    // Lọc theo city nếu có
    if (city) {
      roomTypes = roomTypes.filter(
        (rt) => rt.hotelId && new RegExp(city, "i").test(rt.hotelId.city)
      );
    }

    // Nếu có ngày → loại bỏ phòng đã được book trong khoảng đó
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkOutDate <= checkInDate) {
        return res.status(400).json({
          success: false,
          message: "Ngày trả phòng phải sau ngày nhận phòng.",
        });
      }

      const busyBookings = await Booking.find({
        status: { $in: ["awaiting_deposit", "deposit_paid", "confirmed", "checked_in", "fully_paid"] },
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate },
      }).select("roomId");

      const busyRoomIds = busyBookings.map((b) => b.roomId.toString());

      // Đếm số phòng available cho mỗi roomType
      const result = [];
      for (const rt of roomTypes) {
        const allRooms = await Room.find({
          roomTypeId: rt._id,
          status: { $in: ["available", "cleaning"] },
        });
        const availableCount = allRooms.filter(
          (r) => !busyRoomIds.includes(r._id.toString())
        ).length;

        if (availableCount > 0) {
          result.push({
            ...rt.toObject(),
            availableRooms: availableCount,
          });
        }
      }

      return res.json({ success: true, count: result.length, data: result });
    }

    res.json({ success: true, count: roomTypes.length, data: roomTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/rooms/:id  – chi tiết 1 room type
export const getRoomTypeById = async (req, res) => {
  try {
    const roomType = await RoomType.findById(req.params.id).populate(
      "hotelId",
      "name city address starRating image description"
    );
    if (!roomType || !roomType.isActive) {
      return res.status(404).json({ success: false, message: "Không tìm thấy loại phòng." });
    }
    res.json({ success: true, data: roomType });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/room-types  (admin)
export const createRoomType = async (req, res) => {
  try {
    const roomType = await RoomType.create(req.body);
    res.status(201).json({ success: true, message: "Thêm loại phòng thành công.", data: roomType });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/room-types/:id  (admin)
export const updateRoomType = async (req, res) => {
  try {
    const roomType = await RoomType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!roomType) {
      return res.status(404).json({ success: false, message: "Không tìm thấy loại phòng." });
    }
    res.json({ success: true, message: "Cập nhật thành công.", data: roomType });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/room-types/:id  (admin)
export const deleteRoomType = async (req, res) => {
  try {
    await RoomType.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Đã xóa loại phòng." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/rooms  (admin) – thêm phòng vật lý
export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, message: "Thêm phòng thành công.", data: room });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/rooms/list  (admin/staff) – danh sách phòng vật lý
export const getRooms = async (req, res) => {
  try {
    const filter = {};
    if (req.query.hotelId) filter.hotelId = req.query.hotelId;
    if (req.query.status) filter.status = req.query.status;

    const rooms = await Room.find(filter)
      .populate("roomTypeId", "name basePrice capacity")
      .populate("hotelId", "name city")
      .sort({ roomNumber: 1 });

    res.json({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/rooms/:id/status  (staff/admin)
export const updateRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!room) {
      return res.status(404).json({ success: false, message: "Không tìm thấy phòng." });
    }
    res.json({ success: true, message: "Cập nhật trạng thái phòng thành công.", data: room });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
