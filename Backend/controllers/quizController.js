// controllers/quizController.js - COMPLETE ES6 VERSION (118 SIGNS)

// 🎯 COMPLETE hardcodedSigns - ALL 9 Components (118 signs)
export const hardcodedSigns = {
  // 🔤 ALPHABET (26 signs)
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(ch => ({
    gloss: ch,
    mediaUrl: `/lessons/alphabets/${ch.toLowerCase()}.png`,
    mediaType: 'image',
    lesson: 'alphabet'
  })),

  // 🌈 COLORS (10 signs)
  colors: [
    { gloss: 'RED', mediaUrl: '/lessons/Colors/red.gif', mediaType: 'image', lesson: 'colors' },
    { gloss: 'BLUE', mediaUrl: '/lessons/Colors/blue.gif', mediaType: 'image', lesson: 'colors' },
    { gloss: 'GREEN', mediaUrl: '/lessons/Colors/green.gif', mediaType: 'image', lesson: 'colors' },
    { gloss: 'YELLOW', mediaUrl: '/lessons/Colors/yellow.gif', mediaType: 'image', lesson: 'colors' },
    { gloss: 'BLACK', mediaUrl: '/lessons/Colors/black.gif', mediaType: 'image', lesson: 'colors' },
    { gloss: 'GRAY', mediaUrl: '/lessons/Colors/gray.gif', mediaType: 'image', lesson: 'colors' },
    { gloss: 'ORANGE', mediaUrl: '/lessons/Colors/orange.gif', mediaType: 'image', lesson: 'colors' },
    { gloss: 'PINK', mediaUrl: '/lessons/Colors/pink.gif', mediaType: 'image', lesson: 'colors' },
    { gloss: 'TAN', mediaUrl: '/lessons/Colors/tan.gif', mediaType: 'image', lesson: 'colors' },
    { gloss: 'WHITE', mediaUrl: '/lessons/Colors/white.gif', mediaType: 'image', lesson: 'colors' }
  ],

  // 🔥 SENSATIONS (13 signs)
  sensations: [
    { gloss: 'COLD', mediaUrl: '/lessons/Sensation/cold.gif', mediaType: 'image', lesson: 'sensations' },
    { gloss: 'COOL', mediaUrl: '/lessons/Sensation/cool.gif', mediaType: 'image', lesson: 'sensations' },
    { gloss: 'HOT', mediaUrl: '/lessons/Sensation/hot.gif', mediaType: 'image', lesson: 'sensations' },
    { gloss: 'HUNGRY', mediaUrl: '/lessons/Sensation/hungry.gif', mediaType: 'image', lesson: 'sensations' },
    { gloss: 'THIRSTY', mediaUrl: '/lessons/Sensation/thirsty.gif', mediaType: 'image', lesson: 'sensations' },
    { gloss: 'FEVER', mediaUrl: '/lessons/Sensation/fever.gif', mediaType: 'image', lesson: 'sensations' },
    { gloss: 'SICK', mediaUrl: '/lessons/Sensation/sick.gif', mediaType: 'image', lesson: 'sensations' },
    { gloss: 'COUGH', mediaUrl: '/lessons/Sensation/cough.gif', mediaType: 'image', lesson: 'sensations' },
    { gloss: 'SORETHROAT', mediaUrl: '/lessons/Sensation/sorethrought.gif', mediaType: 'image', lesson: 'sensations' },
    { gloss: 'BLOODYNOSE', mediaUrl: '/lessons/Sensation/bloodynose.gif', mediaType: 'image', lesson: 'sensations' },
    { gloss: 'EARINFECTION', mediaUrl: '/lessons/Sensation/earinfection.gif', mediaType: 'image', lesson: 'sensations' },
    { gloss: 'SWOLLEN', mediaUrl: '/lessons/Sensation/swollen.gif', mediaType: 'image', lesson: 'sensations' },
    { gloss: 'STRONGWIND', mediaUrl: '/lessons/Sensation/strongwind.gif', mediaType: 'image', lesson: 'sensations' }
  ],

  // 👨‍👩‍👧‍👦 FAMILY/PEOPLE (9 signs)
  people: [
    { gloss: 'MOTHER', mediaUrl: '/lessons/People/mom.gif', mediaType: 'image', lesson: 'people' },
    { gloss: 'FATHER', mediaUrl: '/lessons/People/father.gif', mediaType: 'image', lesson: 'people' },
    { gloss: 'BROTHER', mediaUrl: '/lessons/People/brother.gif', mediaType: 'image', lesson: 'people' },
    { gloss: 'SISTER', mediaUrl: '/lessons/People/sister.gif', mediaType: 'image', lesson: 'people' },
    { gloss: 'WIFE', mediaUrl: '/lessons/People/wife.gif', mediaType: 'image', lesson: 'people' },
    { gloss: 'HUSBAND', mediaUrl: '/lessons/People/husband.gif', mediaType: 'image', lesson: 'people' },
    { gloss: 'BOYFRIEND', mediaUrl: '/lessons/People/bf.gif', mediaType: 'image', lesson: 'people' },
    { gloss: 'PARENTS', mediaUrl: '/lessons/People/parents.gif', mediaType: 'image', lesson: 'people' },
    { gloss: 'GRANDPARENTS', mediaUrl: '/lessons/People/grandparents.gif', mediaType: 'image', lesson: 'people' }
  ],

  // 🍎 FRUITS (14 signs)
  fruits: [
    { gloss: 'APPLE', mediaUrl: '/lessons/Fruits/apple.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'MANGO', mediaUrl: '/lessons/Fruits/mango.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'BANANA', mediaUrl: '/lessons/Fruits/banana.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'CHERRY', mediaUrl: '/lessons/Fruits/cherry.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'WATERMELON', mediaUrl: '/lessons/Fruits/watermelon.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'GRAPES', mediaUrl: '/lessons/Fruits/grapes.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'RASPBERRY', mediaUrl: '/lessons/Fruits/raspberry.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'KIWI', mediaUrl: '/lessons/Fruits/kiwi.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'BLUEBERRY', mediaUrl: '/lessons/Fruits/blueberry.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'GUAVA', mediaUrl: '/lessons/Fruits/gauava.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'ORANGE', mediaUrl: '/lessons/Fruits/orangee.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'PEAR', mediaUrl: '/lessons/Fruits/pear.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'PINEAPPLE', mediaUrl: '/lessons/Fruits/pineapple.gif', mediaType: 'image', lesson: 'fruits' },
    { gloss: 'STRAWBERRY', mediaUrl: '/lessons/Fruits/strawberry.gif', mediaType: 'image', lesson: 'fruits' }
  ],

  // 👋 GREETINGS (7 signs)
  greetings: [
    { gloss: 'GOODMORNING', mediaUrl: '/lessons/Gretings/gm.gif', mediaType: 'image', lesson: 'greetings' },
    { gloss: 'GOODAFTERNOON', mediaUrl: '/lessons/Gretings/gafternoon.gif', mediaType: 'image', lesson: 'greetings' },
    { gloss: 'GOODEVENING', mediaUrl: '/lessons/Gretings/geve.gif', mediaType: 'image', lesson: 'greetings' },
    { gloss: 'GOODNIGHT', mediaUrl: '/lessons/Gretings/gn.gif', mediaType: 'image', lesson: 'greetings' },
    { gloss: 'SEEYOU', mediaUrl: '/lessons/Gretings/seeyou.gif', mediaType: 'image', lesson: 'greetings' },
    { gloss: 'WHATDOING', mediaUrl: '/lessons/Gretings/whatdoing.gif', mediaType: 'image', lesson: 'greetings' },
    { gloss: 'WHATNAME', mediaUrl: '/lessons/Gretings/whatname.gif', mediaType: 'image', lesson: 'greetings' }
  ],

  // 🔢 NUMBERS (10 signs)
  numbers: [
    { gloss: 'ONE', mediaUrl: '/lessons/numbers/one.png', mediaType: 'image', lesson: 'numbers' },
    { gloss: 'TWO', mediaUrl: '/lessons/numbers/two.png', mediaType: 'image', lesson: 'numbers' },
    { gloss: 'THREE', mediaUrl: '/lessons/numbers/three.png', mediaType: 'image', lesson: 'numbers' },
    { gloss: 'FOUR', mediaUrl: '/lessons/numbers/four.png', mediaType: 'image', lesson: 'numbers' },
    { gloss: 'FIVE', mediaUrl: '/lessons/numbers/five.png', mediaType: 'image', lesson: 'numbers' },
    { gloss: 'SIX', mediaUrl: '/lessons/numbers/six.png', mediaType: 'image', lesson: 'numbers' },
    { gloss: 'SEVEN', mediaUrl: '/lessons/numbers/seven.png', mediaType: 'image', lesson: 'numbers' },
    { gloss: 'EIGHT', mediaUrl: '/lessons/numbers/eight.png', mediaType: 'image', lesson: 'numbers' },
    { gloss: 'NINE', mediaUrl: '/lessons/numbers/nine.png', mediaType: 'image', lesson: 'numbers' },
    { gloss: 'TEN', mediaUrl: '/lessons/numbers/ten.png', mediaType: 'image', lesson: 'numbers' }
  ],

  // 💬 COMMON INTERACTIONS (13 signs)
  common_interactions: [
    { gloss: 'HELLO', mediaUrl: '/lessons/Common_interaction/HELLO.png', mediaType: 'image', lesson: 'common_interactions' },
    { gloss: 'OK', mediaUrl: '/lessons/Common_interaction/ok.png', mediaType: 'image', lesson: 'common_interactions' },
    { gloss: 'SORRY', mediaUrl: '/lessons/Common_interaction/Sorry.png', mediaType: 'image', lesson: 'common_interactions' },
    { gloss: 'THANKYOU', mediaUrl: '/lessons/Common_interaction/Thankyou.png', mediaType: 'image', lesson: 'common_interactions' },
    { gloss: 'YOUREWELCOME', mediaUrl: '/lessons/Common_interaction/YouareWelcome.png', mediaType: 'image', lesson: 'common_interactions' },
    { gloss: 'DONE', mediaUrl: '/lessons/Common_interaction/Done.png', mediaType: 'image', lesson: 'common_interactions' },
    { gloss: 'FRIEND', mediaUrl: '/lessons/Common_interaction/Friend.png', mediaType: 'image', lesson: 'common_interactions' },
    { gloss: 'MORE', mediaUrl: '/lessons/Common_interaction/More.png', mediaType: 'image', lesson: 'common_interactions' },
    { gloss: 'ILOVEYOU', mediaUrl: '/lessons/Common_interaction/ILoveYou.png', mediaType: 'image', lesson: 'common_interactions' },
    { gloss: 'HELP', mediaUrl: '/lessons/Common_interaction/Help.png', mediaType: 'image', lesson: 'common_interactions' },
    { gloss: 'PLEASE', mediaUrl: '/lessons/Common_interaction/Please.png', mediaType: 'image', lesson: 'common_interactions' },
    { gloss: 'STOP', mediaUrl: '/lessons/Common_interaction/Stop.png', mediaType: 'image', lesson: 'common_interactions' },
    { gloss: 'WATER', mediaUrl: '/lessons/Common_interaction/Water.png', mediaType: 'image', lesson: 'common_interactions' }
  ],

  // 😊 EMOTIONS (16 signs)
  emotions: [
    { gloss: 'HAPPY', mediaUrl: '/lessons/Emotions/happy.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'SAD', mediaUrl: '/lessons/Emotions/sad.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'EXCITED', mediaUrl: '/lessons/Emotions/excited.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'MAD', mediaUrl: '/lessons/Emotions/mad.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'SHOCKED', mediaUrl: '/lessons/Emotions/shocked.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'PROUD', mediaUrl: '/lessons/Emotions/proud.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'HURT', mediaUrl: '/lessons/Emotions/hurt.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'KIND', mediaUrl: '/lessons/Emotions/kind.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'HATE', mediaUrl: '/lessons/Emotions/hate.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'ANNOYED', mediaUrl: '/lessons/Emotions/annoyed.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'PANICK', mediaUrl: '/lessons/Emotions/panick.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'GREEDY', mediaUrl: '/lessons/Emotions/greedy.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'OBSESSED', mediaUrl: '/lessons/Emotions/obsessed.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'OVERWHELMED', mediaUrl: '/lessons/Emotions/overwhelmed.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'BROKENHEART', mediaUrl: '/lessons/Emotions/brokenheart.gif', mediaType: 'image', lesson: 'emotions' },
    { gloss: 'TOUCHED', mediaUrl: '/lessons/Emotions/touched.gif', mediaType: 'image', lesson: 'emotions' }
  ]
};

