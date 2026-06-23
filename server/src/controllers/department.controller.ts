import { departments } from "../db/schema";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const newDepartment = await db
      .insert(departments)
      .values({
        id: uuidv4(),
        name,
        description,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: newDepartment,
    });
  } catch (error) {
    console.error("Error creating department:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred while creating the department.",
    });
  }
};

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const department = await db.select().from(departments);

    return res.status(200).json({
      message: "Successfully fetched Data",
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching departments." });
  }
};
