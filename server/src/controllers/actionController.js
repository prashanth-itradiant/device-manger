import { poolPromise } from "../config/db.js";
import CatchAsyncError from "../middleware/CatchAsyncError.js";
import ErrorHandler from "../middleware/errorHandler.js";

export const handleDevicePerformance = CatchAsyncError(
  async (req, res, next) => {
    const SERIAL_NO = req.params.id;

    if (!SERIAL_NO) {
      return next(new ErrorHandler("Serial number is required", 400));
    }

    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input("SERIAL_NO", SERIAL_NO);
      request.input("ACTION", "DevicePerformance");
      request.input("STATUS", "Pending");
      request.input("CREATEDAT", new Date());

      // Insert the action request
      await request.query(`
      INSERT INTO [dbo].[ADMIN_ACTIONS] 
      (SERIAL_NO, ACTION, STATUS, CREATEDAT) 
      VALUES (@SERIAL_NO, @ACTION, @STATUS, @CREATEDAT)
    `);

      let elapsedTime = 0;
      const checkInterval = 2000; // 2 seconds
      const maxTime = 120000; // 2 minutes in milliseconds

      const checkStatus = async () => {
        if (elapsedTime >= maxTime) {
          return res.status(200).json({
            success: false,
            message:
              "Device is not responding, action not completed within 2 minutes.",
          });
        }

        try {
          const statusRequest = pool.request();
          statusRequest.input("SERIAL_NO", SERIAL_NO);
          statusRequest.input("ACTION", "DevicePerformance");

          // Query the latest action status
          const statusResult = await statusRequest.query(`
          SELECT STATUS FROM [dbo].[ADMIN_ACTIONS] 
          WHERE SERIAL_NO = @SERIAL_NO 
          AND CAST(ACTION AS NVARCHAR(255)) = @ACTION
          ORDER BY CREATEDAT DESC
        `);

          if (
            statusResult.recordset.length &&
            statusResult.recordset[0].STATUS === "Completed"
          ) {
            // Fetch device performance details
            const detailsRequest = pool.request();
            detailsRequest.input("SERIAL_NO", SERIAL_NO);

            const detailsResult = await detailsRequest.query(`
            SELECT * FROM [dbo].[DEVICE_PERFORMANCE] 
            WHERE SERIAL_NO = @SERIAL_NO
          `);

            if (!detailsResult.recordset.length) {
              return res.status(404).json({
                success: false,
                message: "No performance data found for this device.",
              });
            }

            return res.status(200).json({
              success: true,
              message: "Device performance data retrieved.",
              data: detailsResult.recordset[0],
            });
          }

          // If the action is still not complete, increase elapsed time and check again
          elapsedTime += checkInterval;
          setTimeout(checkStatus, checkInterval);
        } catch (error) {
          console.error(error);
          return next(
            new ErrorHandler("Database error: " + error.message, 500)
          );
        }
      };

      // Start checking the action status
      setTimeout(checkStatus, checkInterval);
    } catch (error) {
      console.error(error);
      return next(new ErrorHandler("Database error: " + error.message, 500));
    }
  }
);

