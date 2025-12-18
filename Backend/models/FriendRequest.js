// models/FriendRequest.js
import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// prevent duplicate pending requests between same pair (same direction)
FriendRequestSchema.index(
  { fromUser: 1, toUser: 1, status: 1 },
  { unique: false }
);

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);
export default FriendRequest;
