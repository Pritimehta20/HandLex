import express from 'express';
import {
  savePracticeSummary,
  getPracticeSummary,
} from '../controllers/practicesigncontroller.js';

const practicesignrouter = express.Router();

// Save or update user's latest practice summary
practicesignrouter.post('/practice-summary', savePracticeSummary);

// Get user's latest practice summary
practicesignrouter.get('/practice-summary/:userId', getPracticeSummary);

export default practicesignrouter;