export const handleSoftwareList = CatchAsyncError(async (req, res, next) => {
  const SERIAL_NO = req.params.id;
  if (!SERIAL_NO) {
    return next(new ErrorHandler("Serial number is required", 400));
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("SERIAL_NO", SERIAL_NO);
    request.input("ACTION", "SoftwareList");
    request.input("STATUS", "Pending");
    request.input("CREATEDAT", new Date());

    // Insert the action request
    await request.query(`
      INSERT INTO [dbo].[ADMIN_ACTIONS] 
      (SERIAL_NO, ACTION, STATUS, CREATEDAT) 
      VALUES (@SERIAL_NO, @ACTION, @STATUS, @CREATEDAT)
    `);

    let elapsedTime = 0;
    const checkInterval = 2000; // 2 seconds
    const maxTime = 120000; // 2 minutes in milliseconds

    const checkStatus = async () => {
      if (elapsedTime >= maxTime) {
        return res.status(200).json({
          success: false,
          message: "Device is not responding, action not completed",
        });
      }

      try {
        const statusRequest = pool.request();
        statusRequest.input("SERIAL_NO", SERIAL_NO);
        statusRequest.input("ACTION", "SoftwareList");

        // Query the latest action status
        const statusResult = await statusRequest.query(`
          SELECT STATUS FROM [dbo].[ADMIN_ACTIONS] 
          WHERE SERIAL_NO = @SERIAL_NO 
          AND CAST(ACTION AS NVARCHAR(255)) = @ACTION
          ORDER BY CREATEDAT DESC
        `);

        if (
          statusResult.recordset.length &&
          statusResult.recordset[0].STATUS === "Completed"
        ) {
          // Fetch the list of software from Softwares table
          const softwareRequest = pool.request();
          softwareRequest.input("SERIAL_NO", SERIAL_NO);

          const softwareResult = await softwareRequest.query(`
            SELECT * FROM [dbo].[Softwares] 
            WHERE SERIAL_NO = @SERIAL_NO
          `);

          if (!softwareResult.recordset.length) {
            return res.status(404).json({
              success: false,
              message: "No software data found.",
            });
          }

          return res.status(200).json({
            success: true,
            message: "Software list retrieved.",
            data: softwareResult.recordset, // Returning all matching rows as an array
          });
        }

        // If the action is still not complete, increase elapsed time and check again
        elapsedTime += checkInterval;
        setTimeout(checkStatus, checkInterval);
      } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Database error: " + error.message, 500));
      }
    };

    // Start checking the action status
    setTimeout(checkStatus, checkInterval);
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Database error: " + error.message, 500));
  }
});

