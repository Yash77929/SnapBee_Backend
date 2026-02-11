'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.signup(formData);
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email && formData.name && formData.username && formData.password;

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-[var(--border)] bg-white/60 p-7 shadow-sm backdrop-blur sm:p-10">
          <p className="text-xs uppercase tracking-[0.26em] text-[var(--secondary-text)]">Join The Hive</p>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl">SnapBee</h1>
          <p className="mt-4 max-w-xl text-base text-[var(--secondary-text)] sm:text-lg">
            Build your profile, connect with people, and turn everyday moments into stories.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="text-2xl font-semibold">A</p>
              <p className="text-sm text-[var(--secondary-text)]">Create account</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="text-2xl font-semibold">B</p>
              <p className="text-sm text-[var(--secondary-text)]">Share your first post</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="text-2xl font-semibold">C</p>
              <p className="text-sm text-[var(--secondary-text)]">Follow creators</p>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <div className="rounded-3xl border border-[var(--border)] bg-white/85 p-7 shadow-sm backdrop-blur sm:p-10">
            <h2 className="font-display text-3xl">Sign up</h2>
            <p className="mt-2 text-sm text-[var(--secondary-text)]">
              Create your account to start sharing photos and stories.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
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

              <p className="text-xs text-[var(--secondary-text)]">
                By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
              </p>

              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="btn-primary w-full mt-2"
              >
                {isLoading ? 'Signing up...' : 'Sign up'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white/85 px-6 py-5 text-center shadow-sm backdrop-blur">
            <p className="text-sm">
              Have an account?{' '}
              <Link href="/login" className="link-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
