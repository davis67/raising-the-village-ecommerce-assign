import csvParser from "csv-parser";
import { Customer, Order, ValidationError } from "../types";
import { Readable } from "stream";
import { validateCustomerData, validateOrderData } from "./validators";
import logger from "./logger";

interface ParseResult<T> {
  records: T[];
  validationErrors: Array<{ rowIndex: number; errors: ValidationError[] }>;
}

//Read the CSV file line by line and validate the data, keep the good rows and report problems
// for bad ones
export const parseCustomersCSV = (
  fileContent: Buffer
): Promise<ParseResult<Customer>> => {
  return new Promise((resolve, reject) => {
    const records: Customer[] = [];
    let rowIndex = 0;

    const validationErrors: Array<{
      rowIndex: number;
      errors: ValidationError[];
    }> = [];

    Readable.from([fileContent])
      .pipe(csvParser())
      .on("end", () => {
        resolve({ records, validationErrors });
      })
      .on("data", (row) => {
        rowIndex++;
        const validation = validateCustomerData(row);
        if (!validation.isValid) {
          validationErrors.push({ rowIndex, errors: validation.errors });
        } else {
          records.push({
            customerId: row.customer_id.trim(),
            name: row.name.trim(),
            email: row.email.trim(),
            country: row.country.trim(),
            signupDate: row.signup_date.trim(),
          });
        }
      })
      .on("error", (error) => {
        logger.error(`CSV parsing error: ${error.message}`);
        reject(new Error(`CSV parsing error: ${error.message}`));
      });
  });
};

//Read the CSV file line by line and validate the data, keep the good rows and report problems
// for bad ones
export const parseOrdersCSV = (
  fileContent: Buffer
): Promise<ParseResult<Order>> => {
  return new Promise((resolve, reject) => {
    const records: Order[] = [];
    let rowIndex = 0;

    const validationErrors: Array<{
      rowIndex: number;
      errors: ValidationError[];
    }> = [];

    Readable.from([fileContent])
      .pipe(csvParser())
      .on("end", () => {
        resolve({ records, validationErrors });
      })
      .on("data", (row) => {
        rowIndex++;
        const validation = validateOrderData(row);
        if (!validation.isValid) {
          validationErrors.push({ rowIndex, errors: validation.errors });
        } else {
          records.push({
            orderId: row.order_id.trim(),
            customerId: row.customer_id.trim(),
            productName: row.product_name.trim(),
            amount: parseFloat(row.amount),
            orderDate: row.order_date.trim(),
            status: row.status.trim().toLowerCase(),
          });
        }
      })
      .on("error", (error) => {
        logger.error(`CSV parsing error: ${error.message}`);
        reject(new Error(`CSV parsing error: ${error.message}`));
      });
  });
};
