import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
} from "../controllers/employee.controller.js";

const router = express.Router();

// Route to get all employees
// GET /api/employees
router.get("/", getAllEmployees);

// Route to get a single employee
// GET /api/employees/:id
router.get("/:id", getEmployeeById);

// Route to create a new employee
// POST /api/employees/create
router.post("/create", createEmployee);

export default router;
