import express from "express";
import {
  getAllDevices,
  getDevicePerformance,
  getSingleDevice,
  getSoftwareList,
} from "../controllers/deviceController.js";

const deviceRouter = express.Router();

deviceRouter.get("/devices", getAllDevices);

deviceRouter.get("/get-device-info/:serialNo", getSingleDevice);

deviceRouter.get("/get-device-performance/:id", getDevicePerformance);

deviceRouter.get("/get-device-softwares/:id", getSoftwareList);

export default deviceRouter;
