import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    question_id: {
      type: String,
      required: true,
    },
    question_text: {
      type: String,
      required: true,
    },
    option_a: {
      type: String,
      required: true,
    },
    option_b: {
      type: String,
      required: true,
    },
    option_c: {
      type: String,
      required: true,
    },
    option_d: {
      type: String,
      required: true,
    },
    correct_answer: {
      type: Number,
      enum: [0, 1, 2, 3],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Question", questionSchema);
