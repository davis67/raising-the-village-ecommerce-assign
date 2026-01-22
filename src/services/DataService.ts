import { Customer } from "../models/Customer";
import { Order } from "../models/Order";
import {
  CustomerWithOrders,
  CustomersAggregated,
  OrderDetail,
  OrderSummary,
} from "../types";
import logger from "../utils/logger";

export class DataService {
  async importCustomers(
    customers: any[]
  ): Promise<{ imported: number; duplicates: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;
    let duplicates = 0;

    for (const customer of customers) {
      try {
        const existing = await Customer.findOne({
          customerId: customer.customerId,
        });
        if (existing) {
          duplicates++;
          logger.warn(
            `Customer with ID ${customer.customerId} already exists, skipping`
          );
        } else {
          await Customer.create(customer);
          imported++;
        }
      } catch (error: any) {
        const errorMsg = `Failed to import customer ${customer.customerId}: ${error.message}`;
        errors.push(errorMsg);
        logger.error(errorMsg);
      }
    }

    return { imported, duplicates, errors };
  }

  async importOrders(
    orders: any[]
  ): Promise<{ imported: number; duplicates: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;
    let duplicates = 0;

    for (const order of orders) {
      try {
        const existing = await Order.findOne({ orderId: order.orderId });
        if (existing) {
          duplicates++;
          logger.warn(
            `Order with ID ${order.orderId} already exists, skipping`
          );
        } else {
          await Order.create(order);
          imported++;
        }
      } catch (error: any) {
        const errorMsg = `Failed to import order ${order.orderId}: ${error.message}`;
        errors.push(errorMsg);
        logger.error(errorMsg);
      }
    }

    return { imported, duplicates, errors };
  }

  async getCustomerWithOrders(
    customerId: string
  ): Promise<CustomerWithOrders | null> {
    try {
      const customer = await Customer.findOne({ customerId });
      if (!customer) {
        return null;
      }

      const orders = await Order.find({ customerId }).sort({ orderDate: -1 });

      const orderDetails: OrderDetail[] = orders.map((order) => ({
        orderId: order.orderId,
        productName: order.productName,
        amount: order.amount,
        orderDate: order.orderDate,
        status: order.status,
      }));

      const totalSpent = orderDetails.reduce(
        (sum, order) => sum + order.amount,
        0
      );

      const orderSummary: OrderSummary = {
        totalOrders: orderDetails.length,
        totalSpent: Math.round(totalSpent * 100) / 100,
        orders: orderDetails,
      };

      return {
        customer: {
          id: customer.customerId,
          name: customer.name,
          email: customer.email,
          country: customer.country,
          signupDate: customer.signupDate,
        },
        orderSummary,
      };
    } catch (error: any) {
      logger.error(`Error fetching customer ${customerId}:`, error);
      throw error;
    }
  }

  async getAllCustomersWithOrders(
    sortBySpent: boolean = false
  ): Promise<CustomersAggregated[]> {
    try {
      const customers = await Customer.find().sort({ createdAt: -1 });

      const customersWithOrders: CustomersAggregated[] = [];

      for (const customer of customers) {
        const orders = await Order.find({
          customerId: customer.customerId,
        }).sort({
          orderDate: -1,
        });

        const orderDetails: OrderDetail[] = orders.map((order) => ({
          orderId: order.orderId,
          productName: order.productName,
          amount: order.amount,
          orderDate: order.orderDate,
          status: order.status,
        }));

        const totalSpent = orderDetails.reduce(
          (sum, order) => sum + order.amount,
          0
        );

        const orderSummary: OrderSummary = {
          totalOrders: orderDetails.length,
          totalSpent: Math.round(totalSpent * 100) / 100,
          orders: orderDetails,
        };

        customersWithOrders.push({
          customer: {
            id: customer.customerId,
            name: customer.name,
            email: customer.email,
            country: customer.country,
            signupDate: customer.signupDate,
          },
          orderSummary,
        });
      }

      if (sortBySpent) {
        customersWithOrders.sort(
          (a, b) => b.orderSummary.totalSpent - a.orderSummary.totalSpent
        );
      }

      return customersWithOrders;
    } catch (error: any) {
      logger.error("Error fetching all customers:", error);
      throw error;
    }
  }
}

export const dataService = new DataService();
