import { Router } from "express";
import {
  createUser,
  getUsers,
  login,
  seedDemoUsers,
} from "@/controllers/userController";
const userRouter = Router();
userRouter.post("/", createUser);
userRouter.get("/", getUsers);
userRouter.post("/login", login);

userRouter.post("/seed", seedDemoUsers);
export default userRouter;
