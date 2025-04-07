import CatchAsyncError from "./catchAsyncError.js";
import User from "../models/userModel.js";
import ErrorHandler from "./errorHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AdminModel from "../models/adminModel.js";
dotenv.config();

export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new ErrorHandler("Not authenticated", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.status === 0) {
      return next(new ErrorHandler("Your account has been deactivated", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("User authentication required", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};

export const isAuthenticatedAdmin = CatchAsyncError(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new ErrorHandler("Not authenticated", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await AdminModel.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.status === 0) {
      return next(new ErrorHandler("Your account has been deactivated", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});
