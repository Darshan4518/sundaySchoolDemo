"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    video: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Question", questionSchema);
