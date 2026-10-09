import express from "express";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", protect, authorize("admin"), createArticle);
router.put("/:id", protect, authorize("admin"), updateArticle);
router.delete("/:id", protect, authorize("admin"), deleteArticle);

export default router;
