import { Request, Response } from "express";
import type {} from "../types/express";
import { dataService } from "../services/DataService";
import logger from "../utils/logger";
import { parseCustomersCSV, parseOrdersCSV } from "../utils/csvParser";
class UploadController {
  async uploadCustomers(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: "No file provided" });
        return;
      }
      logger.info(`Processing customers CSV upload: ${req.file.originalname}`);

      const { records, validationErrors } = await parseCustomersCSV(
        req.file.buffer
      );
      if (records.length === 0) {
        res.status(400).json({
          success: false,
          message: "No valid customer records found",
          errors: validationErrors.map(
            (err) =>
              `Row ${err.rowIndex}: ${err.errors.map((e) => e.message).join(",")}`
          ),
        });
        return;
      }

      const { imported, duplicates, errors } =
        await dataService.importCustomers(records);

      const failedCount = validationErrors.length + duplicates + errors.length;
      const errorMessages = [
        ...validationErrors.map(
          (err) =>
            `Row ${err.rowIndex}: ${err.errors.map((e) => e.message).join(",")}`
        ),
        ...errors,
      ];

      res.status(200).json({
        success: true,
        message: `Successfully imported ${imported} customers`,
        recordsProcessed: imported,
        recordsFailed: failedCount,
        duplicates: duplicates > 0 ? duplicates : undefined,
        errors: errorMessages.length > 0 ? errorMessages : undefined,
      });
    } catch (error: any) {
      logger.error("Error uploading customers:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async uploadOrders(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: "No file provided" });
        return;
      }
      logger.info(`Processing orders CSV upload: ${req.file.originalname}`);

      const { records, validationErrors } = await parseOrdersCSV(
        req.file.buffer
      );
      if (records.length === 0) {
        res.status(400).json({
          success: false,
          message: "No valid order records found",
          errors: validationErrors.map(
            (err) =>
              `Row ${err.rowIndex}: ${err.errors.map((e) => e.message).join(",")}`
          ),
        });
        return;
      }

      const { imported, duplicates, errors } =
        await dataService.importOrders(records);

      const failedCount = validationErrors.length + duplicates + errors.length;
      const errorMessages = [
        ...validationErrors.map(
          (err) =>
            `Row ${err.rowIndex}: ${err.errors.map((e) => e.message).join(",")}`
        ),
        ...errors,
      ];

      res.status(200).json({
        success: true,
        message: `Successfully imported ${imported} orders`,
        recordsProcessed: imported,
        recordsFailed: failedCount,
        duplicates: duplicates > 0 ? duplicates : undefined,
        errors: errorMessages.length > 0 ? errorMessages : undefined,
      });
    } catch (error: any) {
      logger.error("Error uploading orders:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export const uploadController = new UploadController();
