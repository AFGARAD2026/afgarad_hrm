import express from "express";
import { generatePayslip } from "../controllers/payroll.controller";

const router = express.Router();

// Route to generate a payslip for an employee
// POST /api/payroll/generate
router.post("/generate", generatePayslip);

export default router;
