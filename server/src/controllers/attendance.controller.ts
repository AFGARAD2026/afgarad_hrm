import { attendance, employees } from "../db/schema";
import { db } from "../db";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

// Controller for handling attendance-related operations
export const recordAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId, status, attendanceDate, hoursWorked } = req.body;
    const employee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, employeeId));

    if (employee.length === 0) {
      return res.status(404).json({ error: "Employee not found." });
    }
    const attendanceRecords = await db.insert(attendance).values({
      id: uuidv4(),
      employeeId,
      status,
      attendanceDate,
      hoursWorked,
    });
    res.status(201).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching attendance records." });
  }
};

// Controller for getting all attendance records
export const getAttendanceRecords = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await db.select().from(attendance));
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching attendance records." });
  }
};
