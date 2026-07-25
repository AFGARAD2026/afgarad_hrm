import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
} from "../controllers/department.controller.js";

const router = express.Router();

// Route to get all departments
// GET /api/departments
router.get("/", getAllDepartments);

// Route to get a single department
// GET /api/departments/:id
router.get("/:id", getDepartmentById);

// Route to create a new department
// POST /api/departments/create
router.post("/create", createDepartment);

export default router;
