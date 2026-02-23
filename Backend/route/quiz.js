// Backend/route/quiz.js - ES6 VERSION (connects to controllers/quizController.js)
import express from 'express';
import { 
  generateQuiz, 
  submitQuiz, 
  getLessons, 
  searchSigns, 
  getCategory,
  hardcodedSigns  // ✅ Import signs data directly
} from '../controllers/quizController.js';

const router = express.Router();

console.log('✅ Quiz Routes Loading...');

// 🎯 NEW: Generate 15 SHUFFLED questions from MULTIPLE completed lessons
// 🎯 FIXED: 15 questions OR "Complete lessons first!" message
const generateMultiLessonQuiz = async (req, res) => {
  try {
    const { completedLessons = [], maxQuestions = 15 } = req.body;
    
    console.log('🎯 Multi-lesson quiz:', { completedLessons, maxQuestions });
    
    // ✅ NO LESSONS? Return LOCK message
    if (!completedLessons || completedLessons.length === 0) {
      return res.json({
        success: true,
        questions: [],
        message: "Complete at least one lesson first to unlock quiz!",
        availableLessons: 0,
        stats: { usedLessons: completedLessons }
      });
    }

    // ✅ FILTER: Only completed lessons
    const availableSigns = [];
    completedLessons.forEach(lesson => {
      if (hardcodedSigns[lesson]) {
        availableSigns.push(...hardcodedSigns[lesson]);
      }
    });

    if (availableSigns.length === 0) {
      return res.json({
        success: true,
        questions: [],
        message: "No signs available in completed lessons. Complete lessons first!",
        availableLessons: 0,
        stats: { usedLessons: completedLessons }
      });
    }

    console.log(`✅ ${availableSigns.length} signs from ${completedLessons.length} lessons`);

    // ✅ Generate questions (unchanged logic)
    const questions = [];
    const usedSigns = new Set();
    
    while (questions.length < maxQuestions && availableSigns.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableSigns.length);
      const correctSign = availableSigns[randomIndex];
      
      if (usedSigns.has(correctSign.gloss)) {
        availableSigns.splice(randomIndex, 1);
        continue;
      }

      const sameLessonSigns = hardcodedSigns[correctSign.lesson]
        .filter(sign => sign.gloss !== correctSign.gloss);
      const distractors = [];
      
      while (distractors.length < 3 && sameLessonSigns.length > 0) {
        const distractorIndex = Math.floor(Math.random() * sameLessonSigns.length);
        const distractor = sameLessonSigns.splice(distractorIndex, 1)[0];
        if (!usedSigns.has(distractor.gloss)) {
          distractors.push(distractor);
        }
      }

      const otherSigns = availableSigns.filter(s => 
        s.gloss !== correctSign.gloss && !usedSigns.has(s.gloss)
      );
      while (distractors.length < 3 && otherSigns.length > 0) {
        const fillerIndex = Math.floor(Math.random() * otherSigns.length);
        distractors.push(otherSigns[fillerIndex]);
        otherSigns.splice(fillerIndex, 1);
      }

      const options = [correctSign, ...distractors.slice(0, 3)]
        .sort(() => Math.random() - 0.5);

      questions.push({
        questionId: Date.now() + Math.random(),
        mediaUrl: correctSign.mediaUrl,
        mediaType: correctSign.mediaType,
        correctAnswer: correctSign.gloss,
        options: options.map(sign => sign.gloss),
        lesson: correctSign.lesson
      });

      usedSigns.add(correctSign.gloss);
      availableSigns.splice(randomIndex, 1);
    }

    console.log(`✅ Generated ${questions.length} questions`);

    res.json({
      success: true,
      questions,
      lessonsUsed: completedLessons,
      totalSignsAvailable: availableSigns.length + questions.length
    });

  } catch (error) {
    console.error('Multi-lesson quiz error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate quiz' });
  }
};


// 📋 ROUTES - Connect endpoints to controller functions
router.post('/generate', generateMultiLessonQuiz);  // ✅ NEW: 15 questions from completed lessons
router.post('/submit', submitQuiz);
router.get('/lessons', getLessons);        // 🎯 Frontend expects THIS
router.get('/search', searchSigns);
router.get('/category/:lesson', getCategory);

// 🔍 Optional: Additional quiz endpoints
router.get('/stats', getLessons);          // Reuse lessons for stats
router.post('/batch-generate', generateMultiLessonQuiz); // Bulk generation (15 questions)

console.log('✅ Quiz Routes Ready: /lessons, /generate(15 questions!), /submit');
export default router;
