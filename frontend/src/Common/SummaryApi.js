export const baseUrl = 'http://localhost:8080'

const SummaryApi = {
    register: {
        url: '/api/users/register',
        method: 'POST'
    },
    login: {
        url: '/api/users/login',
        method: 'POST'
    },
    signStatus: {
        url: '/api/sign-status',
        method: 'GET'
    },
    textToSign: {
        url: '/api/text-to-sign',
        method: 'POST'
    },
     searchUsers: {
    url: '/api/users/search', // + ?q=
    method: 'GET',
  },
     sendFriendRequest: {
    url: '/api/friends/request',
    method: 'POST',
  },
  listFriendRequests: {
    url: '/api/friends/requests', // + ?userId=
    method: 'GET',
  },
  respondFriendRequest: {
    url: '/api/friends/requests', // + /:id/respond
    method: 'POST',
  },
  listFriends: {
    url: '/api/friends', // + ?userId=
    method: 'GET',
  },
}
export default SummaryApi;