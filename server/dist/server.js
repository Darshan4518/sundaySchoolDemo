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
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("@/config"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("./lib/mongoose"));
const userRoutes_1 = __importDefault(require("./routers/userRoutes"));
const videoRoutes_1 = __importDefault(require("./routers/videoRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use("/api/v1/auth", userRoutes_1.default);
app.use("/api/v1/video", videoRoutes_1.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.listen(config_1.default.PORT, () => {
            console.log(`Server is running on port ${config_1.default.PORT}`);
        });
        (0, mongoose_1.default)();
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
    }
}))();
