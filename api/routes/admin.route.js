import express from "express";

 // Middleware to ensure only admins can access these routes
import { fetchAllPosts, fetchAllUsers, toggleBlockUser, updatePostStatus } from "../controller/admin.controller.js";
import { deletePost } from "../controller/post.controller.js";
import { verifyAdmin } from "../middleware/verifyadmin.js";

const router = express.Router();

// Protect all admin routes with verifyAdmin middleware


// Post management routes
router.get("/posts",verifyAdmin, fetchAllPosts);
router.patch("/posts/:id/status",verifyAdmin, updatePostStatus);
router.delete("/posts/:id", verifyAdmin,deletePost);

// User management routes
router.get("/users", verifyAdmin,fetchAllUsers);
router.patch("/users/:id/block",verifyAdmin, toggleBlockUser);

export default router;