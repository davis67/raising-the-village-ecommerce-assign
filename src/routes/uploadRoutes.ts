import { Router, Request, Response } from "express";
import { uploadController } from "../controllers/UploadController";
import { uploadCSV } from "../middleware/uploadMiddleware";

const router = Router();

router.post(
  "/customers",
  uploadCSV.single("file"),
  (req: Request, res: Response) => uploadController.uploadCustomers(req, res)
);

router.post(
  "/orders",
  uploadCSV.single("file"),
  (req: Request, res: Response) => uploadController.uploadOrders(req, res)
);

export default router;
