// routes/lesson.routes.js
import { saveLessonProgress, getLessonProgress } from '../controllers/lesson.controller.js';
import { verifyUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/progress', verifyUser, saveLessonProgress);
router.get('/progress', verifyUser, getLessonProgress);

export default router;
