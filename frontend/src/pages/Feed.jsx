import React, { useState, useEffect } from 'react';
import { postService } from '../services/apiService';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await postService.getPosts();
      // Handle both array and object with posts property
      const postsArray = Array.isArray(data) ? data : (data.posts || []);
      setPosts(postsArray);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="feed-page">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Feed</h1>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12" data-testid="loading-state">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insta-pink mb-4"></div>
            <p className="text-gray-600">Loading posts...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center" data-testid="error-state">
            {error}
            <button
              onClick={fetchPosts}
              className="block mx-auto mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12" data-testid="empty-state">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h2>
            <p className="text-gray-600 mb-4">Be the first to share a moment!</p>
            <a
              href="/create"
              className="inline-block px-6 py-3 bg-gradient-to-r from-insta-purple to-insta-pink text-white rounded-lg font-semibold hover:opacity-90 transition"
            >
              Create Your First Post
            </a>
          </div>
        )}

        {/* Posts List */}
        {!loading && !error && posts.length > 0 && (
          <div className="space-y-6" data-testid="posts-list">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;