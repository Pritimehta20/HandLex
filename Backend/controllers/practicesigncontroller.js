import PracticeSummary from '../models/practiceSummarySchema.js';

export const savePracticeSummary = async (req, res) => {
  try {
    const { userId, avgScore, weakSigns = [], skippedSigns = [], lastUpdated } = req.body;

    console.log('📥 savePracticeSummary body:', req.body);

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const saved = await PracticeSummary.findOneAndUpdate(
      { userId },
      {
        userId,
        avgScore,
        weakSigns,
        skippedSigns,
        lastUpdated: lastUpdated || new Date(),
      },
      { new: true, upsert: true }
    );

    console.log('✅ saved PracticeSummary:', saved);

    res.json({ success: true, summary: saved });
  } catch (error) {
    console.error('Save practice summary error:', error);
    res.status(500).json({ success: false, error: 'Failed to save practice summary' });
  }
};

export const getPracticeSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    const summary = await PracticeSummary.findOne({ userId }).sort({ updatedAt: -1 });

    res.json({ success: true, summary: summary || null });
  } catch (error) {
    console.error('Get practice summary error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch practice summary' });
  }
};