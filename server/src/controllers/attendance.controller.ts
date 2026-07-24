import { attendance, employees } from "../db/schema";
import { db } from "../db";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

// Controller for handling attendance-related operations
export const recordAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId, status, attendanceDate, hoursWorked } = req.body;
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, employeeId));

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found." });
    }

    const [attendanceRecord] = await db
      .insert(attendance)
      .values({
        id: uuidv4(),
        employeeId,
        status,
        attendanceDate,
        hoursWorked: String(hoursWorked ?? 0),
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Attendance recorded successfully",
      data: attendanceRecord,
    });
  } catch (error) {
    console.error("Error recording attendance:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while recording attendance.",
    });
  }
};

// Controller for getting attendance records
export const getAttendanceRecords = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const records = employeeId
      ? await db
          .select()
          .from(attendance)
          .where(eq(attendance.employeeId, employeeId))
      : await db.select().from(attendance);

    return res.status(200).json({
      success: true,
      message: "Successfully fetched attendance records",
      data: records,
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching attendance records.",
    });
  }
};
