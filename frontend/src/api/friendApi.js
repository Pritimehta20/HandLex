// src/api/friendApi.js
import SummaryApi, { baseUrl } from '../Common/SummaryApi';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function apiSendFriendRequest(fromUserId, toUserId) {
  const res = await fetch(baseUrl + SummaryApi.sendFriendRequest.url, {
    method: SummaryApi.sendFriendRequest.method,
    headers: jsonHeaders,
    body: JSON.stringify({ fromUserId, toUserId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send friend request');
  return data;
}

export async function apiGetFriendRequests(userId) {
  const url =
    baseUrl +
    SummaryApi.listFriendRequests.url +
    `?userId=${encodeURIComponent(userId)}`;

  const res = await fetch(url, {
    method: SummaryApi.listFriendRequests.method,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load friend requests');
  return data; // { incoming, outgoing }
}

export async function apiRespondFriendRequest(requestId, userId, action) {
  const url =
    baseUrl + SummaryApi.respondFriendRequest.url + `/${requestId}/respond`;

  const res = await fetch(url, {
    method: SummaryApi.respondFriendRequest.method,
    headers: jsonHeaders,
    body: JSON.stringify({ userId, action }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to respond');
  return data;
}

export async function apiGetFriends(userId) {
  const url =
    baseUrl +
    SummaryApi.listFriends.url +
    `?userId=${encodeURIComponent(userId)}`;

  const res = await fetch(url, {
    method: SummaryApi.listFriends.method,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load friends');
  return data.friends || [];
}
