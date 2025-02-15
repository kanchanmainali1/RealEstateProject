import express from "express";
import { adminLogin, adminLogout, registerAdmin } from "../controller/adminauth.controller.js";

const router = express.Router();

// Admin registration
router.post("/register", registerAdmin);

// Admin login
router.post("/login", adminLogin);

// Logout
router.post("/logout", adminLogout);


export default router;