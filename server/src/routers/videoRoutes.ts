import { Router } from "express";
import {
  createVideo,
  getVideosAndQuestions,
} from "../controllers/videoController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const videoRouter = Router();
videoRouter.post("/", upload.single("video"), createVideo);
videoRouter.get("/", getVideosAndQuestions);
export default videoRouter;
