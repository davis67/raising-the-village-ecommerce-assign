import {
  validateEmail,
  validateCustomerData,
  validateOrderData,
  isValidDate,
} from "../../src/utils/validators";

describe("Validators", () => {
  describe("validateEmail", () => {
    it("should validate correct email format", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("john.doe@example.co.uk")).toBe(true);
    });

    it("should validate emails with uppercase characters", () => {
      expect(validateEmail("TEST@EXAMPLE.COM")).toBe(true);
      expect(validateEmail("John.Doe@Example.Co.Uk")).toBe(true);
    });

    it("should reject invalid email format", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
    });

    it("should reject emails that do not match supported regex constraints", () => {
      // consecutive dots in local-part
      expect(validateEmail("john..doe@example.com")).toBe(false);
      // plus sign is not supported by current regex
      expect(validateEmail("john+test@example.com")).toBe(false);
      // TLD longer than 3 characters is not supported by current regex
      expect(validateEmail("john@example.info")).toBe(false);
      // missing TLD
      expect(validateEmail("john@example")).toBe(false);
    });
  });

  describe("isValidDate", () => {
    it("should validate correct date format", () => {
      expect(isValidDate("2024-01-15")).toBe(true);
      expect(isValidDate("2024-12-31")).toBe(true);
    });

    it("should validate leap day for leap years", () => {
      expect(isValidDate("2024-02-29")).toBe(true);
    });

    it("should reject invalid date format", () => {
      expect(isValidDate("15-01-2024")).toBe(false);
      expect(isValidDate("2024/01/15")).toBe(false);
      expect(isValidDate("invalid")).toBe(false);
      expect(isValidDate("2024-1-01")).toBe(false); // must be zero-padded
    });

    it("should reject invalid dates", () => {
      expect(isValidDate("2024-13-01")).toBe(false);
      expect(isValidDate("2024-02-30")).toBe(false);
      expect(isValidDate("2023-02-29")).toBe(false); // not a leap year
      expect(isValidDate("2024-00-10")).toBe(false);
      expect(isValidDate("2024-01-00")).toBe(false);
    });
  });

  describe("validateCustomerData", () => {
    it("should validate correct customer data", () => {
      const data = {
        customer_id: "1",
        name: "John Doe",
        email: "john@example.com",
        country: "USA",
        signup_date: "2024-01-15",
      };

      const result = validateCustomerData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject missing required fields", () => {
      const data = {
        customer_id: "",
        name: "John Doe",
        email: "john@example.com",
        country: "USA",
        signup_date: "2024-01-15",
      };

      const result = validateCustomerData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should treat whitespace-only required fields as missing", () => {
      const data = {
        customer_id: "   ",
        name: "   ",
        email: "john@example.com",
        country: "USA",
        signup_date: "2024-01-15",
      };

      const result = validateCustomerData(data);
      expect(result.isValid).toBe(false);
      const fields = result.errors.map((e) => e.field);
      expect(fields).toEqual(expect.arrayContaining(["customer_id", "name"]));
    });

    it("should reject invalid email", () => {
      const data = {
        customer_id: "1",
        name: "John Doe",
        email: "invalid-email",
        country: "USA",
        signup_date: "2024-01-15",
      };

      const result = validateCustomerData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((err) => err.field === "email")).toBe(true);
    });

    it("should reject invalid signup_date format", () => {
      const data = {
        customer_id: "1",
        name: "John Doe",
        email: "john@example.com",
        country: "USA",
        signup_date: "2024/01/15",
      };

      const result = validateCustomerData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((err) => err.field === "signup_date")).toBe(
        true
      );
    });

    it("should accumulate multiple errors when multiple fields are invalid", () => {
      const data = {
        customer_id: "",
        name: "",
        email: "invalid-email",
        country: "",
        signup_date: "2024-02-30",
      };

      const result = validateCustomerData(data);
      expect(result.isValid).toBe(false);
      const fields = result.errors.map((e) => e.field);
      expect(fields).toEqual(
        expect.arrayContaining([
          "customer_id",
          "name",
          "email",
          "country",
          "signup_date",
        ])
      );
    });
  });

  describe("validateOrderData", () => {
    it("should validate correct order data", () => {
      const data = {
        order_id: "101",
        customer_id: "1",
        product_name: "Laptop",
        amount: "999.99",
        order_date: "2024-05-01",
        status: "completed",
      };

      const result = validateOrderData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept zero amount", () => {
      const data = {
        order_id: "101",
        customer_id: "1",
        product_name: "Laptop",
        amount: "0",
        order_date: "2024-05-01",
        status: "completed",
      };

      const result = validateOrderData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate status case-insensitively", () => {
      const data = {
        order_id: "101",
        customer_id: "1",
        product_name: "Laptop",
        amount: "999.99",
        order_date: "2024-05-01",
        status: "Completed",
      };

      const result = validateOrderData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject invalid amount", () => {
      const data = {
        order_id: "101",
        customer_id: "1",
        product_name: "Laptop",
        amount: "invalid",
        order_date: "2024-05-01",
        status: "completed",
      };

      const result = validateOrderData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((err) => err.field === "amount")).toBe(true);
    });

    it("should reject invalid status", () => {
      const data = {
        order_id: "101",
        customer_id: "1",
        product_name: "Laptop",
        amount: "999.99",
        order_date: "2024-05-01",
        status: "invalid-status",
      };

      const result = validateOrderData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((err) => err.field === "status")).toBe(true);
    });

    it("should reject missing/blank product_name", () => {
      const data = {
        order_id: "101",
        customer_id: "1",
        product_name: "   ",
        amount: "999.99",
        order_date: "2024-05-01",
        status: "completed",
      };

      const result = validateOrderData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((err) => err.field === "product_name")).toBe(
        true
      );
    });

    it("should reject invalid order_date format", () => {
      const data = {
        order_id: "101",
        customer_id: "1",
        product_name: "Laptop",
        amount: "999.99",
        order_date: "2024/05/01",
        status: "completed",
      };

      const result = validateOrderData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((err) => err.field === "order_date")).toBe(
        true
      );
    });

    it("should accumulate multiple errors when multiple fields are invalid", () => {
      const data = {
        order_id: "",
        customer_id: "",
        product_name: "",
        amount: "invalid",
        order_date: "2024-13-01",
        status: "not-a-status",
      };

      const result = validateOrderData(data);
      expect(result.isValid).toBe(false);
      const fields = result.errors.map((e) => e.field);
      expect(fields).toEqual(
        expect.arrayContaining([
          "order_id",
          "customer_id",
          "product_name",
          "amount",
          "order_date",
          "status",
        ])
      );
    });

    it("should reject negative amount", () => {
      const data = {
        order_id: "101",
        customer_id: "1",
        product_name: "Laptop",
        amount: "-999.99",
        order_date: "2024-05-01",
        status: "completed",
      };

      const result = validateOrderData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((err) => err.field === "amount")).toBe(true);
    });
  });
});
