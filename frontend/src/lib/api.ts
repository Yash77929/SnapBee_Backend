import { User, Post, Story, Comment, SignupDto, LoginDto, MessageResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://snaphive.onrender.com';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  timeout: number = 30000
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const raw = await response.text();
      let message = raw;

      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { message?: string; error?: string };
          message = parsed.message || parsed.error || raw;
        } catch {
          message = raw;
        }
      }

      throw new ApiError(message || 'Something went wrong', response.status);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. The server may be waking up - please try again.');
    }
    throw err;
  }
}

// Auth APIs
export const authApi = {
  signup: (data: SignupDto) =>
    fetchApi<MessageResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: async (data: LoginDto): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const raw = await response.text();
        let message = raw;

        if (raw) {
          try {
            const parsed = JSON.parse(raw) as { message?: string; error?: string };
            message = parsed.message || parsed.error || raw;
          } catch {
            message = raw;
          }
        }

        throw new ApiError(message || 'Login failed', response.status);
      }

      return await response.text();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Request timed out. The server may be waking up - please try again.');
      }
      throw err;
    }
  },
};

// User APIs
export const userApi = {
  getCurrentUser: () => fetchApi<User>('/api/users/req'),

  getUserById: (id: number) => fetchApi<User>(`/api/users/id/${id}`),

  getUserByUsername: (username: string) => fetchApi<User>(`/api/users/username/${username}`),

  searchUsers: (query: string) => fetchApi<User[]>(`/api/users/search?q=${query}`),

  followUser: (userId: number) =>
    fetchApi<MessageResponse>(`/api/users/follow/${userId}`, { method: 'PUT' }),

  unfollowUser: (userId: number) =>
    fetchApi<MessageResponse>(`/api/users/unfollow/${userId}`, { method: 'PUT' }),

  updateUser: (userId: number, data: Partial<User>) =>
    fetchApi<User>(`/api/users/update/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Post APIs
export const postApi = {
  createPost: (data: { caption: string; image: string; location?: string }) =>
    fetchApi<Post>('/posts/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getPostsByUserId: (userId: number) => fetchApi<Post[]>(`/posts/all/${userId}`),

  getPostsByUserIds: (userIds: number[]) =>
    fetchApi<Post[]>(`/posts/following/${userIds.join(',')}`),

  getPostById: (postId: number) => fetchApi<Post>(`/posts/${postId}`),

  likePost: (postId: number) =>
    fetchApi<Post>(`/posts/like/${postId}`, { method: 'PUT' }),

  unlikePost: (postId: number) =>
    fetchApi<Post>(`/posts/unlike/${postId}`, { method: 'PUT' }),

  deletePost: (postId: number) =>
    fetchApi<MessageResponse>(`/posts/delete/${postId}`, { method: 'DELETE' }),

  savePost: (postId: number) =>
    fetchApi<MessageResponse>(`/posts/save/${postId}`, { method: 'PUT' }),

  unsavePost: (postId: number) =>
    fetchApi<MessageResponse>(`/posts/unsave/${postId}`, { method: 'PUT' }),
};

// Story APIs
export const storyApi = {
  createStory: (data: { image: string; caption?: string }) =>
    fetchApi<Story>('/api/story/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStoriesByUserId: (userId: number) => fetchApi<Story[]>(`/api/story/${userId}`),
};

// Comment APIs
export const commentApi = {
  createComment: (postId: number, data: { content: string }) =>
    fetchApi<Comment>(`/api/comments/create/${postId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCommentById: (commentId: number) => fetchApi<Comment>(`/api/comments/${commentId}`),

  likeComment: (commentId: number) =>
    fetchApi<Comment>(`/api/comments/like/${commentId}`, { method: 'PUT' }),

  unlikeComment: (commentId: number) =>
    fetchApi<Comment>(`/api/comments/unlike/${commentId}`, { method: 'PUT' }),
};
