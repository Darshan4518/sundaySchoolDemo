import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    chapter: String,
    video_url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Video", videoSchema);
