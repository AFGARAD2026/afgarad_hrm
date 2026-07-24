import express from "express";
import { createServer } from "http";
import BodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Importing routes
import { routes } from "./routes";

const app = express();
app.use(BodyParser.json());
app.use(cors());
app.use(BodyParser.urlencoded({ extended: true }));

// Mounting routes
app.use("/api/departments", routes.departmentRoutes);
app.use("/api/employees", routes.employeeRoutes);
app.use("/api/payroll", routes.payrollRoutes);
app.use("/api/users", routes.userRoutes);
app.use("/api/attendance", routes.attendanceRoutes);

const server = createServer(app);
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
