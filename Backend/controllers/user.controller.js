import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, preferredLanguage } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      passwordHash,
      preferredLanguage
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      userId: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      preferredLanguage: savedUser.preferredLanguage
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login user (simple version: email + password check)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) return res.status(400).json({ error: 'Invalid email or password' });

    // For now, just return user basic details; extend with JWT later
    res.json({
      message: 'Login successful',
      userId: user._id,
      name: user.name,
      email: user.email,
      preferredLanguage: user.preferredLanguage
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get profile by userId param
export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
};

// Update profile (can update bookmarks, preferred language, etc.)
export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(updates.password, salt);
      delete updates.password;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.userId,
      updates,
      { new: true, runValidators: true, context: 'query' }
    ).select('-passwordHash');

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User profile updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ error: 'Failed to update profile', details: error.message });
  }
};

// GET /api/users/search?q=...
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ users: [] });
    }

    const regex = new RegExp(q.trim(), 'i'); // case-insensitive
    const users = await userModel
      .find({
        $or: [{ name: regex }, { email: regex }],
      })
      .select('name email'); // do not send passwordHash

    res.json({ users });
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Delete user by userId
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.userId);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete user' });
  }
};
