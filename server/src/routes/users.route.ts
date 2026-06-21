import express from "express";
import { loginUser, registerUser } from "../controllers/users.controller";

const router = express.Router();

// Route to login a user
// POST /api/users/login
router.post("/login", loginUser);

// Route to register a user
// POST /api/users/register
router.post("/register", registerUser);

export default router;
