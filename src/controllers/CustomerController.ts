import { Request, Response } from 'express';
import { dataService } from '../services/DataService';
import logger from '../utils/logger';

export class CustomerController {
  async getCustomer(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      if (!id || id.trim() === '') {
        res.status(400).json({ success: false, message: 'Customer ID is required' });
        return;
      }

      const customerWithOrders = await dataService.getCustomerWithOrders(id.trim());

      if (!customerWithOrders) {
        res.status(404).json({ success: false, message: `Customer with ID ${id} not found` });
        return;
      }

      res.status(200).json(customerWithOrders);
    } catch (error: any) {
      logger.error('Error fetching customer:', error);
      res.status(500).json({ success: false, message: `Error fetching customer: ${error.message}` });
    }
  }

  async getAllCustomers(req: Request, res: Response): Promise<void> {
    try {
      const { sortBySpent } = req.query;
      const shouldSort = sortBySpent === 'true';

      const customers = await dataService.getAllCustomersWithOrders(shouldSort);

      res.status(200).json({
        success: true,
        data: customers,
        count: customers.length,
      });
    } catch (error: any) {
      logger.error('Error fetching all customers:', error);
      res
        .status(500)
        .json({ success: false, message: `Error fetching customers: ${error.message}` });
    }
  }
}

export const customerController = new CustomerController();
