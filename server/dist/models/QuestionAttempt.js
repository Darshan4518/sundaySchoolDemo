"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quizAttemptSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    video: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
    },
    question: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model("QuizAttempt", quizAttemptSchema);
