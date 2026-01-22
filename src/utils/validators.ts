import { ValidationError } from "../types";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validateCustomerData = (
  row: any
): { isValid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  if (!row.customer_id || row.customer_id.trim() === "") {
    errors.push({ field: "customer_id", message: "Customer ID is required" });
  }

  if (!row.name || row.name.trim() === "") {
    errors.push({ field: "name", message: "Name is required" });
  }

  if (!row.email || row.email.trim() === "") {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!validateEmail(row.email)) {
    errors.push({ field: "email", message: "Email format is invalid" });
  }

  if (!row.country || row.country.trim() === "") {
    errors.push({ field: "country", message: "Country is required" });
  }

  if (!row.signup_date || row.signup_date.trim() === "") {
    errors.push({ field: "signup_date", message: "Signup date is required" });
  } else if (!isValidDate(row.signup_date)) {
    errors.push({
      field: "signup_date",
      message: "Signup date format must be YYYY-MM-DD",
    });
  }

  return { isValid: errors.length === 0, errors };
};

export const validateOrderData = (
  row: any
): { isValid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  if (!row.order_id || row.order_id.trim() === "") {
    errors.push({ field: "order_id", message: "Order ID is required" });
  }

  if (!row.customer_id || row.customer_id.trim() === "") {
    errors.push({ field: "customer_id", message: "Customer ID is required" });
  }

  if (!row.product_name || row.product_name.trim() === "") {
    errors.push({ field: "product_name", message: "Product name is required" });
  }

  if (!row.amount || isNaN(parseFloat(row.amount))) {
    errors.push({ field: "amount", message: "Amount must be a valid number" });
  } else if (parseFloat(row.amount) < 0) {
    errors.push({
      field: "amount",
      message: "Amount must be greater than or equal to 0",
    });
  }

  if (!row.order_date || row.order_date.trim() === "") {
    errors.push({ field: "order_date", message: "Order date is required" });
  } else if (!isValidDate(row.order_date)) {
    errors.push({
      field: "order_date",
      message: "Order date format must be YYYY-MM-DD",
    });
  }

  if (!row.status || row.status.trim() === "") {
    errors.push({ field: "status", message: "Status is required" });
  } else if (
    !["pending", "completed", "shipped", "cancelled"].includes(
      row.status.toLowerCase()
    )
  ) {
    errors.push({
      field: "status",
      message: "Status must be one of: pending, completed, shipped, cancelled",
    });
  }

  return { isValid: errors.length === 0, errors };
};

export const isValidDate = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split("-").map(Number);

  // Validate month
  if (month < 1 || month > 12) {
    return false;
  }

  // Validate day based on month
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Check for leap year
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  if (isLeapYear) {
    daysInMonth[1] = 29;
  }

  if (day < 1 || day > daysInMonth[month - 1]) {
    return false;
  }

  return true;
};
