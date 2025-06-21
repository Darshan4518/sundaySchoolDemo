
import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selected_answer: {
    type: Number,
    enum: [0, 1, 2, 3],
    required: true,
  },
  is_correct: {
    type: Boolean,
    required: true,
  },
  attempted_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);
