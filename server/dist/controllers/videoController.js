"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideosAndQuestions = exports.createVideo = void 0;
const Video_1 = __importDefault(require("../models/Video"));
const cloudinary_1 = require("cloudinary");
const Question_1 = __importDefault(require("@/models/Question"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const createVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, chapter } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No video file provided" });
        }
        if (file.size > 5 * 1024 * 1024) {
            return res
                .status(400)
                .json({ error: "Video size must be less than 5MB" });
        }
        const uploadResult = yield new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({
                resource_type: "video",
                folder: "sundayschool_demo",
            }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            stream.end(file.buffer);
        });
        const video = yield Video_1.default.create({
            title,
            description,
            chapter,
            video_url: uploadResult.secure_url,
        });
        const questions = JSON.parse(req.body.questions || "[]");
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "No valid questions provided" });
        }
        const questionEntries = questions.map((q) => ({
            video: video._id,
            question_id: q.id,
            question_text: q.question,
            option_a: q.options[0],
            option_b: q.options[1],
            option_c: q.options[2],
            option_d: q.options[3],
            correct_answer: q.correctAnswer,
        }));
        yield Question_1.default.insertMany(questionEntries);
        return res.status(201).json({
            message: "Video and questions created successfully",
            videoUrl: uploadResult.secure_url,
        });
    }
    catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.createVideo = createVideo;
const getVideosAndQuestions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videos = yield Video_1.default.find().lean();
    const questions = yield Question_1.default.find().populate("video").lean();
    res.status(200).json({
        data: {
            videos,
            questions,
        },
    });
});
exports.getVideosAndQuestions = getVideosAndQuestions;
