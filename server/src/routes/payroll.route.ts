import express from "express";
import { generatePayslip } from "../controllers/payroll.controller.js";
import { auth, authorizeRoles } from "../middlewares/middleware.js";

const router = express.Router();

// Route to generate a payslip for an employee
// POST /api/payroll/generate
router.post(
  "/generate",
  auth,
  authorizeRoles(["SUPER_ADMIN", "HR_MANAGER"]),
  generatePayslip,
);

export default router;
