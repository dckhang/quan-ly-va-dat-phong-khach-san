import express from "express";
import {
  searchRooms,
  getRoomTypeById,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  createRoom,
  getRooms,
  updateRoomStatus,
} from "../controllers/roomController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public
router.get("/search", searchRooms);
router.get("/types/:id", getRoomTypeById);

// Admin – room types
router.post("/types", protect, authorize("admin"), createRoomType);
router.put("/types/:id", protect, authorize("admin"), updateRoomType);
router.delete("/types/:id", protect, authorize("admin"), deleteRoomType);

// Admin/Staff – physical rooms
router.get("/", protect, authorize("admin", "staff"), getRooms);
router.post("/", protect, authorize("admin"), createRoom);
router.put("/:id/status", protect, authorize("admin", "staff"), updateRoomStatus);

export default router;
