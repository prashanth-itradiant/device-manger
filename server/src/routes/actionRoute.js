import express from "express";
import {
  handleClearTempFiles,
  handleDeviceInfo,
  handleDevicePerformance,
  handleForceUpdate,
  handleNotify,
  handleQuickAssist,
  handleSoftwareList,
} from "../controllers/actionController.js";

const actionRouter = express.Router();

actionRouter.post(
  "/admin-action/device-performance/:id",
  handleDevicePerformance
);

actionRouter.post("/admin-action/device-info/:id", handleDeviceInfo);

actionRouter.post("/admin-action/software-list/:id", handleSoftwareList);

actionRouter.post("/admin-action/notify", handleNotify);

actionRouter.post("/admin-action/clear-temp-files", handleClearTempFiles);

actionRouter.post("/admin-action/quick-assist", handleQuickAssist);

actionRouter.post("/admin-action/force-update", handleForceUpdate);

export default actionRouter;
