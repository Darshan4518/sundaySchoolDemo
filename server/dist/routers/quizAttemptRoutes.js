"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quizAttemptController_1 = require("../controllers/quizAttemptController");
const attemptRouter = (0, express_1.Router)();
attemptRouter.post('/', quizAttemptController_1.submitAttempt);
attemptRouter.get('/:userId', quizAttemptController_1.getAttempts);
exports.default = attemptRouter;
