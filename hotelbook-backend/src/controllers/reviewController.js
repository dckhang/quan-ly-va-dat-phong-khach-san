import mongoose from "mongoose";
import Review from "../models/Review.js";
import Hotel from "../models/Hotel.js";
import RoomType from "../models/RoomType.js";

// GET /api/reviews?hotelId= | roomTypeId= | featured=true
export const getReviews = async (req, res) => {
  try {
    const { hotelId, roomTypeId, featured } = req.query;

    // Đánh giá nổi bật trang chủ: rating >= 4, isFeatured, không ẩn
    if (featured === "true" || featured === "1") {
      const reviews = await Review.find({
        isFeatured: true,
        isHidden: false,
        rating: { $gte: 4 },
        target: "hotel",
      })
        .populate("userId", "fullName")
        .populate("hotelId", "name city image")
        .sort({ createdAt: -1 })
        .limit(12);

      return res.json({ success: true, data: reviews, count: reviews.length });
    }

    const filter = { isHidden: false };
    if (hotelId) {
      filter.hotelId = hotelId;
      filter.target = "hotel";
    } else if (roomTypeId) {
      filter.roomTypeId = roomTypeId;
      filter.target = "roomType";
    } else {
      return res.status(400).json({ success: false, message: "Cần hotelId, roomTypeId hoặc featured=true." });
    }

    const reviews = await Review.find(filter)
      .populate("userId", "fullName")
      .sort({ createdAt: -1 })
      .limit(50);

    const match = { isHidden: false };
    if (hotelId) {
      match.hotelId = new mongoose.Types.ObjectId(hotelId);
      match.target = "hotel";
    } else {
      match.roomTypeId = new mongoose.Types.ObjectId(roomTypeId);
      match.target = "roomType";
    }

    const agg = await Review.aggregate([
      { $match: match },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    const avgRating = agg[0] ? Math.round(agg[0].avgRating * 10) / 10 : 0;
    const count = agg[0]?.count || 0;

    res.json({ success: true, data: reviews, stats: { avgRating, count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reviews/admin/all  (admin)
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const filter = {};
    if (req.query.target) filter.target = req.query.target;
    if (req.query.featured === "true") filter.isFeatured = true;
    if (req.query.hidden === "true") filter.isHidden = true;
    if (req.query.hidden === "false") filter.isHidden = false;

    const reviews = await Review.find(filter)
      .populate("userId", "fullName email")
      .populate("hotelId", "name city")
      .populate("roomTypeId", "name")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/reviews  (customer, logged in)
export const createReview = async (req, res) => {
  try {
    const { hotelId, roomTypeId, rating, comment, bookingId } = req.body;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Điểm đánh giá phải từ 1 đến 5 sao." });
    }

    if (hotelId) {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) return res.status(404).json({ success: false, message: "Không tìm thấy chi nhánh." });

      const exists = await Review.findOne({ userId, hotelId, target: "hotel" });
      if (exists) {
        return res.status(400).json({ success: false, message: "Bạn đã đánh giá chi nhánh này rồi." });
      }

      const review = await Review.create({
        userId,
        hotelId,
        bookingId: bookingId || undefined,
        target: "hotel",
        rating: Number(rating),
        comment: (comment || "").trim(),
        isFeatured: false,
        isHidden: false,
      });

      const populated = await Review.findById(review._id).populate("userId", "fullName");
      return res.status(201).json({ success: true, message: "Cảm ơn bạn đã đánh giá chi nhánh!", data: populated });
    }

    if (roomTypeId) {
      const rt = await RoomType.findById(roomTypeId);
      if (!rt) return res.status(404).json({ success: false, message: "Không tìm thấy loại phòng." });

      const exists = await Review.findOne({ userId, roomTypeId, target: "roomType" });
      if (exists) {
        return res.status(400).json({ success: false, message: "Bạn đã đánh giá loại phòng này rồi." });
      }

      const review = await Review.create({
        userId,
        roomTypeId,
        hotelId: rt.hotelId,
        bookingId: bookingId || undefined,
        target: "roomType",
        rating: Number(rating),
        comment: (comment || "").trim(),
        isFeatured: false,
        isHidden: false,
      });

      const populated = await Review.findById(review._id).populate("userId", "fullName");
      return res.status(201).json({ success: true, message: "Cảm ơn bạn đã đánh giá phòng!", data: populated });
    }

    return res.status(400).json({ success: false, message: "Cần hotelId hoặc roomTypeId." });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Bạn đã đánh giá rồi." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/reviews/:id  (admin) — featured / hidden
export const updateReviewAdmin = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Không tìm thấy đánh giá." });

    if (typeof req.body.isFeatured === "boolean") {
      // Chỉ đưa lên trang chủ nếu rating >= 4 và có comment
      if (req.body.isFeatured === true && review.rating < 4) {
        return res.status(400).json({
          success: false,
          message: "Chỉ đánh giá từ 4 sao trở lên mới đưa lên trang chủ.",
        });
      }
      review.isFeatured = req.body.isFeatured;
    }
    if (typeof req.body.isHidden === "boolean") {
      review.isHidden = req.body.isHidden;
      if (req.body.isHidden) review.isFeatured = false; // ẩn thì bỏ featured
    }

    await review.save();
    const populated = await Review.findById(review._id)
      .populate("userId", "fullName email")
      .populate("hotelId", "name city");

    res.json({ success: true, message: "Đã cập nhật đánh giá.", data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Không tìm thấy đánh giá." });

    const isOwner = review.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Không có quyền xóa." });
    }

    await review.deleteOne();
    res.json({ success: true, message: "Đã xóa đánh giá." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
