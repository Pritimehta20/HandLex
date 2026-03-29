// models/quizResultModel.js
import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    userName: {
      type: String,
      default: 'Student',
      trim: true,
    },

    lesson: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
      index: true,
    },

    grade: {
      type: String,
      required: true,
    },

    completedLessons: {
      type: [String],
      default: [],
    },

   answers: [
  {
    questionId: { type: String, default: null },
    selectedAnswer: { type: String, default: null },
    correctAnswer: { type: String, default: null },
    isCorrect: { type: Boolean, default: false },
    lesson: { type: String, default: '' },
  },
],
  },
  { timestamps: true }
);

quizResultSchema.index({ userId: 1, percentage: -1, score: -1, createdAt: -1 });

export default mongoose.model('QuizResult', quizResultSchema);