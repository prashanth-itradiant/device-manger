import CatchAsyncError from "../middleware/CatchAsyncError.js";
import ErrorHandler from "../middleware/errorHandler.js";
import { poolPromise } from "../config/db.js";
import sql from "mssql";

export const getAllDevices = CatchAsyncError(async (req, res, next) => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM [DEVICEDETAILS]");

  if (!result.recordset.length) {
    return next(new ErrorHandler("No devices found", 404));
  }

  res.status(200).json({
    success: true,
    data: result.recordset,
  });
});

export const getSingleDevice = CatchAsyncError(async (req, res, next) => {
  const { serialNo } = req.params;

  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("serialNo", sql.VarChar, serialNo)
    .query("SELECT * FROM [DEVICEDETAILS] WHERE SERIAL_NO = @serialNo");

  if (!result.recordset.length) {
    return next(new ErrorHandler("Device not found", 404));
  }

  res.status(200).json({
    success: true,
    data: result.recordset[0],
  });
});

export const getDevicePerformance = CatchAsyncError(async (req, res, next) => {
  const SERIAL_NO = req.params.id;

  if (!SERIAL_NO) {
    return next(new ErrorHandler("Serial number is required", 400));
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("SERIAL_NO", SERIAL_NO);

    const result = await request.query(`
      SELECT * FROM [dbo].[DEVICE_PERFORMANCE]
      WHERE SERIAL_NO = @SERIAL_NO
    `);

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        message: "No performance data found for this device.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Device performance data retrieved.",
      data: result.recordset[0],
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Database error: " + error.message, 500));
  }
});

export const getSoftwareList = CatchAsyncError(async (req, res, next) => {
  const SERIAL_NO = req.params.id;

  if (!SERIAL_NO) {
    return next(new ErrorHandler("Serial number is required", 400));
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("SERIAL_NO", SERIAL_NO);

    const result = await request.query(`
      SELECT * FROM [dbo].[Softwares]
      WHERE SERIAL_NO = @SERIAL_NO
    `);

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        message: "No software data found for this device.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Software list retrieved.",
      data: result.recordset, // Return full list
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Database error: " + error.message, 500));
  }
});
