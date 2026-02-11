'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types';
import { postApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/components/PostCard';
import StoryBar from '@/components/StoryBar';
import Link from 'next/link';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchFeed = async () => {
      if (!user) return;
      
      try {
        // Get posts from followed users
        const followingIds = user.following?.map((u) => u.id) || [];
        
        if (followingIds.length > 0) {
          const feedPosts = await postApi.getPostsByUserIds(followingIds);
          setPosts(feedPosts.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ));
        }
      } catch (err) {
        console.error('Failed to fetch feed:', err);
      } finally {
        setFeedLoading(false);
      }
    };

    if (user) {
      fetchFeed();
    }
  }, [user, isLoading, router]);

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

  const followerCount = user.followers?.length ?? 0;
  const followingCount = user.following?.length ?? 0;
  const displayName = user.name?.split(' ')[0] || user.username;

  return (
    <div className="relative z-10">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--secondary-text)]">
              SnapBee Daily
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl">
              Good to see you, {displayName}.
            </h1>
            <p className="max-w-xl text-base text-[var(--secondary-text)] sm:text-lg">
              Your feed is a honeycomb of stories, snapshots, and moments from the
              people you follow.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/create" className="btn-primary inline-flex items-center gap-2">
              <span>New Post</span>
              <span className="text-lg">+</span>
            </Link>
            <Link
              href="/story/create"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-5 py-2.5 font-semibold text-[var(--foreground)] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <span>Add Story</span>
              <span className="text-lg">◎</span>
            </Link>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <StoryBar />

            <section className="rounded-3xl border border-[var(--border)] bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl">Your Feed</h2>
                  <p className="text-sm text-[var(--secondary-text)]">
                    Fresh posts from {followingCount} creators you follow.
                  </p>
                </div>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  {posts.length} posts
                </span>
              </div>

              {feedLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]"></div>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-5">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-8 text-center">
                  <h2 className="font-display text-2xl mb-2">Welcome to SnapBee!</h2>
                  <p className="text-[var(--secondary-text)] mb-5">
                    Start following people to see their posts in your feed.
                  </p>
                  <Link href={`/profile/${user.username}`} className="btn-primary inline-block">
                    Find People to Follow
                  </Link>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[var(--border)] bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-[var(--accent-soft)]">
                  {user.image ? (
                    <img src={user.image} alt={user.username} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-[var(--accent)]">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-[var(--secondary-text)]">@{user.username}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[var(--secondary-text)]">
                {user.bio || "Tell the world what makes your moments shine."}
              </p>
              <div className="mt-4 flex gap-2">
                <Link href={`/profile/${user.username}`} className="link-primary text-sm">
                  View profile
                </Link>
                <span className="text-sm text-[var(--secondary-text)]">•</span>
                <Link href={`/profile/${user.username}/edit`} className="link-primary text-sm">
                  Edit
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-white/80 p-6 shadow-sm backdrop-blur">
              <h3 className="font-display text-xl mb-4">Your Pulse</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-[var(--surface-muted)] p-3">
                  <p className="text-xl font-semibold">{followerCount}</p>
                  <p className="text-xs text-[var(--secondary-text)]">Followers</p>
                </div>
                <div className="rounded-2xl bg-[var(--surface-muted)] p-3">
                  <p className="text-xl font-semibold">{followingCount}</p>
                  <p className="text-xs text-[var(--secondary-text)]">Following</p>
                </div>
                <div className="rounded-2xl bg-[var(--surface-muted)] p-3">
                  <p className="text-xl font-semibold">{posts.length}</p>
                  <p className="text-xs text-[var(--secondary-text)]">Feed</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-muted)] p-6 shadow-sm">
              <h3 className="font-display text-xl mb-3">Today’s Spark</h3>
              <p className="text-sm text-[var(--secondary-text)]">
                Capture a detail you would normally miss. The smallest light makes the boldest story.
              </p>
              <Link href="/create" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                Start a post
                <span aria-hidden>→</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
