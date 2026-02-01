import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const postService = {
  getPosts: async () => {
    const response = await api.get('/api/posts');
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/api/posts/${id}`);
    return response.data;
  },

  createPost: async (formData) => {
    const response = await api.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.post(`/api/posts/${postId}/like`);
    return response.data;
  },

  unlikePost: async (postId) => {
    const response = await api.delete(`/api/posts/${postId}/like`);
    return response.data;
  },

  addComment: async (postId, comment) => {
    const response = await api.post(`/api/posts/${postId}/comments`, { comment });
    return response.data;
  },

  getComments: async (postId) => {
    const response = await api.get(`/api/posts/${postId}/comments`);
    return response.data;
  },
};

export const userService = {
  getProfile: async (username) => {
    const response = await api.get(`/api/users/${username}`);
    return response.data;
  },

  getUserPosts: async (username) => {
    const response = await api.get(`/api/users/${username}/posts`);
    return response.data;
  },
};