import winston from "winston";

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${stack || ""}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

export default logger;
