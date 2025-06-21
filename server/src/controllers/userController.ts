import User from "../models/User";
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
  }
};

export const seedDemoUsers = async (_req: Request, res: Response) => {
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

    await User.deleteMany({ email: { $in: users.map((u) => u.email) } });
    const seeded = await User.insertMany(users);
    res.json({ message: "Demo users seeded", users: seeded });
  } catch (error) {
    res.status(500).json({ error });
  }
};
