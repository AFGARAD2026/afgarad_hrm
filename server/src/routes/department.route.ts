import express from "express";
import {
  createDepartment,
  getAllDepartments,
} from "../controllers/department.controller";

const router = express.Router();

// Route to get all departments
// GET /api/departments
router.get("/", getAllDepartments);

// Route to create a new department
// POST /api/departments/create
router.post("/create", createDepartment);

export default router;
