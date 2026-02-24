// controllers/lesson.controller.js - NEW
import User from '../models/userModel.js';

export const saveLessonProgress = async (req, res) => {
  try {
    const { userId, completedLessons } = req.body;
    
    if (!userId || !Array.isArray(completedLessons)) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    // Save to user's document
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.completedLessons = completedLessons;
    await user.save();

    res.json({ success: true, completedLessons });
  } catch (err) {
    console.error('Save lesson error:', err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
};

export const getLessonProgress = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const user = await User.findById(userId).select('completedLessons');
    res.json({ 
      completedLessons: user?.completedLessons || [],
      synced: !!user
    });
  } catch (err) {
    console.error('Get lesson error:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};
