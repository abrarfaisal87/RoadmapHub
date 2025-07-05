import express from "express";
import {
  getAllRoadmapItems,
  getFilter,
  getSingleRoadmap,
  toggleUpvoteRoadmapItem,
} from "../controllers/roadmapController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

//this endpoint will return all cases including the status and category
router.get("/", getAllRoadmapItems); // GET /api/roadmap

//distinct routes for different categories and status

router.get("/filters", getFilter);

//get single roadmap
router.get("/:id", getSingleRoadmap);

//upvote a roadmap item or remove upvote
router.post("/:id/upvote", requireAuth, toggleUpvoteRoadmapItem);

export default router;
