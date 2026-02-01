import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [profileData, userPosts] = await Promise.all([
        userService.getProfile(username),
        userService.getUserPosts(username),
      ]);

      setProfile(profileData);
      // Handle both array and object with posts property
      const postsArray = Array.isArray(userPosts) ? userPosts : (userPosts.posts || []);
      setPosts(postsArray);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-12" data-testid="loading-state">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insta-pink mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center" data-testid="error-state">
            {error}
            <button
              onClick={fetchProfile}
              className="block mx-auto mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="profile-page">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-insta-yellow via-insta-pink to-insta-purple flex items-center justify-center flex-shrink-0">
              <div className="w-30 h-30 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-800">
                  {username?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="profile-username">
                {username}
              </h1>
              {profile?.email && (
                <p className="text-gray-600 mb-4" data-testid="profile-email">{profile.email}</p>
              )}
              
              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-8 mb-4">
                <div className="text-center" data-testid="posts-count">
                  <p className="text-xl font-bold text-gray-900">{posts.length}</p>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{profile?.followersCount || 0}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{profile?.followingCount || 0}</p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
              </div>

              {/* Bio */}
              {profile?.bio && (
                <p className="text-gray-700">{profile.bio}</p>
              )}

              {isOwnProfile && (
                <button className="mt-4 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 text-sm font-semibold transition ${
                activeTab === 'posts'
                  ? 'text-insta-pink border-b-2 border-insta-pink'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              data-testid="posts-tab"
            >
              <svg className="w-6 h-6 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h7V11H4zM13 4h7V11H13zM4 13h7V20H4zM13 13h7V20H13z" />
              </svg>
              POSTS
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {activeTab === 'posts' && (
          <div>
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200" data-testid="empty-posts">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h2>
                {isOwnProfile && (
                  <p className="text-gray-600 mb-4">Share your first moment!</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 md:gap-4" data-testid="posts-grid">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer relative"
                    data-testid="post-grid-item"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.caption || 'Post'}
                      className="w-full h-full object-cover group-hover:opacity-75 transition"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-6 text-white">
                        <div className="flex items-center">
                          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span className="font-semibold">{post.likesCount || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
                          </svg>
                          <span className="font-semibold">{post.commentsCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;