// 🧠 Helper Functions
const getAllSigns = () => {
  const allSigns = [];
  Object.values(hardcodedSigns).forEach(category => {
    category.forEach(sign => allSigns.push(sign));
  });
  return allSigns;
};

const generateQuizQuestion = (lesson = null) => {
  let signs;
  if (lesson && hardcodedSigns[lesson]) {
    signs = [...hardcodedSigns[lesson]];
  } else {
    signs = getAllSigns();
  }

  const correctIndex = Math.floor(Math.random() * signs.length);
  const correctAnswer = signs[correctIndex];

  const distractors = [];
  const sameLessonSigns = signs.filter((sign, index) => 
    index !== correctIndex && sign.lesson === correctAnswer.lesson
  );
  
  while (distractors.length < 3 && sameLessonSigns.length > 0) {
    const randomDistractor = sameLessonSigns.splice(
      Math.floor(Math.random() * sameLessonSigns.length), 1
    )[0];
    distractors.push(randomDistractor);
  }

  const allOtherSigns = signs.filter(sign => sign.gloss !== correctAnswer.gloss);
  while (distractors.length < 3) {
    const randomSign = allOtherSigns[Math.floor(Math.random() * allOtherSigns.length)];
    if (!distractors.some(d => d.gloss === randomSign.gloss)) {
      distractors.push(randomSign);
    }
  }

  const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

  return {
    correctAnswer: correctAnswer.gloss,
    options: options.map(sign => sign.gloss),
    mediaUrl: correctAnswer.mediaUrl,
    mediaType: correctAnswer.mediaType,
    lesson: correctAnswer.lesson,
    questionId: Date.now() + Math.random()
  };
};

