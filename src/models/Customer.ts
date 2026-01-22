import mongoose, { Schema, Document } from "mongoose";
import { Customer as ICustomer } from "../types";

interface CustomerDocument extends ICustomer, Document {}

const customerSchema = new Schema<CustomerDocument>(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    country: {
      type: String,
      required: true,
    },
    signupDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ customerId: 1 });
customerSchema.index({ email: 1 });

export const Customer = mongoose.model<CustomerDocument>(
  "Customer",
  customerSchema
);
