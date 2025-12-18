// models/Friend.js
import mongoose from 'mongoose';

const FriendSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// optional: avoid duplicate friendships (A-B, B-A)
FriendSchema.index(
  {
    userA: 1,
    userB: 1,
  },
  { unique: true }
);

const Friend = mongoose.model('Friend', FriendSchema);
export default Friend;
