import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import animalRoutes from "./routes/animal.route";
import userRoutes from "./routes/user.route";
import prisma from "../prisma/client";
import authRoutes from './routes/auth.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet()); 
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: "ok", 
    uptime: process.uptime(),
    timestamp: new Date().toISOString() 
  });
});

app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/animals", animalRoutes);
app.use("/api/v1/users", userRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err.stack);

  res.status(500).json({
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\n⚠️ Signal ${signal} received. Shutting down gracefully...`);
  
  server.close(async () => {
    await prisma.$disconnect();
    console.log("✅ Server HTTP and database connections closed successfully.");
    process.exit(0);
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));