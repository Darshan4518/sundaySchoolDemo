"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const studentProgressSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("StudentProgress", studentProgressSchema);
