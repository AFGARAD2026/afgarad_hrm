import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
} from "../controllers/department.controller.js";
import { auth, authorizeRoles } from "../middlewares/middleware.js";
const router = express.Router();

// Route to get all departments
// GET /api/departments
router.get("/", auth, getAllDepartments);

// Route to get a single department
// GET /api/departments/:id
router.get("/:id", auth, getDepartmentById);

// Route to create a new department
// POST /api/departments/create
router.post(
  "/create",
  auth,
  authorizeRoles(["SUPER_ADMIN", "HR_MANAGER"]),
  createDepartment,
);

export default router;
