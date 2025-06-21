"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Create the configuration object
const config = {
    PORT: parseInt(process.env.PORT || "5000", 10),
    DB_URL: process.env.DB_URL || "mongodb://localhost:27017/",
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
    whitelistOrigins: process.env.WHITELIST_ORIGINS
        ? process.env.WHITELIST_ORIGINS.split(",")
        : ["http://localhost:3000"],
};
exports.default = config;
