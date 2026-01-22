import mongoose from "mongoose";
import logger from "./logger";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected successfully");
  } catch (error: any) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB disconnected");
  } catch (error: any) {
    logger.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
