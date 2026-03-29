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
    forgotPassword: {
        url: '/api/users/forgot-password',
        method: 'POST'
    },
    verifyOTP: {
        url: '/api/users/verify-otp',
        method: 'POST'
    },
    resetPassword: {
        url: '/api/users/reset-password',
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
   googleLogin: {
        url: '/api/users/google-login',
        method: 'POST'
    },
     lessonProgress: {
        url: '/api/lesson/progress',
        method: 'POST'
    },
    lessonProgressGet: {
        url: '/api/lesson/progress',
        method: 'GET'
    }
    ,
     generateQuiz: {
    url: '/api/quiz/generate',
    method: 'POST',
  },
  submitQuiz: {
    url: '/api/quiz/submit',
    method: 'POST',
  },
  getQuizResults: {
    url: '/api/quiz/results',
    method: 'GET',
  },
 getGlobalLeaderboard: 
 { 
  url: '/api/quiz/global-leaderboard', 
  method: 'GET' 
},
 savePracticeSummary: {
    url: '/api/practice-summary',
    method: 'POST',
  },

  getPracticeSummary: {
    url: '/api/practice-summary',
    method: 'GET',
  },


}
export default SummaryApi;