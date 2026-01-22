import mongoose, { Schema, Document } from "mongoose";
import { Order as IOrder } from "../types";

interface OrderDocument extends IOrder, Document {}

const orderSchema = new Schema<OrderDocument>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "shipped", "cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ orderId: 1 });
orderSchema.index({ customerId: 1 });
orderSchema.index({ customerId: 1, orderDate: -1 });

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);
