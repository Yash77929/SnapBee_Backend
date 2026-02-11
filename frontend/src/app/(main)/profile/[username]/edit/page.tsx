'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isLoading, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    image: '',
    gender: '',
    mobile: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        image: user.image || '',
        gender: user.gender || '',
        mobile: user.mobile || '',
      });
    }
  }, [user]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await userApi.updateUser(user.id, formData);
      await refreshUser();
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        router.push(`/profile/${formData.username}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {formData.image ? (
              <img src={formData.image} alt={formData.username} className="w-full h-full object-cover" />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-gray-500 text-2xl">
                {formData.username?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold">{user.username}</p>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Profile picture URL"
              className="input-field mt-2"
            />
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="input-field min-h-[80px] resize-none"
            rows={3}
            maxLength={150}
          />
          <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/150</p>
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Phone */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Phone number"
            className="input-field"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 btn-primary"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
