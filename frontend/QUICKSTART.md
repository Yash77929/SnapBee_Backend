# SnapBee Frontend - Quick Start Guide

## 🎯 What You Have

A complete, production-ready Instagram-inspired social media frontend with:

✅ User Authentication (Login/Signup with JWT)  
✅ Feed Page (View all posts)  
✅ Create Post (Upload images + captions)  
✅ User Profiles (View user info + post grid)  
✅ Likes & Comments on posts  
✅ Modern, responsive Instagram-style UI  
✅ Mobile-first design  
✅ Protected routes  
✅ Error handling & loading states  

## 🚀 Running Locally

### Prerequisites
- Node.js v16+ installed
- Yarn package manager

### Start Development Server

```bash
cd frontend
yarn install
yarn dev
```

The app will be available at: **http://localhost:3000**

## 📱 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | User login with username/password |
| Register | `/register` | Create new account |
| Feed | `/feed` | View all posts from users |
| Create Post | `/create` | Upload image with caption |
| Profile | `/profile/:username` | View user profile and posts |

## 🔐 Authentication Flow

1. **Register**: Create account → Auto-login with JWT
2. **Login**: Enter credentials → JWT saved to localStorage
3. **Protected Routes**: Redirects to login if not authenticated
4. **Logout**: Clears token and redirects to login

## 🎨 UI Components

### Navbar
- Home (Feed)
- Create Post
- Profile
- Logout
- Active link indicators

### PostCard
- User avatar and username
- Post image
- Like button (heart icon)
- Comment button
- Caption
- Comments section
- Add comment form

### ProtectedRoute
- Wraps authenticated pages
- Shows loading spinner while checking auth
- Redirects to login if not authenticated

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Top navigation bar
│   │   ├── PostCard.jsx     # Individual post component
│   │   └── ProtectedRoute.jsx # Auth wrapper
│   ├── pages/               # Main page components
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Signup page
│   │   ├── Feed.jsx         # Main feed
│   │   ├── CreatePost.jsx   # Create new post
│   │   └── Profile.jsx      # User profile
│   ├── services/            # API integration
│   │   ├── api.js           # Axios instance + interceptors
│   │   └── apiService.js    # API methods
│   ├── context/             # Global state
│   │   └── AuthContext.jsx  # Authentication state
│   ├── App.jsx              # Main app + routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static files
├── .env                     # Environment variables
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── README.md                # Full documentation
├── DEPLOYMENT.md            # Deployment guide
└── vercel.json              # Vercel config
```

## 🔧 Environment Variables

The app connects to your live backend:

```
VITE_API_BASE_URL=https://snapbee-backend-2.onrender.com
```

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#833AB4)
- **Secondary**: Pink (#E1306C)
- **Accent**: Orange/Yellow gradient
- **Background**: Light gray (#F9FAFB)
- **Cards**: White with subtle shadow

### Typography
- **Font**: System fonts (San Francisco, Segoe UI, Roboto)
- **Headings**: Bold, 1.5-2rem
- **Body**: Regular, 0.875-1rem

### Spacing
- Consistent padding: 1rem, 1.5rem, 2rem
- Card spacing: 1.5rem between cards
- Section spacing: 2rem

## 🧪 Testing Locally

### 1. Test Authentication
```bash
# Open http://localhost:3000
# Click "Sign up" → Create account
# Should auto-login and redirect to feed
```

### 2. Test Feed
```bash
# Should show loading spinner
# Then display posts or empty state
```

### 3. Test Create Post
```bash
# Click "Create" in navbar
# Upload an image
# Add caption
# Click "Create Post"
# Should redirect to feed with new post
```

### 4. Test Profile
```bash
# Click profile icon in navbar
# Should show user info and post grid
```

### 5. Test Likes & Comments
```bash
# Click heart icon to like a post
# Click comment icon to view/add comments
```

## 🐛 Common Issues & Solutions

### Backend is slow
**Issue**: First API call takes 30-60 seconds  
**Reason**: Free tier Render backend wakes from sleep  
**Solution**: Wait for backend to wake up, subsequent calls will be fast

### Images not loading
**Issue**: Images not displaying  
**Solution**: Check that backend returns valid image URLs

### Login not working
**Issue**: Can't login  
**Solution**: 
- Check browser console for errors
- Verify backend is running
- Check network tab for API responses

### Styles not loading
**Issue**: No styling on page  
**Solution**: 
- Run `yarn install` to ensure Tailwind is installed
- Check that Vite dev server is running

## 📦 Build for Production

```bash
# Build optimized production bundle
yarn build

# Preview production build
yarn preview
```

The production build will be in the `dist` folder.

## 🚀 Deploy to Vercel

**Quickest method:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Deploy to production
vercel --prod
```

See **DEPLOYMENT.md** for detailed deployment instructions.

## 📊 Features Breakdown

### Implemented ✅
- [x] User authentication (login/signup)
- [x] JWT token management
- [x] Feed with all posts
- [x] Create posts with image upload
- [x] User profiles
- [x] Like/unlike posts
- [x] View/add comments
- [x] Protected routes
- [x] Responsive design
- [x] Loading states
- [x] Error handling
- [x] Empty states

### Not Implemented (Per Requirements) ❌
- [ ] Follow/Unfollow users (backend doesn't support)

## 🎯 Key Highlights

✨ **Modern React**: Uses React 18 with hooks  
✨ **Vite**: Lightning-fast dev server and builds  
✨ **Tailwind CSS**: Utility-first styling  
✨ **Axios Interceptors**: Automatic JWT injection  
✨ **React Router**: Client-side routing  
✨ **Context API**: Global auth state  
✨ **Form Validation**: Input validation on all forms  
✨ **Image Preview**: See uploaded images before posting  
✨ **Optimistic Updates**: Like/unlike feels instant  
✨ **Mobile First**: Works perfectly on all devices  

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (1 column)
- **Tablet**: 640px - 1024px (2 columns)
- **Desktop**: > 1024px (3 columns)

## 🎨 Instagram-Inspired Features

- Gradient logo and accents
- Card-based post layout
- Heart animation on like
- Comment threads
- Profile post grid
- Story-style navigation
- Clean, minimal design

## 🔜 Next Steps

1. **Test the app locally** at http://localhost:3000
2. **Create a test account** and explore features
3. **Deploy to Vercel** for production
4. **Share your live URL** with users

## 💡 Pro Tips

- Backend may take 30-60s to wake up on first request
- Use the "Create Post" button to add test content
- Profile shows your posts in a grid layout
- Navbar highlights the current page
- Comments load when you click the comment icon

---

**Need help?** Check README.md and DEPLOYMENT.md for more details!

**Ready to deploy?** Run `vercel` in the frontend directory!

🎉 **Your Instagram-inspired app is ready to go!**
