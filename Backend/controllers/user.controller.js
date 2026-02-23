import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { generateOTP, sendOTPEmail } from '../utils/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


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

//  register with goggle 
export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    // Find existing user or create new one
    let user = await userModel.findOne({ 
      $or: [{ email }, { googleId }] 
    });

    if (!user) {
      // Create new user (no password required)
      user = new userModel({
        name,
        email,
        googleId,
        profilePicture: picture || null,
        preferredLanguage: 'en'
      });
      await user.save();
    } else if (!user.googleId) {
      // Link existing account to Google
      user.googleId = googleId;
      user.name = name;
      user.profilePicture = picture || user.profilePicture;
      await user.save();
    }

    // Generate JWT token (same as regular login)
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Google login successful',
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false,
      preferredLanguage: user.preferredLanguage
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
};

// Login user with JWT token
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) return res.status(400).json({ error: 'Invalid email or password' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
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

// Request password reset - Send OTP to email
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User with this email not found' });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Update user with OTP
    user.resetOTP = otp;
    user.resetOTPExpires = otpExpires;
    await user.save();

    // Send OTP to email
    await sendOTPEmail(email, otp);

    res.json({
      message: 'OTP sent to your email. Check your inbox.',
      email: email.replace(/(.{2})(.*)(.{2})/, '$1****$3'), // Mask email for security
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ error: error.message || 'Failed to send OTP' });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if OTP matches and is not expired
    if (user.resetOTP !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date() > user.resetOTPExpires) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // OTP verified
    res.json({
      message: 'OTP verified successfully',
      verified: true,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// Reset password with verified OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify OTP one more time
    if (user.resetOTP !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date() > user.resetOTPExpires) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password and clear OTP
    user.passwordHash = passwordHash;
    user.resetOTP = null;
    user.resetOTPExpires = null;
    await user.save();

    res.json({
      message: 'Password reset successfully',
      email: user.email,
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
