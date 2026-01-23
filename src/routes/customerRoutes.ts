import { Router } from "express";
import { customerController } from "../controllers/CustomerController";

const router = Router();

// Get all customers with orders
router.get("/customer-orders", (req: any, res: any) =>
  customerController.getAllCustomers(req, res)
);

// Get single customer with orders
router.get("/customer-orders/:id", (req: any, res: any) =>
  customerController.getCustomer(req, res)
);

export default router;
