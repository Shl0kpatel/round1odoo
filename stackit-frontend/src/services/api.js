import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
};

// Questions API
export const questionsAPI = {
  getQuestions: (params) => api.get('/questions', { params }),
  getQuestion: (id) => api.get(`/questions/${id}`),
  createQuestion: (questionData) => api.post('/questions', questionData),
  updateQuestion: (id, questionData) => api.put(`/questions/${id}`, questionData),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
  voteQuestion: (id, voteType) => api.post(`/questions/${id}/vote`, { voteType }),
};

// Answers API
export const answersAPI = {
  createAnswer: (answerData) => api.post('/answers', answerData),
  updateAnswer: (id, answerData) => api.put(`/answers/${id}`, answerData),
  deleteAnswer: (id) => api.delete(`/answers/${id}`),
  voteAnswer: (id, voteType) => api.post(`/answers/${id}/vote`, { voteType }),
  acceptAnswer: (id) => api.post(`/answers/${id}/accept`),
  addComment: (id, content) => api.post(`/answers/${id}/comments`, { content }),
  deleteComment: (answerId, commentId) => api.delete(`/answers/${answerId}/comments/${commentId}`),
};

// Users API
export const usersAPI = {
  getProfile: (username) => api.get(`/users/profile/${username}`),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getUsers: (params) => api.get('/users', { params }),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  updateUserStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Tags API
export const tagsAPI = {
  getTags: (params) => api.get('/tags', { params }),
  getPopularTags: (params) => api.get('/tags/popular', { params }),
  createTag: (tagData) => api.post('/tags', tagData),
  updateTag: (id, tagData) => api.put(`/tags/${id}`, tagData),
  deleteTag: (id) => api.delete(`/tags/${id}`),
};

export default api;
