'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { postApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function CreatePostPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await postApi.createPost({
        caption,
        image: imageUrl,
        location: location || undefined,
      });
      router.push(`/profile/${user.username}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-center mb-8">Create New Post</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-6">
        {/* Image URL Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="input-field"
            required
          />
        </div>

        {/* Image Preview */}
        {imageUrl && (
          <div className="mb-4 aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setError('Invalid image URL')}
            />
          </div>
        )}

        {/* Caption */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="input-field min-h-[100px] resize-none"
            rows={4}
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Location (optional)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Add location"
            className="input-field"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !imageUrl}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Sharing...' : 'Share'}
        </button>
      </form>
    </div>
  );
}
