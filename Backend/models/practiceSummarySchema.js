import mongoose from 'mongoose';

const weakSignSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    score: Number,
  },
  { _id: false }
);

const practiceSummarySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    avgScore: Number,
    weakSigns: [weakSignSchema],
    skippedSigns: [weakSignSchema],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('PracticeSummary', practiceSummarySchema);