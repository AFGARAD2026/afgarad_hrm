import { employees } from "../db/schema";
import { db } from "../db";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const data = await db.select().from(employees);
    return res.status(200).json({
      message: "Successfully Fetched Employees",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching employees." });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, departmentId, email, joinDate, baseSalary, role } = req.body;
    const newEmployee = await db.insert(employees).values({
      id: uuidv4(),
      name,
      departmentId,
      email,
      joinDate,
      baseSalary,
      role,
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the employee." });
  }
};
