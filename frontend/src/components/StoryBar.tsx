'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Story, User } from '@/types';
import { storyApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface StoryUserGroup {
  user: User;
  stories: Story[];
}

export default function StoryBar() {
  const { user } = useAuth();
  const [storyGroups, setStoryGroups] = useState<StoryUserGroup[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryUserGroup | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    const fetchStories = async () => {
      if (!user) return;
      
      try {
        // Fetch stories from followed users
        const followingIds = user.following?.map((u) => u.id) || [];
        const allStories: StoryUserGroup[] = [];
        
        for (const userId of followingIds) {
          try {
            const stories = await storyApi.getStoriesByUserId(userId);
            if (stories.length > 0) {
              allStories.push({
                user: stories[0].user,
                stories,
              });
            }
          } catch {
            // Skip users with no stories
          }
        }
        
        setStoryGroups(allStories);
      } catch (err) {
        console.error('Failed to fetch stories:', err);
      }
    };

    fetchStories();
  }, [user]);

  const openStory = (group: StoryUserGroup) => {
    setSelectedStory(group);
    setCurrentStoryIndex(0);
  };

  const closeStory = () => {
    setSelectedStory(null);
    setCurrentStoryIndex(0);
  };

  const nextStory = () => {
    if (!selectedStory) return;
    if (currentStoryIndex < selectedStory.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  if (storyGroups.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg">Stories</p>
            <p className="text-sm text-[var(--secondary-text)]">
              No stories yet. Start the first glow of the day.
            </p>
          </div>
          <Link href="/story/create" className="link-primary text-sm">
            Add your story
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Story Bar */}
      <div className="rounded-3xl border border-[var(--border)] bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg">Stories</p>
            <p className="text-xs text-[var(--secondary-text)]">
              Tap to watch the latest moments.
            </p>
          </div>
          <Link href="/story/create" className="link-primary text-sm">
            Add
          </Link>
        </div>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {storyGroups.map((group) => (
            <button
              key={group.user.id}
              onClick={() => openStory(group)}
              className="flex min-w-[72px] flex-col items-center gap-2"
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-amber-300 via-orange-400 to-teal-400 p-0.5">
                <div className="h-full w-full rounded-full bg-white p-0.5">
                  <div className="h-full w-full rounded-full bg-[var(--surface-muted)] overflow-hidden">
                    {group.user.image ? (
                      <img src={group.user.image} alt={group.user.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-[var(--secondary-text)]">
                        {group.user.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="w-16 truncate text-center text-xs">{group.user.username}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={closeStory}
            className="absolute top-4 right-4 text-white z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full max-w-lg h-[80vh]">
            {/* Progress bars */}
            <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
              {selectedStory.stories.map((_, index) => (
                <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-white ${index <= currentStoryIndex ? 'w-full' : 'w-0'}`}
                  />
                </div>
              ))}
            </div>

            {/* User info */}
            <div className="absolute top-6 left-4 flex items-center gap-2 z-10">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                {selectedStory.user.image ? (
                  <img src={selectedStory.user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
                    {selectedStory.user.username[0].toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-white font-semibold text-sm">{selectedStory.user.username}</span>
            </div>

            {/* Story image */}
            <img
              src={selectedStory.stories[currentStoryIndex].image}
              alt=""
              className="w-full h-full object-contain"
            />

            {/* Caption */}
            {selectedStory.stories[currentStoryIndex].caption && (
              <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                {selectedStory.stories[currentStoryIndex].caption}
              </div>
            )}

            {/* Navigation */}
            <button
              onClick={prevStory}
              className="absolute left-0 top-0 bottom-0 w-1/3"
            />
            <button
              onClick={nextStory}
              className="absolute right-0 top-0 bottom-0 w-2/3"
            />
          </div>
        </div>
      )}
    </>
  );
}
