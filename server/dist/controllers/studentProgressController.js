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
exports.getProgress = exports.updateProgress = void 0;
const StudentProgress_1 = __importDefault(require("../models/StudentProgress"));
const updateProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const progress = yield StudentProgress_1.default.findOneAndUpdate({ user: req.body.user, video: req.body.video }, req.body, { new: true, upsert: true });
        res.json(progress);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.updateProgress = updateProgress;
const getProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const progress = yield StudentProgress_1.default.find({ user: req.params.userId }).populate('video');
    res.json(progress);
});
exports.getProgress = getProgress;
