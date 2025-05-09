import dotenv from "dotenv";
import sql from "mssql";

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  pool: {
    max: 10, // Maximum number of connections
    min: 2, // Minimum number of connections
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  },
  options: {
    encrypt: false, // Set to true if using Azure
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Connected to Azure SQL Database!");
    return pool;
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });

export { poolPromise, sql };
