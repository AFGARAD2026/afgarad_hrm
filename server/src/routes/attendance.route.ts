import express from "express";
import {
  recordAttendance,
  getAttendanceRecords,
} from "../controllers/attendance.controller";

const router = express.Router();

// Route to record attendance for an employee
// POST /api/attendance/record
router.post("/record", recordAttendance);

// Route to get attendance records for an employee
// GET /api/attendance/records/:employeeId
router.get("/records/:employeeId", getAttendanceRecords);

export default router;
