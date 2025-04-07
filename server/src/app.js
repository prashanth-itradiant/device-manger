import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { poolPromise } from "./config/db.js";
import ErrorMiddleware from "./middleware/errorMiddleware.js";
import deviceRouter from "./routes/deviceRoute.js";
import actionRouter from "./routes/actionRoute.js";
import adminRouter from "./routes/adminRoute.js";

dotenv.config();

const app = express();

// Observer Pattern for Database Connection
const dbObservers = [];

const notifyObservers = async () => {
  try {
    await poolPromise;
    console.log("✅ Database pool is ready");
    dbObservers.forEach((observer) => observer("DB_CONNECTED"));
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

const registerObserver = (observer) => {
  dbObservers.push(observer);
};

notifyObservers();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", deviceRouter, actionRouter, adminRouter);

// Error Handling Middleware (Must be at the end)
app.use(ErrorMiddleware);

export { app, registerObserver };
