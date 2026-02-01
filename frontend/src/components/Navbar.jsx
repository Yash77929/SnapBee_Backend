import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" data-testid="navbar">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/feed" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="w-8 h-8 bg-gradient-to-tr from-insta-yellow via-insta-pink to-insta-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-insta-purple to-insta-pink">
              SnapBee
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/feed"
              className={`flex flex-col items-center transition-colors ${
                isActive('/feed') ? 'text-insta-pink' : 'text-gray-700 hover:text-gray-900'
              }`}
              data-testid="feed-link"
            >
              <svg className="w-6 h-6" fill={isActive('/feed') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Home</span>
            </Link>

            <Link
              to="/create"
              className={`flex flex-col items-center transition-colors ${
                isActive('/create') ? 'text-insta-pink' : 'text-gray-700 hover:text-gray-900'
              }`}
              data-testid="create-link"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs mt-1">Create</span>
            </Link>

            <Link
              to={`/profile/${user?.username}`}
              className={`flex flex-col items-center transition-colors ${
                isActive(`/profile/${user?.username}`) ? 'text-insta-pink' : 'text-gray-700 hover:text-gray-900'
              }`}
              data-testid="profile-link"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isActive(`/profile/${user?.username}`) 
                  ? 'bg-gradient-to-tr from-insta-yellow via-insta-pink to-insta-purple text-white' 
                  : 'bg-gray-300 text-gray-700'
              }`}>
                <span className="text-xs font-semibold">{user?.username?.[0]?.toUpperCase()}</span>
              </div>
              <span className="text-xs mt-1">Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors"
              data-testid="logout-button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;