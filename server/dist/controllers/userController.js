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
exports.seedDemoUsers = exports.login = exports.getUsers = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.create(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.createUser = createUser;
const getUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find();
    res.json(users);
});
exports.getUsers = getUsers;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = yield User_1.default.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        return res.status(200).json({
            user: user,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
    }
});
exports.login = login;
const seedDemoUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = [
            {
                email: "admin@demo.com",
                password: "admin123",
                role: "admin",
            },
            {
                email: "student@demo.com",
                password: "student123",
                role: "student",
            },
        ];
        yield User_1.default.deleteMany({ email: { $in: users.map((u) => u.email) } });
        const seeded = yield User_1.default.insertMany(users);
        res.json({ message: "Demo users seeded", users: seeded });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.seedDemoUsers = seedDemoUsers;
