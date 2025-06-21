import { Router } from 'express';
import { updateProgress, getProgress } from '../controllers/studentProgressController';
const progressRouter = Router();
progressRouter.post('/', updateProgress);
progressRouter.get('/:userId', getProgress);
export default progressRouter;