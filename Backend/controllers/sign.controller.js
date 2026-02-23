import signModel from '../models/signModel.js';
import categoryModel from '../models/categoryModel.js';

export const listSigns = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const signs = await signModel.find(filter).sort({ createdAt: -1 });
    res.json({ signs });
  } catch (err) {
    console.error('List signs error', err);
    res.status(500).json({ error: 'Failed to fetch signs' });
  }
};

export const getSign = async (req, res) => {
  try {
    const sign = await signModel.findById(req.params.id);
    if (!sign) return res.status(404).json({ error: 'Sign not found' });
    res.json({ sign });
  } catch (err) {
    console.error('Get sign error', err);
    res.status(400).json({ error: 'Invalid sign id' });
  }
};

export const getCategories = async (req, res) => {
  try {
    // Prefer explicit categories collection (with cover images) if it exists
    const catDocs = await categoryModel.find({}).sort({ name: 1 }).lean();
    if (catDocs && catDocs.length > 0) {
      // Map to consistent shape
      const mapped = catDocs.map(c => ({ name: c.name, coverUrl: c.coverUrl }));
      return res.json({ categories: mapped });
    }

    // Fallback to distinct names from signs
    const categories = await signModel.distinct('category');
    res.json({ categories: categories.sort().map(c => ({ name: c })) });
  } catch (err) {
    console.error('Get categories error', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getSignsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const signs = await signModel.find({ category }).sort({ createdAt: -1 });
    res.json({ signs, category });
  } catch (err) {
    console.error('Get signs by category error', err);
    res.status(500).json({ error: 'Failed to fetch signs' });
  }
};

export default { listSigns, getSign, getCategories, getSignsByCategory };
