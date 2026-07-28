import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { auth } from "../middlewares/middleware.js";
import { uploadFile } from "../controllers/upload.controller.js";

const router = express.Router();

// Ensure upload directory exists
const uploadsDir = path.join(process.cwd(), "public", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (
    _req: any,
    _file: any,
    cb: (arg0: null, arg1: string) => void,
  ) {
    cb(null, uploadsDir);
  },
  filename: function (
    _req: any,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => void,
  ) {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

// POST /api/uploads - expects form field `file`
router.post("/", auth, upload.single("file"), uploadFile);

export default router;
