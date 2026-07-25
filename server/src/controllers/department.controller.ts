import { departments } from "../db/schema";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Department name is required.",
      });
    }

    const [newDepartment] = await db
      .insert(departments)
      .values({
        id: uuidv4(),
        name,
        description,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: newDepartment,
    });
  } catch (error) {
    console.error("Error creating department:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the department.",
    });
  }
};

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const department = await db.select().from(departments);

    return res.status(200).json({
      message: "Successfully fetched departments",
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching departments.",
    });
  }
};

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [department] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, id as string));

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully fetched department",
      data: department,
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the department.",
    });
  }
};
