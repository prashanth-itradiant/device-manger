import { poolPromise } from "../config/db.js";
import CatchAsyncError from "../middleware/CatchAsyncError.js";
import ErrorHandler from "../middleware/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerAdmin = CatchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Invalid email format", 400));
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Check if the user already exists using a distinct parameter name
    request.input("checkEmail", email);
    const existingUser = await request.query(`
        SELECT * FROM [dbo].[ADMINS] 
        WHERE email = @checkEmail
      `);

    if (existingUser.recordset.length > 0) {
      return next(new ErrorHandler("User already exists with this email", 400));
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert the user into the database with the hashed password using distinct parameter names
    request.input("name", name);
    request.input("email", email);
    request.input("password", hashedPassword);

    await request.query(`
        INSERT INTO [dbo].[ADMINS] 
        (name, email, password) 
        VALUES (@name, @email, @password)
      `);

    // Send success response
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Database error: " + error.message, 500));
  }
});

export const loginAdmin = CatchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Use parameterized query to prevent SQL injection
    request.input("email", email);
    const result = await request.query(`
      SELECT * FROM [dbo].[ADMINS] WHERE email = @email
    `);

    const admin = result.recordset[0]; // Get the first admin record (if any)

    if (!admin) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Check if the password matches the hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Generate a JWT token without the 'role' field
    const token = jwt.sign({ id: admin.ID }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token expiration time
    });

    // Set token in the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure flag only in production
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // Token expiry in milliseconds (7 days)
    });

    // Send success response with admin data
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: admin.ID,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Database error: " + error.message, 500));
  }
});

export const getAuthenticatedUser = CatchAsyncError(async (req, res, next) => {
  const token = req.cookies?.token;

  // Check if token exists
  if (!token) {
    return next(new ErrorHandler("Not authenticated", 401));
  }

  try {
    // Verify token and extract the decoded information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Connect to the database using the pool
    const pool = await poolPromise;
    const request = pool.request();

    // Use parameterized query to prevent SQL injection and fetch user based on decoded id
    request.input("id", decoded.id);
    const result = await request.query(`
        SELECT * FROM [dbo].[ADMINS] WHERE ID = @id
      `);

    const admin = result.recordset[0]; // Get the first admin record if it exists

    // If no user is found, return an error
    if (!admin) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Return the authenticated user data
    res.status(200).json({
      success: true,
      data: {
        id: admin.ID,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};