// 🎯 CONTROLLER FUNCTIONS (FRONTEND COMPATIBLE)
export const generateQuiz = async (req, res) => {
  try {
    const { completedLessons = [], maxQuestions = 15 } = req.body;
    
    // ✅ FILTER: ONLY completed lessons
    const availableSigns = [];
    completedLessons.forEach(lessonId => {
      if (hardcodedSigns[lessonId]) {
        availableSigns.push(...hardcodedSigns[lessonId]);
      }
    });

    // ✅ NO LESSONS? Return empty quiz + message
    if (availableSigns.length === 0) {
      return res.json({
        success: true,
        questions: [],
        message: "Complete at least one lesson first to unlock quiz!",
        availableLessons: 0,
        stats: { usedLessons: completedLessons, totalSignsAvailable: 0 }
      });
    }

    console.log(`📚 Generating quiz for: [${completedLessons.join(', ')}] (${availableSigns.length} signs)`);

    // ✅ Generate from available signs ONLY
    const questions = [];
    for (let i = 0; i < maxQuestions; i++) {
      const signs = [...availableSigns];
      const correctIndex = Math.floor(Math.random() * signs.length);
      const correctAnswer = signs[correctIndex];

      // Prefer same-lesson distractors
      const sameLessonSigns = signs.filter((sign, index) => 
        index !== correctIndex && sign.lesson === correctAnswer.lesson
      );
      let distractors = [];
      
      // Fill distractors from same lesson first
      while (distractors.length < 3 && sameLessonSigns.length > 0) {
        const idx = Math.floor(Math.random() * sameLessonSigns.length);
        distractors.push(sameLessonSigns.splice(idx, 1)[0]);
      }

      // Fill from available signs
      while (distractors.length < 3) {
        const randomSign = availableSigns[Math.floor(Math.random() * availableSigns.length)];
        if (!distractors.some(d => d.gloss === randomSign.gloss) && 
            randomSign.gloss !== correctAnswer.gloss) {
          distractors.push(randomSign);
        }
      }

      const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

      questions.push({
        correctAnswer: correctAnswer.gloss,
        options: options.map(sign => sign.gloss),
        mediaUrl: correctAnswer.mediaUrl,
        mediaType: correctAnswer.mediaType,
        lesson: correctAnswer.lesson,
        questionId: Date.now() + i
      });
    }

    res.json({
      success: true,
      questions,
      totalSigns: availableSigns.length,
      stats: {
        usedLessons: completedLessons,
        totalCategories: completedLessons.length,
        totalSignsUsed: availableSigns.length,
        questionsGenerated: questions.length
      }
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate quiz' });
  }
};


export const submitQuiz = async (req, res) => {
  try {
    const { answers, lesson } = req.body;
    
    const results = answers.map(answer => {
      const question = generateQuizQuestion(lesson);
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        lesson: question.lesson
      };
    });

    const score = results.filter(r => r.isCorrect).length;
    const total = results.length;

    res.json({
      success: true,
      results,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      stats: {
        correct: results.filter(r => r.isCorrect).length,
        incorrect: results.filter(r => !r.isCorrect).length
      }
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ success: false, error: 'Failed to process quiz' });
  }
};

// ✅ CRITICAL: Frontend expects THIS exact format for lessons
export const getLessons = async (req, res) => {
  const lessons = Object.entries(hardcodedSigns).map(([lessonId, signs]) => ({
    id: lessonId,
    name: lessonId.charAt(0).toUpperCase() + lessonId.slice(1).replace(/_/g, ' '),
    completed: false,  // Frontend will update from localStorage
    totalSigns: signs.length,
    progress: 0
  }));

  res.json({
    success: true,
    lessons,
    totalSigns: getAllSigns().length,
    totalLessons: lessons.length,
    breakdown: Object.fromEntries(
      Object.entries(hardcodedSigns).map(([lesson, signs]) => [lesson, signs.length])
    )
  });
};

export const searchSigns = async (req, res) => {
  try {
    const { query, lesson } = req.query;
    let allSigns = getAllSigns();

    if (lesson && hardcodedSigns[lesson]) {
      allSigns = hardcodedSigns[lesson];
    }

    const results = allSigns.filter(sign => 
      sign.gloss.toLowerCase().includes(query?.toLowerCase() || '')
    );

    res.json({
      success: true,
      results,
      total: results.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { lesson } = req.params;
    const signs = hardcodedSigns[lesson] || [];

    res.json({
      success: true,
      lesson,
      signs,
      count: signs.length
    });
  } catch (error) {
    console.error('Category error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch category' });
  }
};

console.log(`✅ Quiz Controller Loaded: ${getAllSigns().length} signs across ${Object.keys(hardcodedSigns).length} lessons`);
