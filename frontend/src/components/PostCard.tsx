'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Post, User } from '@/types';
import { postApi, commentApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface PostCardProps {
  post: Post;
  onUpdate?: (post: Post) => void;
}

export default function PostCard({ post, onUpdate }: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(
    post.likedByUsers?.some((u: User) => u.id === user?.id) || false
  );
  const [likesCount, setLikesCount] = useState(post.likedByUsers?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const handleLike = async () => {
    if (!user) return;
    try {
      if (isLiked) {
        await postApi.unlikePost(post.id);
        setLikesCount((prev) => prev - 1);
      } else {
        await postApi.likePost(post.id);
        setLikesCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Failed to like/unlike post:', err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    try {
      const comment = await commentApi.createComment(post.id, { content: newComment });
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <article className="rounded-3xl border border-[var(--border)] bg-white/90 shadow-sm backdrop-blur overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Link href={`/profile/${post.user.username}`} className="w-9 h-9 rounded-2xl bg-[var(--surface-muted)] overflow-hidden flex items-center justify-center">
          {post.user.image ? (
            <img src={post.user.image} alt={post.user.username} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[var(--secondary-text)] text-sm">{post.user.username[0].toUpperCase()}</span>
          )}
        </Link>
        <div className="flex-1">
          <Link href={`/profile/${post.user.username}`} className="font-semibold text-sm hover:underline">
            {post.user.username}
          </Link>
          {post.location && (
            <p className="text-xs text-[var(--secondary-text)]">{post.location}</p>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="aspect-square bg-[var(--surface-muted)]">
        <img
          src={post.image}
          alt={post.caption}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={handleLike} className="hover:opacity-60 transition">
            <svg
              className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="hover:opacity-60 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-1">{likesCount} likes</p>

        {/* Caption */}
        <p className="text-sm">
          <Link href={`/profile/${post.user.username}`} className="font-semibold mr-2 hover:underline">
            {post.user.username}
          </Link>
          {post.caption}
        </p>

        {/* Comments Preview */}
        {comments.length > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-[var(--secondary-text)] text-sm mt-1"
          >
            View all {comments.length} comments
          </button>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="mt-3 space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="text-sm">
                <Link href={`/profile/${comment.user.username}`} className="font-semibold mr-2 hover:underline">
                  {comment.user.username}
                </Link>
                {comment.content}
              </div>
            ))}
          </div>
        )}

        {/* Date */}
        <p className="text-xs text-[var(--secondary-text)] mt-2 uppercase">
          {formatDate(post.createdAt)}
        </p>
      </div>

      {/* Add Comment */}
      {user && (
        <form onSubmit={handleComment} className="flex items-center border-t border-[var(--border)] px-4 py-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="text-[var(--accent)] font-semibold text-sm disabled:opacity-50"
          >
            Post
          </button>
        </form>
      )}
    </article>
  );
}
