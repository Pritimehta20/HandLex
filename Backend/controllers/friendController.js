// controllers/friendController.js
import userModel from '../models/userModel.js';
import FriendRequest from '../models/FriendRequest.js';
import Friend from '../models/Friend.js';

/**
 * Helper: check if two users are already friends
 */
const areFriends = async (userIdA, userIdB) => {
  const existing = await Friend.findOne({
    $or: [
      { userA: userIdA, userB: userIdB },
      { userA: userIdB, userB: userIdA },
    ],
  });
  return !!existing;
};

/**
 * POST /api/friends/request
 * body: { fromUserId, toUserId }
 */
export const sendFriendRequest = async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    if (!fromUserId || !toUserId) {
      return res.status(400).json({ error: 'fromUserId and toUserId are required.' });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ error: 'You cannot send a friend request to yourself.' });
    }

    const [fromUser, toUser] = await Promise.all([
      userModel.findById(fromUserId),
      userModel.findById(toUserId),
    ]);

    if (!fromUser || !toUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // already friends?
    if (await areFriends(fromUserId, toUserId)) {
      return res.status(400).json({ error: 'You are already friends.' });
    }

    // check if there is already a pending request in either direction
    const existingPending = await FriendRequest.findOne({
      $or: [
        { fromUser: fromUserId, toUser: toUserId, status: 'pending' },
        { fromUser: toUserId, toUser: fromUserId, status: 'pending' },
      ],
    });

    if (existingPending) {
      return res.status(400).json({ error: 'A pending request already exists.' });
    }

    const fr = new FriendRequest({
      fromUser: fromUserId,
      toUser: toUserId,
      status: 'pending',
    });

    const saved = await fr.save();

    return res.status(201).json({
      message: 'Friend request sent.',
      requestId: saved._id,
    });
  } catch (err) {
    console.error('Error sending friend request:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/friends/requests?userId=...
 * returns incoming + outgoing pending requests for this user
 */
export const listFriendRequests = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId query param is required.' });
    }

    // incoming: requests where this user is the target
    const incoming = await FriendRequest.find({
      toUser: userId,
      status: 'pending',
    })
      .populate('fromUser', 'name email avatar')
      .sort({ createdAt: -1 });

    // outgoing: requests this user has sent
    const outgoing = await FriendRequest.find({
      fromUser: userId,
      status: 'pending',
    })
      .populate('toUser', 'name email avatar')
      .sort({ createdAt: -1 });

    return res.json({
      incoming,
      outgoing,
    });
  } catch (err) {
    console.error('Error listing friend requests:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/friends/requests/:id/respond
 * body: { userId, action: "accept" | "reject" }
 */
export const respondToFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, action } = req.body;

    if (!userId || !action) {
      return res.status(400).json({ error: 'userId and action are required.' });
    }

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action.' });
    }

    const request = await FriendRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Friend request not found.' });
    }

    if (request.toUser.toString() !== userId) {
      return res.status(403).json({ error: 'You are not allowed to respond to this request.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request is not pending.' });
    }

    if (action === 'reject') {
      request.status = 'rejected';
      await request.save();
      return res.json({ message: 'Friend request rejected.' });
    }

    // accept
    request.status = 'accepted';
    await request.save();

    // ensure not already friends
    if (!(await areFriends(request.fromUser, request.toUser))) {
      const friendship = new Friend({
        userA: request.fromUser,
        userB: request.toUser,
      });
      await friendship.save();
    }

    return res.json({ message: 'Friend request accepted.' });
  } catch (err) {
    console.error('Error responding to friend request:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/friends?userId=...
 * list all friends for userId
 */
export const listFriends = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId query param is required.' });
    }

    const friendships = await Friend.find({
      $or: [{ userA: userId }, { userB: userId }],
    })
      .populate('userA', 'name email avatar')
      .populate('userB', 'name email avatar')
      .sort({ createdAt: -1 });

    // map to "the other user"
    const friends = friendships.map((f) => {
      const other =
        f.userA._id.toString() === userId.toString() ? f.userB : f.userA;
      return {
        id: other._id,
        name: other.name,
        email: other.email,
        avatar: other.avatar || null,
        since: f.createdAt,
      };
    });

    return res.json({ friends });
  } catch (err) {
    console.error('Error listing friends:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
