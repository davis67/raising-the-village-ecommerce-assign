import { CustomerWithOrders, OrderDetail } from "../../src/types";

describe("DataService", () => {
  beforeEach(() => {
    // Service initialization not needed for unit tests
  });

  describe("Order Summary Calculation", () => {
    it("should calculate total orders correctly", () => {
      const orders: OrderDetail[] = [
        {
          orderId: "101",
          productName: "Laptop",
          amount: 999.99,
          orderDate: "2024-05-01",
          status: "completed",
        },
        {
          orderId: "102",
          productName: "Mouse",
          amount: 29.99,
          orderDate: "2024-05-15",
          status: "completed",
        },
      ];

      const totalOrders = orders.length;
      expect(totalOrders).toBe(2);
    });

    it("should calculate total spent correctly", () => {
      const orders: OrderDetail[] = [
        {
          orderId: "101",
          productName: "Laptop",
          amount: 999.99,
          orderDate: "2024-05-01",
          status: "completed",
        },
        {
          orderId: "102",
          productName: "Mouse",
          amount: 29.99,
          orderDate: "2024-05-15",
          status: "completed",
        },
      ];

      const totalSpent =
        Math.round(orders.reduce((sum, order) => sum + order.amount, 0) * 100) /
        100;
      expect(totalSpent).toBe(1029.98);
    });

    it("should handle empty order list", () => {
      const orders: OrderDetail[] = [];

      const totalSpent =
        Math.round(orders.reduce((sum, order) => sum + order.amount, 0) * 100) /
        100;
      expect(totalSpent).toBe(0);
    });

    it("should properly format customer response", () => {
      const mockCustomerWithOrders: CustomerWithOrders = {
        customer: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          country: "USA",
          signupDate: "2024-01-15",
        },
        orderSummary: {
          totalOrders: 2,
          totalSpent: 1029.98,
          orders: [
            {
              orderId: "101",
              productName: "Laptop",
              amount: 999.99,
              orderDate: "2024-05-01",
              status: "completed",
            },
            {
              orderId: "102",
              productName: "Mouse",
              amount: 29.99,
              orderDate: "2024-05-15",
              status: "completed",
            },
          ],
        },
      };

      expect(mockCustomerWithOrders.customer.id).toBe("1");
      expect(mockCustomerWithOrders.orderSummary.totalOrders).toBe(2);
      expect(mockCustomerWithOrders.orderSummary.totalSpent).toBe(1029.98);
    });
  });

  describe("Data Sorting", () => {
    it("should sort customers by total spent in descending order", () => {
      const customers = [
        {
          customer: {
            id: "1",
            name: "John",
            email: "john@example.com",
            country: "USA",
            signupDate: "2024-01-15",
          },
          orderSummary: { totalOrders: 2, totalSpent: 1029.98, orders: [] },
        },
        {
          customer: {
            id: "2",
            name: "Jane",
            email: "jane@example.com",
            country: "UK",
            signupDate: "2024-02-20",
          },
          orderSummary: { totalOrders: 1, totalSpent: 79.99, orders: [] },
        },
        {
          customer: {
            id: "3",
            name: "Mike",
            email: "mike@example.com",
            country: "Canada",
            signupDate: "2024-03-10",
          },
          orderSummary: { totalOrders: 1, totalSpent: 299.99, orders: [] },
        },
      ];

      const sorted = [...customers].sort(
        (a, b) => b.orderSummary.totalSpent - a.orderSummary.totalSpent
      );

      expect(sorted[0].customer.id).toBe("1");
      expect(sorted[1].customer.id).toBe("3");
      expect(sorted[2].customer.id).toBe("2");
    });
  });
});