export const handleClearTempFiles = CatchAsyncError(async (req, res, next) => {
  const { SERIAL_NO } = req.body;

  if (!SERIAL_NO) {
    return next(new ErrorHandler("Serial number is required", 400));
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("SERIAL_NO", SERIAL_NO);
    request.input("ACTION", "ClearTempFiles");
    request.input("STATUS", "Pending");
    request.input("CREATEDAT", new Date());

    await request.query(`
      INSERT INTO [dbo].[ADMIN_ACTIONS] (SERIAL_NO, ACTION, STATUS, CREATEDAT) 
      VALUES (@SERIAL_NO, @ACTION, @STATUS, @CREATEDAT)
    `);

    res.status(201).json({
      success: true,
      message: "Temporary files cleanup initiated.",
      trackingId: SERIAL_NO,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Database error: " + error.message, 500));
  }
});

export const handleQuickAssist = CatchAsyncError(async (req, res, next) => {
  const { SERIAL_NO, Message } = req.body;

  if (!SERIAL_NO || !Message) {
    return next(
      new ErrorHandler("Serial number and message are required", 400)
    );
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("SERIAL_NO", SERIAL_NO);
    request.input("ACTION", "QuickAssist");
    request.input("STATUS", "Pending");
    request.input("CREATEDAT", new Date());
    request.input("Message", Message);

    await request.query(`
      INSERT INTO [dbo].[ADMIN_ACTIONS] (SERIAL_NO, ACTION, STATUS, CREATEDAT, Message) 
      VALUES (@SERIAL_NO, @ACTION, @STATUS, @CREATEDAT, @Message)
    `);

    res.status(201).json({
      success: true,
      message: "Quick Assist request sent.",
      details: Message,
      trackingId: SERIAL_NO,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Database error: " + error.message, 500));
  }
});

export const handleNotify = CatchAsyncError(async (req, res, next) => {
  const { SERIAL_NO, Message } = req.body;

  if (!SERIAL_NO || !Message) {
    return next(
      new ErrorHandler("Serial number and message are required", 400)
    );
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("SERIAL_NO", SERIAL_NO);
    request.input("ACTION", "Notify");
    request.input("STATUS", "Pending");
    request.input("CREATEDAT", new Date());
    request.input("Message", Message);

    await request.query(`
      INSERT INTO [dbo].[ADMIN_ACTIONS] (SERIAL_NO, ACTION, STATUS, CREATEDAT, Message) 
      VALUES (@SERIAL_NO, @ACTION, @STATUS, @CREATEDAT, @Message)
    `);

    res.status(201).json({
      success: true,
      message: "Notification sent successfully.",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Database error: " + error.message, 500));
  }
});

export const handleForceUpdate = CatchAsyncError(async (req, res, next) => {
  const { SERIAL_NO } = req.body;

  if (!SERIAL_NO) {
    return next(new ErrorHandler("Serial number is required", 400));
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("SERIAL_NO", SERIAL_NO);
    request.input("ACTION", "ForceUpdate");
    request.input("STATUS", "Pending");
    request.input("CREATEDAT", new Date());

    await request.query(`
      INSERT INTO [dbo].[ADMIN_ACTIONS] (SERIAL_NO, ACTION, STATUS, CREATEDAT) 
      VALUES (@SERIAL_NO, @ACTION, @STATUS, @CREATEDAT)
    `);

    res.status(201).json({
      success: true,
      message: "Force update initiated successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Database error: " + error.message, 500));
  }
});

export const handleDeviceInfo = CatchAsyncError(async (req, res, next) => {
  const SERIAL_NO = req.params.id;

  if (!SERIAL_NO) {
    return next(new ErrorHandler("Serial number is required", 400));
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("SERIAL_NO", SERIAL_NO);
    request.input("ACTION", "deviceinfo");
    request.input("STATUS", "Pending");
    request.input("CREATEDAT", new Date());

    // Insert the action request
    await request.query(`
        INSERT INTO [dbo].[ADMIN_ACTIONS] 
        (SERIAL_NO, ACTION, STATUS, CREATEDAT) 
        VALUES (@SERIAL_NO, @ACTION, @STATUS, @CREATEDAT)
      `);

    let elapsedTime = 0;
    const checkInterval = 2000; // 2 seconds
    const maxTime = 120000; // 2 minutes

    const checkStatus = async () => {
      if (elapsedTime >= maxTime) {
        return res.status(200).json({
          success: false,
          message:
            "Device is not responding, action not completed within 2 minutes.",
        });
      }

      try {
        const statusRequest = pool.request();
        statusRequest.input("SERIAL_NO", SERIAL_NO);
        statusRequest.input("ACTION", "deviceinfo");

        const statusResult = await statusRequest.query(`
            SELECT STATUS FROM [dbo].[ADMIN_ACTIONS] 
            WHERE SERIAL_NO = @SERIAL_NO 
            AND CAST(ACTION AS NVARCHAR(255)) = @ACTION
            ORDER BY CREATEDAT DESC
          `);

        if (
          statusResult.recordset.length &&
          statusResult.recordset[0].STATUS === "Complete"
        ) {
          // Fetch device info details
          const detailsRequest = pool.request();
          detailsRequest.input("SERIAL_NO", SERIAL_NO);

          const detailsResult = await detailsRequest.query(`
              SELECT * FROM [dbo].[DEVICEDETAILS] 
              WHERE SERIAL_NO = @SERIAL_NO
            `);

          if (!detailsResult.recordset.length) {
            return res.status(404).json({
              success: false,
              message: "No device info found for this serial number.",
            });
          }

          return res.status(200).json({
            success: true,
            message: "Device info retrieved successfully.",
            data: detailsResult.recordset[0],
          });
        }

        elapsedTime += checkInterval;
        setTimeout(checkStatus, checkInterval);
      } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Database error: " + error.message, 500));
      }
    };

    setTimeout(checkStatus, checkInterval);
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Database error: " + error.message, 500));
  }
});
