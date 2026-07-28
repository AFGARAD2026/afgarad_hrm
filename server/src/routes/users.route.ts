import express from "express";
import {
  getUsersList,
  loginUser,
  registerUser,
} from "../controllers/users.controller.js";

const router = express.Router();

// Route to login a user
// POST /api/users/login
router.post("/login", loginUser);

// Route to register a user
// POST /api/users/register
router.post("/register", registerUser);

// Route to Get all users
// GET /api/users/all
router.get("/all", getUsersList);
export default router;
