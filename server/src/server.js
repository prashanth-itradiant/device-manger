import { app, registerObserver } from "./app.js";

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  process.exit(1);
});

// Observer for Database Connection
registerObserver((event) => {
  if (event === "DB_CONNECTED") {
    console.log("📢 Observer: Database is connected. Server running smoothly.");
  }
});

// Graceful Shutdown (SIGTERM)
process.on("SIGTERM", () => {
  console.info("SIGTERM received. Closing server gracefully...");
  server.close(() => {
    console.info("All requests completed. Server shutting down.");
    process.exit(0);
  });
});
