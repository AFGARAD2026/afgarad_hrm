import { payslips, employees } from "../db/schema";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";

export const generatePayslip = async (req: Request, res: Response) => {
  try {
    const { employeeId, baseSalary, overtimeAmount, payrollMonth, deductions } =
      req.body;

    const employee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, employeeId))
      .limit(1);

    if (!employee || employee.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const newPayroll = await db.insert(payslips).values({
      id: uuidv4(),
      employeeId: employee[0].id,
      baseSalary: String(baseSalary),
      overtimeAmount: String(overtimeAmount),
      payrollMonth,
      deductions: String(deductions),
      netSalary: String(
        Number(baseSalary) + Number(overtimeAmount) - Number(deductions),
      ),
    });

    return res.status(201).json(newPayroll);
  } catch (error) {
    console.error("Error generating payslip:", error);
    res.status(500).json({ error: "Failed to generate payslip" });
  }
};
