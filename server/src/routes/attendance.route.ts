import express from "express";
import {
  recordAttendance,
  getAttendanceRecords,
} from "../controllers/attendance.controller.js";

const router = express.Router();

// Route to record attendance for an employee
// POST /api/attendance/record
router.post("/record", recordAttendance);

// Route to get all attendance records or records for an employee
// GET /api/attendance
// GET /api/attendance/:employeeId
router.get("/", getAttendanceRecords);
router.get("/:employeeId", getAttendanceRecords);

export default router;
