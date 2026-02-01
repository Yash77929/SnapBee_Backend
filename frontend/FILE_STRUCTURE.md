# 📁 SnapBee Frontend - Complete File Structure

## 🎯 Main Application Files

### Entry Point
- `src/main.jsx` - React app entry point
- `src/App.jsx` - Main app with routing
- `src/index.css` - Global Tailwind styles
- `index.html` - HTML template

## 📄 Pages (src/pages/)
- `Login.jsx` - Login page (125 lines)
- `Register.jsx` - Signup page (173 lines)
- `Feed.jsx` - Main feed page (91 lines)
- `CreatePost.jsx` - Create post page (195 lines)
- `Profile.jsx` - User profile page (205 lines)

## 🧩 Components (src/components/)
- `Navbar.jsx` - Navigation bar (96 lines)
- `PostCard.jsx` - Post display component (186 lines)
- `ProtectedRoute.jsx` - Auth wrapper (18 lines)

## 🔌 Services (src/services/)
- `api.js` - Axios instance with JWT interceptor (38 lines)
- `apiService.js` - API methods for auth, posts, users (79 lines)

## 🌐 Context (src/context/)
- `AuthContext.jsx` - Global authentication state (78 lines)

## ⚙️ Configuration Files
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS + custom colors
- `postcss.config.js` - PostCSS configuration
- `package.json` - Dependencies
- `.env` - Backend URL configuration
- `vercel.json` - Deployment configuration

## 📚 Documentation Files
- `README.md` - Complete project documentation
- `DEPLOYMENT.md` - Deployment guide (Vercel, Netlify, Docker)
- `QUICKSTART.md` - Quick start guide
- `PROJECT_SUMMARY.md` - Project overview

## 🎨 Style Customization

### To change colors, edit: `tailwind.config.js`
Current theme:
```javascript
colors: {
  'insta-purple': '#833AB4',
  'insta-pink': '#E1306C',
  'insta-orange': '#FD1D1D',
  'insta-yellow': '#F77737',
}
```

### To modify global styles, edit: `src/index.css`

## 🔧 Quick Edit Guide

### Change Login Page
Edit: `src/pages/Login.jsx`

### Change Navbar
Edit: `src/components/Navbar.jsx`

### Change Feed Layout
Edit: `src/pages/Feed.jsx`

### Change Post Card Design
Edit: `src/components/PostCard.jsx`

### Change Color Scheme
Edit: `tailwind.config.js`

### Add New API Endpoints
Edit: `src/services/apiService.js`

## 📦 Total Code Statistics
- Total Files: 14 source files
- Total Lines: ~1,386 lines of code
- Components: 3
- Pages: 5
- Services: 2
- Context: 1
