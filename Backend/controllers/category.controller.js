import categoryModel from '../models/categoryModel.js';

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Category name required' });

    const existing = await categoryModel.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ error: 'Category already exists' });

    let coverUrl = undefined;
    if (req.file) {
      coverUrl = `/uploads/${req.file.filename}`;
    }

    const created = await categoryModel.create({
      name: name.trim(),
      coverUrl,
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json({ message: 'Category created', category: created });
  } catch (err) {
    console.error('Create category error', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const listCategories = async (req, res) => {
  try {
    const cats = await categoryModel.find({}).sort({ name: 1 }).lean();
    // return array of objects { name, coverUrl }
    res.json({ categories: cats });
  } catch (err) {
    console.error('List categories error', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await categoryModel.findById(id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });

    // Remove category doc
    await categoryModel.findByIdAndDelete(id);

    // Move signs in this category to default 'Common'
    const signModel = (await import('../models/signModel.js')).default;
    await signModel.updateMany({ category: cat.name }, { $set: { category: 'Common' } });

    res.json({ message: 'Category deleted and signs reassigned to Common' });
  } catch (err) {
    console.error('Delete category error', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

export default { createCategory, listCategories };
