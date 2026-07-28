import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
} from "../controllers/employee.controller.js";
import { auth, authorizeRoles } from "../middlewares/middleware.js";
const router = express.Router();

// Route to get all employees
// GET /api/employees
router.get("/", auth, getAllEmployees);

// Route to get a single employee
// GET /api/employees/:id
router.get("/:id", auth, getEmployeeById);

// Route to create a new employee
// POST /api/employees/create
router.post("/create", auth, authorizeRoles(["SUPER_ADMIN"]), createEmployee);

export default router;
