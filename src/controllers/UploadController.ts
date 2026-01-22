import { Request, Response } from "express";
import logger from "../utils/logger";
import { parseCustomersCSV } from "../utils/csvParser";
class UploadController {
  async uploadCustomers(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: "No file provided" });
      }
      logger.info(`Processing customers CSV upload: ${req.file.originalname}`);

      const { records, validationErrors } = await parseCustomersCSV(
        req.file.buffer
      );
      if (records.length == 0) {
        return res.status(400).json({
          success: false,
          message: "No records",
          errors: validationErrors.map(
            (err) =>
              `Row ${err.rowIndex}: ${err.errors.map((e) => e.message).join(",")}`
          ),
        });
      }
      //save the data into the database
    } catch (error: any) {
      logger.info("Error uploading customers:", error);
      res.status(400).json({ success: false, message: "No file provided" });
    }
  }
}

export const uploadController = new UploadController();
