import StudentProgress from '../models/StudentProgress';
import { Request, Response } from 'express';

export const updateProgress = async (req: Request, res: Response) => {
  try {
    const progress = await StudentProgress.findOneAndUpdate(
      { user: req.body.user, video: req.body.video },
      req.body,
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (error) {
    res.status(400).json({ error });
  }
};


export const getProgress = async (req: Request, res: Response) => {
  const progress = await StudentProgress.find({ user: req.params.userId }).populate('video');
  res.json(progress);
};
