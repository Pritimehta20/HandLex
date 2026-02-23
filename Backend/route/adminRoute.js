import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { adminLogin, createSign, updateSign, deleteSign } from '../controllers/admin.controller.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// ensure uploads folder exists
const uploadsPath = path.join(process.cwd(), 'Backend', 'uploads');
fs.mkdirSync(uploadsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).substring(2,8)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

router.post('/login', adminLogin);

// Protected admin CRUD for signs
router.post('/signs', verifyAdmin, upload.single('media'), createSign);
router.put('/signs/:id', verifyAdmin, upload.single('media'), updateSign);
router.delete('/signs/:id', verifyAdmin, deleteSign);

// Admin create category (optional cover upload)
import { createCategory } from '../controllers/category.controller.js';
router.post('/categories', verifyAdmin, upload.single('cover'), createCategory);
router.delete('/categories/:id', verifyAdmin, (req, res, next) => {
  // lazy-load controller to avoid circulars
  import('../controllers/category.controller.js').then(mod => mod.deleteCategory(req, res, next)).catch(next);
});

export default router;
