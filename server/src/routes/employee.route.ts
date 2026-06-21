import express from "express";
import {
  createEmployee,
  getAllEmployees,
} from "../controllers/employee.controller";

const router = express.Router();

// Route to get all employees
// GET /api/employees
router.get("/", getAllEmployees);

// Route to create a new employee
// POST /api/employees
router.post("/create", createEmployee);

export default router;
