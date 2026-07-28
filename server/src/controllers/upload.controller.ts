import { Request, Response } from "express";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    // multer puts file info on req.file
    const file = (req as any).file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file provided" });
    }

    // Build accessible URL for the uploaded file
    const host = req.get("host");
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${file.filename}`;

    return res
      .status(201)
      .json({ success: true, data: { url: fileUrl, filename: file.filename } });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to upload file" });
  }
};

export default { uploadFile };
