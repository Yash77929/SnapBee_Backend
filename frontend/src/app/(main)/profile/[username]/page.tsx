'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { User, Post } from '@/types';
import { userApi, postApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser, refreshUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await userApi.getUserByUsername(username);
        setProfileUser(user);
        
        const userPosts = await postApi.getPostsByUserId(user.id);
        setPosts(userPosts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
        
        if (currentUser) {
          setIsFollowing(
            currentUser.following?.some((u) => u.id === user.id) || false
          );
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username, currentUser]);

  const handleFollow = async () => {
    if (!profileUser || !currentUser) return;
    setFollowLoading(true);
    
    try {
      if (isFollowing) {
        await userApi.unfollowUser(profileUser.id);
        setIsFollowing(false);
        setProfileUser({
          ...profileUser,
          followers: profileUser.followers.filter((u) => u.id !== currentUser.id),
        });
      } else {
        await userApi.followUser(profileUser.id);
        setIsFollowing(true);
        setProfileUser({
          ...profileUser,
          followers: [...profileUser.followers, currentUser],
        });
      }
      await refreshUser();
    } catch (err) {
      console.error('Failed to follow/unfollow:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">User not found</h1>
        <p className="text-gray-500">The user you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const displayPosts = activeTab === 'posts' ? posts : (profileUser.savePost || []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        {/* Profile Picture */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {profileUser.image ? (
            <img src={profileUser.image} alt={profileUser.username} className="w-full h-full object-cover" />
          ) : (
            <span className="flex items-center justify-center w-full h-full text-gray-500 text-4xl">
              {profileUser.username[0].toUpperCase()}
            </span>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <h1 className="text-xl font-light">{profileUser.username}</h1>
            {currentUser && (
              isOwnProfile ? (
                <Link
                  href={`/profile/${username}/edit`}
                  className="px-4 py-1.5 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50"
                >
                  Edit Profile
                </Link>
              ) : (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`px-6 py-1.5 rounded-lg font-semibold text-sm ${
                    isFollowing
                      ? 'bg-gray-100 hover:bg-gray-200 text-black'
                      : 'bg-[#0095f6] hover:bg-[#1877f2] text-white'
                  }`}
                >
                  {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                </button>
              )
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <div>
              <span className="font-semibold">{posts.length}</span>{' '}
              <span className="text-gray-500">posts</span>
            </div>
            <div>
              <span className="font-semibold">{profileUser.followers?.length || 0}</span>{' '}
              <span className="text-gray-500">followers</span>
            </div>
            <div>
              <span className="font-semibold">{profileUser.following?.length || 0}</span>{' '}
              <span className="text-gray-500">following</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="font-semibold">{profileUser.name}</p>
            {profileUser.bio && <p className="whitespace-pre-wrap">{profileUser.bio}</p>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-300">
        <div className="flex justify-center gap-12">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-4 text-sm font-semibold tracking-wider uppercase border-t ${
              activeTab === 'posts' ? 'border-black -mt-px' : 'border-transparent text-gray-500'
            }`}
          >
            Posts
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-4 text-sm font-semibold tracking-wider uppercase border-t ${
                activeTab === 'saved' ? 'border-black -mt-px' : 'border-transparent text-gray-500'
              }`}
            >
              Saved
            </button>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      {displayPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 md:gap-4 mt-4">
          {displayPosts.map((post) => (
            <div key={post.id} className="aspect-square bg-gray-100 overflow-hidden cursor-pointer group relative">
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {post.likedByUsers?.length || 0}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {post.comments?.length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet</p>
        </div>
      )}
    </div>
  );
}
