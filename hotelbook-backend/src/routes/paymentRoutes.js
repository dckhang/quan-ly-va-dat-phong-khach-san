import express from "express";
import {
  getPaymentByBooking,
  processPayment,
  payDeposit,
  payRemaining,
  refundPayment,
  getAllPayments,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.post("/:bookingId/pay", protect, authorize("customer"), processPayment);
router.post("/:bookingId/pay-deposit", protect, authorize("customer"), payDeposit);
router.post("/:bookingId/pay-remaining", protect, authorize("customer", "staff", "admin"), payRemaining);
router.get("/booking/:bookingId", protect, getPaymentByBooking);
router.get("/", protect, authorize("admin", "staff"), getAllPayments);
router.put("/:id/refund", protect, authorize("admin", "staff"), refundPayment);

export default router;
