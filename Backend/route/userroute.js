import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  searchUsers,
  deleteUser,
  requestPasswordReset,
  verifyOTP,
  resetPassword,
  googleLogin,
} from '../controllers/user.controller.js';

const userrouter = express.Router();

userrouter.post('/register', registerUser);   
userrouter.post('/google-login', googleLogin);   // User registration
userrouter.post('/login', loginUser);            // User login
userrouter.get('/profile/:userId', getUserProfile);       // Get user profile by ID
userrouter.put('/profile/:userId', updateUserProfile); 
userrouter.get('/search', searchUsers);
userrouter.delete('/profile/:userId', deleteUser);        // Delete user account

// Forgot password routes
userrouter.post('/forgot-password', requestPasswordReset);  // Request OTP
userrouter.post('/verify-otp', verifyOTP);                  // Verify OTP
userrouter.post('/reset-password', resetPassword);          // Reset password with verified OTP

export default userrouter;
