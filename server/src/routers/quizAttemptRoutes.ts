import { Router } from 'express';
import { submitAttempt, getAttempts } from '../controllers/quizAttemptController';
const attemptRouter = Router();
attemptRouter.post('/', submitAttempt);
attemptRouter.get('/:userId', getAttempts);
export default attemptRouter;
