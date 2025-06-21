import QuizAttempt from '@/models/QuestionAttempt';
import { Request, Response } from 'express';

export const submitAttempt = async (req: Request, res: Response) => {
  try {
    const attempt = await QuizAttempt.create(req.body);
    res.status(201).json(attempt);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const getAttempts = async (req: Request, res: Response) => {
  const attempts = await QuizAttempt.find({ user: req.params.userId }).populate('question');
  res.json(attempts);
};