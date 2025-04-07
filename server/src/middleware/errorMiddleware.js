import logger from "../config/logger.js";

const ErrorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle invalid JSON payload errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    message = "Invalid JSON format";
    statusCode = 400;
  }

  // Handle MongoDB CastError (Invalid ID Format)
  if (err.name === "CastError") {
    message = `Resource not found. Invalid ${err.path}`;
    statusCode = 400;
  }

  // Handle Duplicate Key Error (MongoDB Unique Field Violation)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for ${field} entered`;
    statusCode = 400;
  }

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // Handle JWT Errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token, please try again";
    statusCode = 401;
  }

  // Handle Expired JWT Token
  if (err.name === "TokenExpiredError") {
    message = "Token has expired, please log in again";
    statusCode = 401;
  }

  // //  **Logging Error**
  // if (process.env.NODE_ENV === "development") {
  //   console.error("Error:", err);
  // }

  logger.error(err.message, { stack: err.stack });

  // Send response without exposing full error details in production
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.stack }), // Include stack trace only in dev
  });
};

export default ErrorMiddleware;
