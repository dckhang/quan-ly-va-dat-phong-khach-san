import Hotel from "../models/Hotel.js";
import RoomType from "../models/RoomType.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

// Helper: đếm phòng còn trống của 1 hotel (hoặc roomType)
async function countAvailableRooms(hotelId, roomTypeId = null, checkIn = null, checkOut = null) {
  const roomFilter = {
    hotelId,
    status: { $in: ["available", "cleaning"] },
  };
  if (roomTypeId) roomFilter.roomTypeId = roomTypeId;

  const rooms = await Room.find(roomFilter).select("_id");
  if (!rooms.length) return 0;

  // Nếu không có ngày → đếm theo status phòng
  if (!checkIn || !checkOut) {
    return rooms.length;
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const busy = await Booking.find({
    roomId: { $in: rooms.map((r) => r._id) },
    status: { $in: ["awaiting_deposit", "deposit_paid", "confirmed", "checked_in", "fully_paid"] },
    checkInDate: { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate },
  }).select("roomId");

  const busyIds = new Set(busy.map((b) => b.roomId.toString()));
  return rooms.filter((r) => !busyIds.has(r._id.toString())).length;
}

// GET /api/hotels
export const getHotels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, stars, keyword, checkIn, checkOut } = req.query;
    const filter = { isActive: true };

    if (city) filter.city = new RegExp(city, "i");
    if (stars) filter.starRating = { $gte: Number(stars) };
    if (keyword) {
      filter.$or = [
        { name: new RegExp(keyword, "i") },
        { city: new RegExp(keyword, "i") },
        { address: new RegExp(keyword, "i") },
      ];
    }

    let hotels = await Hotel.find(filter).sort({ starRating: -1, createdAt: -1 });

    // Gắn giá từ + số phòng trống
    const roomTypes = await RoomType.find({ isActive: true }).select("hotelId basePrice");
    const priceMap = {};
    roomTypes.forEach((rt) => {
      const id = rt.hotelId.toString();
      if (!priceMap[id] || rt.basePrice < priceMap[id]) {
        priceMap[id] = rt.basePrice;
      }
    });

    const result = [];
    for (const h of hotels) {
      const priceFrom = priceMap[h._id.toString()] ?? 0;
      if (minPrice && priceFrom < Number(minPrice)) continue;
      if (maxPrice && priceFrom > Number(maxPrice)) continue;

      const availableRooms = await countAvailableRooms(h._id, null, checkIn, checkOut);
      const totalRooms = await Room.countDocuments({ hotelId: h._id });

      result.push({
        ...h.toObject(),
        priceFrom,
        availableRooms,
        totalRooms,
      });
    }

    res.json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/hotels/:id
export const getHotelById = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel || !hotel.isActive) {
      return res.status(404).json({ success: false, message: "Không tìm thấy khách sạn." });
    }

    const roomTypes = await RoomType.find({ hotelId: hotel._id, isActive: true });

    const roomTypesWithAvail = [];
    for (const rt of roomTypes) {
      const availableRooms = await countAvailableRooms(hotel._id, rt._id, checkIn, checkOut);
      const totalRooms = await Room.countDocuments({ roomTypeId: rt._id });
      roomTypesWithAvail.push({
        ...rt.toObject(),
        availableRooms,
        totalRooms,
      });
    }

    const hotelAvailable = await countAvailableRooms(hotel._id, null, checkIn, checkOut);
    const hotelTotal = await Room.countDocuments({ hotelId: hotel._id });

    res.json({
      success: true,
      data: {
        ...hotel.toObject(),
        availableRooms: hotelAvailable,
        totalRooms: hotelTotal,
        roomTypes: roomTypesWithAvail,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/hotels  (admin)
export const createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, message: "Thêm khách sạn thành công.", data: hotel });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/hotels/:id  (admin)
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Không tìm thấy khách sạn." });
    }
    res.json({ success: true, message: "Cập nhật thành công.", data: hotel });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/hotels/:id  (admin – soft delete)
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Không tìm thấy khách sạn." });
    }
    res.json({ success: true, message: "Đã xóa khách sạn." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
