import express from "express";
import {
  getReviews,
  getAllReviewsAdmin,
  createReview,
  updateReviewAdmin,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getReviews);
router.get("/admin/all", protect, authorize("admin"), getAllReviewsAdmin);
router.post("/", protect, authorize("customer"), createReview);
router.patch("/:id", protect, authorize("admin"), updateReviewAdmin);
router.delete("/:id", protect, authorize("customer", "admin"), deleteReview);

export default router;
