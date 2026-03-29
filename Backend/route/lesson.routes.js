// routes/lesson.routes.js
import { saveLessonProgress, getLessonProgress } from '../controllers/lesson.controller.js';
import { verifyUser } from '../middleware/auth.js';
import { Router } from 'express';


const Lessonrouter = Router();

Lessonrouter.post('/progress', verifyUser, saveLessonProgress);
Lessonrouter.get('/progress', verifyUser, getLessonProgress);

export default Lessonrouter;
