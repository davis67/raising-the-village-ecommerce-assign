import csvParser from "csv-parser";
import { Customer, ValidationError } from "../types";
import { Readable } from "stream";
import { validateCustomerData } from "./validators";
import logger from "./logger";
import { ICustomer } from "../../../assignment-1/src/types";

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
