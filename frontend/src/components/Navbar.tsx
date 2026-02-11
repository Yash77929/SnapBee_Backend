'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { userApi } from '@/lib/api';
import { User } from '@/types';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        const results = await userApi.searchUsers(query);
        setSearchResults(results);
        setShowResults(true);
      } catch {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-serif italic">
          SnapBee
        </Link>

        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            onFocus={() => searchQuery && setShowResults(true)}
            className="w-64 px-4 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none"
          />
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
              {searchResults.map((result) => (
                <Link
                  key={result.id}
                  href={`/profile/${result.username}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {result.image ? (
                      <img src={result.image} alt={result.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500 text-lg">{result.username[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{result.username}</p>
                    <p className="text-gray-500 text-sm">{result.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center gap-5">
          <Link href="/" className="hover:opacity-60">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <Link href="/create" className="hover:opacity-60" title="Create Post">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
          <Link href="/story/create" className="hover:opacity-60" title="Add Story">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
          {user ? (
            <div className="relative group">
              <Link href={`/profile/${user.username}`} className="block w-7 h-7 rounded-full bg-gray-200 overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
                    {user.username[0].toUpperCase()}
                  </span>
                )}
              </Link>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block">
                <Link href={`/profile/${user.username}`} className="block px-4 py-2 hover:bg-gray-50 text-sm">
                  Profile
                </Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-t">
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="link-primary text-sm">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
