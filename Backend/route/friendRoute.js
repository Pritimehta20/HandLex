// route/friendRoute.js
import express from 'express';
import {
  sendFriendRequest,
  listFriendRequests,
  respondToFriendRequest,
  listFriends,
} from '../controllers/friendController.js';

const frouter = express.Router();

// send a friend request
frouter.post('/request', sendFriendRequest);

// get incoming + outgoing pending requests for a user
frouter.get('/requests', listFriendRequests);

// accept / reject a specific request
frouter.post('/requests/:id/respond', respondToFriendRequest);

// list friends for a user
frouter.get('/', listFriends);

export default frouter;
