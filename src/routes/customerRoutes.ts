import { Router } from 'express';
import { customerController } from '../controllers/CustomerController';

const router = Router();

// Get single customer with orders
router.get('/:id', (req: any, res: any) => customerController.getCustomer(req, res));

// Get all customers with orders
router.get('/', (req: any, res: any) => customerController.getAllCustomers(req, res));

export default router;
