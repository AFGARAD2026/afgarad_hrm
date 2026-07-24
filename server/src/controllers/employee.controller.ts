import { employees } from "../db/schema";
import { db } from "../db";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const data = await db.select().from(employees);
    return res.status(200).json({
      success: true,
      message: "Successfully fetched employees",
      data,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching employees.",
    });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, id));

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully fetched employee",
      data: employee,
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the employee.",
    });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const {
      name,
      departmentId,
      email,
      joinDate,
      baseSalary,
      role,
      status = "ACTIVE",
    } = req.body;

    if (!name || !departmentId || !email || !joinDate || !baseSalary || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required employee fields.",
      });
    }

    const [newEmployee] = await db
      .insert(employees)
      .values({
        id: uuidv4(),
        name,
        departmentId,
        email,
        joinDate,
        baseSalary: String(baseSalary),
        role,
        status,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: newEmployee,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the employee.",
    });
  }
};
