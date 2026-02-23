import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import signModel from '../models/signModel.js';
import userModel from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    if (!user.isAdmin) return res.status(403).json({ error: 'Admin access required' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, isAdmin: true }, JWT_SECRET, { expiresIn: '8h' });

    res.json({ message: 'Admin login successful', token, userId: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error('Admin login error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new sign (file upload handled by multer in the route)
export const createSign = async (req, res) => {
  try {
    const { gloss, language, category, description, tags, difficulty } = req.body;

    if (!req.file) return res.status(400).json({ error: 'Media file is required' });
    if (!gloss) return res.status(400).json({ error: 'Sign name (gloss) is required' });
    if (!category) return res.status(400).json({ error: 'Category is required' });
    if (!tags || (typeof tags === 'string' && tags.trim() === '')) return res.status(400).json({ error: 'Tags are required' });

    const mediaUrl = `/uploads/${req.file.filename}`;

    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

    const newSign = new signModel({
      gloss,
      language: language || 'ISL',
      category: category.trim(),
      mediaType,
      mediaUrl,
      description,
      difficulty: difficulty || 'easy',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      createdBy: req.user._id
    });

    const saved = await newSign.save();
    res.status(201).json({ message: 'Sign created', sign: saved });
  } catch (err) {
    console.error('Create sign error', err);
    res.status(500).json({ error: 'Failed to create sign' });
  }
};

export const updateSign = async (req, res) => {
  try {
    const sign = await signModel.findById(req.params.id);
    if (!sign) return res.status(404).json({ error: 'Sign not found' });

    // If a new file uploaded, remove old one
    if (req.file) {
      const oldFilename = path.basename(sign.mediaUrl || '');
      const oldPath = path.join(process.cwd(), 'Backend', 'uploads', oldFilename);
      try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
      sign.mediaUrl = `/uploads/${req.file.filename}`;
      sign.mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    }

    const { gloss, language, category, description, tags, difficulty } = req.body;
    if (gloss) sign.gloss = gloss;
    // language is optional on update; preserve existing when omitted
    if (language) sign.language = language;
    if (category) sign.category = category.trim();
    if (description) sign.description = description;
    if (difficulty) sign.difficulty = difficulty;
    if (typeof tags === 'undefined' || (typeof tags === 'string' && tags.trim() === '')) {
      return res.status(400).json({ error: 'Tags are required' });
    }
    if (tags) sign.tags = Array.isArray(tags) ? tags : tags.split(',').map(t=>t.trim());

    const updated = await sign.save();
    res.json({ message: 'Sign updated', sign: updated });
  } catch (err) {
    console.error('Update sign error', err);
    res.status(500).json({ error: 'Failed to update sign' });
  }
};

export const deleteSign = async (req, res) => {
  try {
    const sign = await signModel.findById(req.params.id);
    if (!sign) return res.status(404).json({ error: 'Sign not found' });

    const filename = path.basename(sign.mediaUrl || '');
    const filePath = path.join(process.cwd(), 'Backend', 'uploads', filename);
    try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }

    await signModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sign deleted' });
  } catch (err) {
    console.error('Delete sign error', err);
    res.status(500).json({ error: 'Failed to delete sign' });
  }
};

export default {
  adminLogin,
  createSign,
  updateSign,
  deleteSign
};
