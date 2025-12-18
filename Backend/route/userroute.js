import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
   searchUsers,
  deleteUser,
} from '../controllers/user.controller.js';

const userrouter = express.Router();

userrouter.post('/register', registerUser);      // User registration
userrouter.post('/login', loginUser);            // User login
userrouter.get('/profile/:userId', getUserProfile);       // Get user profile by ID
userrouter.put('/profile/:userId', updateUserProfile); 
userrouter.get('/search', searchUsers);
userrouter.delete('/profile/:userId', deleteUser);        // Delete user account

export default userrouter;
