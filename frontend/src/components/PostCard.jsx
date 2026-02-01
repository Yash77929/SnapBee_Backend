import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postService.unlikePost(post.id);
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await postService.likePost(post.id);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const loadComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const data = await postService.getComments(post.id);
        setComments(data);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const comment = await postService.addComment(post.id, newComment.trim());
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6" data-testid="post-card">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <Link 
          to={`/profile/${post.username}`} 
          className="flex items-center space-x-3 hover:opacity-80 transition"
          data-testid="post-author-link"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-insta-yellow via-insta-pink to-insta-purple flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-800">
                {post.username?.[0]?.toUpperCase()}
              </span>
            </div>
          </div>
          <span className="font-semibold text-sm">{post.username}</span>
        </Link>
        <span className="text-xs text-gray-500">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}</span>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.caption || 'Post image'}
          className="w-full object-cover max-h-[600px]"
          data-testid="post-image"
        />
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-3">
          <button
            onClick={handleLike}
            className="transition-transform hover:scale-110"
            data-testid="like-button"
          >
            {isLiked ? (
              <svg className="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>

          <button
            onClick={loadComments}
            className="transition-transform hover:scale-110"
            data-testid="comment-button"
          >
            <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>

        {/* Likes Count */}
        <div className="font-semibold text-sm mb-2" data-testid="likes-count">
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="text-sm mb-2" data-testid="post-caption">
            <Link to={`/profile/${post.username}`} className="font-semibold mr-2">
              {post.username}
            </Link>
            <span className="text-gray-800">{post.caption}</span>
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 border-t pt-4" data-testid="comments-section">
            {loadingComments ? (
              <div className="text-center text-gray-500">Loading comments...</div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {comments.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((comment, index) => (
                      <div key={index} className="text-sm" data-testid="comment-item">
                        <span className="font-semibold mr-2">{comment.username}</span>
                        <span className="text-gray-800">{comment.text || comment.comment}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 text-sm border-none focus:outline-none"
                    data-testid="comment-input"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="text-insta-pink font-semibold text-sm disabled:opacity-50"
                    data-testid="comment-submit"
                  >
                    {isSubmitting ? 'Posting...' : 'Post'}
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;