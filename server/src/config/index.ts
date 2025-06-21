import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Define the configuration interface
interface Config {
  PORT: number;
  DB_URL: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  whitelistOrigins?: string[];
}

// Create the configuration object
const config: Config = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  DB_URL: process.env.DB_URL || "mongodb://localhost:27017/",
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  whitelistOrigins: process.env.WHITELIST_ORIGINS
    ? process.env.WHITELIST_ORIGINS.split(",")
    : ["http://localhost:3000"],
};

export default config;
