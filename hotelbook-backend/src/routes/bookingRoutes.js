import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  getBookingById,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, authorize("customer"), createBooking);
router.get("/my", protect, authorize("customer"), getMyBookings);
router.get("/", protect, authorize("staff", "admin"), getAllBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/status", protect, authorize("staff", "admin"), updateBookingStatus);
router.post("/:id/cancel", protect, authorize("customer"), cancelBooking);

export default router;
