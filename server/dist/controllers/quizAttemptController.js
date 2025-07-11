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
exports.getAttempts = exports.submitAttempt = void 0;
const QuestionAttempt_1 = __importDefault(require("@/models/QuestionAttempt"));
const submitAttempt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attempt = yield QuestionAttempt_1.default.create(req.body);
        res.status(201).json(attempt);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.submitAttempt = submitAttempt;
const getAttempts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const attempts = yield QuestionAttempt_1.default.find({ user: req.params.userId }).populate('question');
    res.json(attempts);
});
exports.getAttempts = getAttempts;
