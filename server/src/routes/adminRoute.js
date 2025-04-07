import express from "express";
import {
  getAuthenticatedUser,
  loginAdmin,
  logoutUser,
  registerAdmin,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);

adminRouter.post("/register", registerAdmin);

adminRouter.get("/auth/me", getAuthenticatedUser);

adminRouter.post("/logout", logoutUser);

export default adminRouter;
