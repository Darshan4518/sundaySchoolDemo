"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentProgressController_1 = require("../controllers/studentProgressController");
const progressRouter = (0, express_1.Router)();
progressRouter.post('/', studentProgressController_1.updateProgress);
progressRouter.get('/:userId', studentProgressController_1.getProgress);
exports.default = progressRouter;
