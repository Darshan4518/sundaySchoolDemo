"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videoController_1 = require("../controllers/videoController");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const videoRouter = (0, express_1.Router)();
videoRouter.post("/", upload.single("video"), videoController_1.createVideo);
videoRouter.get("/", videoController_1.getVideosAndQuestions);
exports.default = videoRouter;
