import express, { Application, Request, Response } from "express";
import "dotenv/config";
import logger from "./utils/logger";

const app: Application = express();
const PORT = process.env.PORT || 3001;

//Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "API is running", timestamp: new Date().toISOString() });
});

const startServer = () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error: any) {
    logger.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

//Handle graceful shutdown-usually sent by docker stop,
//kurbenetes during pod terminations or process managers like pm2 or systemd
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

//Usually triggered by ctrl+c
process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

startServer();
