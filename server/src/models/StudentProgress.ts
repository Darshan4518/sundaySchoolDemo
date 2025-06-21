import mongoose from "mongoose";

const studentProgressSchema = new mongoose.Schema({
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
  completed: {
    type: Boolean,
    default: false,
  },
  quiz_score: Number,
  completed_at: Date,
  created_at: {
    type: Date,
    default: Date.now,
  },
}, { 
  timestamps: true 
});

studentProgressSchema.index({ user: 1, video: 1 }, { unique: true });

export default mongoose.model("StudentProgress", studentProgressSchema);