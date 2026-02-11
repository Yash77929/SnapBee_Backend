'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = await authApi.login({ email, password });
      await login(token);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-[var(--border)] bg-white/60 p-7 shadow-sm backdrop-blur sm:p-10">
          <p className="text-xs uppercase tracking-[0.26em] text-[var(--secondary-text)]">Welcome Back</p>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl">SnapBee</h1>
          <p className="mt-4 max-w-xl text-base text-[var(--secondary-text)] sm:text-lg">
            Dive into your hive. Catch stories, drop moments, and follow what matters in one place.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="text-2xl font-semibold">1</p>
              <p className="text-sm text-[var(--secondary-text)]">Creative feed</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="text-2xl font-semibold">2</p>
              <p className="text-sm text-[var(--secondary-text)]">Story sharing</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="text-2xl font-semibold">3</p>
              <p className="text-sm text-[var(--secondary-text)]">People search</p>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <div className="rounded-3xl border border-[var(--border)] bg-white/85 p-7 shadow-sm backdrop-blur sm:p-10">
            <h2 className="font-display text-3xl">Log in</h2>
            <p className="mt-2 text-sm text-[var(--secondary-text)]">
              Sign in to continue your SnapBee journey.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              {isLoading && (
                <p className="text-xs text-[var(--secondary-text)]">
                  Connecting to server. First request can take up to 30s.
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="btn-primary w-full mt-2"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="mt-5 flex items-center">
              <div className="h-px flex-1 bg-[var(--border)]"></div>
              <span className="px-3 text-xs uppercase tracking-[0.2em] text-[var(--secondary-text)]">OR</span>
              <div className="h-px flex-1 bg-[var(--border)]"></div>
            </div>

            <p className="mt-4 text-center text-sm text-[var(--secondary-text)]">
              Forgot password? Recovery flow is coming soon.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white/85 px-6 py-5 text-center shadow-sm backdrop-blur">
            <p className="text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="link-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
