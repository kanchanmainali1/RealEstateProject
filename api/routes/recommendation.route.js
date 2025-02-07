// api/routes/recommendation.route.js

import express from "express";
import { getSimilarListings } from "../controller/recommendation.controller.js";
import { verifyToken } from "../middleware/verifytoken.js";

const router = express.Router();

// Route to get similar listings based on the current post
router.get("/:postId", verifyToken, getSimilarListings); // Add authentication

export default router;
