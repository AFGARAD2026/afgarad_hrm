import { users } from "../db/schema.js";
import { db } from "../db/index.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { USER_ROLES } from "../utils/user.role.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      fullName,
      email,
      password: hashedPassword,
      role: USER_ROLES.HR_MANAGER,
    };

    const createdUser = await db
      .insert(users)
      .values({
        id: uuidv4(),
        fullName: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      })
      .returning();
    res.status(201).json(createdUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      message: "Login successful",
      data: [user],
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while logging in the user." });
  }
};
