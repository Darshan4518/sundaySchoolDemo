import express from "express";
import config from "@/config";
import cors from "cors";
import connectDB from "./lib/mongoose";
import userRouter from "./routers/userRoutes";
import videoRouter from "./routers/videoRoutes";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/video", videoRouter);

(async () => {
  try {
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
    connectDB();
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
})();
