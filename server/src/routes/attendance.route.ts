import express from "express";
import {
  recordAttendance,
  getAttendanceRecords,
} from "../controllers/attendance.controller.js";
import { auth, authorizeRoles } from "../middlewares/middleware.js";
const router = express.Router();

// Route to record attendance for an employee
// POST /api/attendance/record
router.post(
  "/record",
  authorizeRoles(["ADMIN", "HR_MANAGER"]),
  auth,
  recordAttendance,
);

// Route to get all attendance records or records for an employee
// GET /api/attendance
// GET /api/attendance/:employeeId
router.get(
  "/",
  auth,
  authorizeRoles(["ADMIN", "HR_MANAGER"]),
  getAttendanceRecords,
);
router.get(
  "/:employeeId",
  auth,
  authorizeRoles(["ADMIN"]),
  getAttendanceRecords,
);

export default router;
