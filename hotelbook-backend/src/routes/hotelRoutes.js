import express from "express";
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from "../controllers/hotelController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);

router.post("/", protect, authorize("admin"), createHotel);
router.put("/:id", protect, authorize("admin"), updateHotel);
router.delete("/:id", protect, authorize("admin"), deleteHotel);

export default router;
