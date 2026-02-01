# SnapBee Frontend

A modern, Instagram-inspired social media application built with React and Vite.

## 🚀 Features

- **Authentication**: JWT-based login and signup
- **Feed**: View posts from all users in an Instagram-style feed
- **Create Posts**: Upload images with captions
- **User Profiles**: View user profiles with post grids
- **Likes & Comments**: Interact with posts through likes and comments
- **Responsive Design**: Mobile-first, fully responsive UI
- **Modern UI**: Instagram-inspired design with gradient accents

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors
- **React Router** - Client-side routing
- **JWT Authentication** - Secure token-based auth

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── PostCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Feed.jsx
│   │   ├── CreatePost.jsx
│   │   └── Profile.jsx
│   ├── services/        # API services
│   │   ├── api.js
│   │   └── apiService.js
│   ├── context/         # React context
│   │   └── AuthContext.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Yarn package manager

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## 🌐 Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_BASE_URL=https://snapbee-backend-2.onrender.com
```

## 🎨 Design Features

- **Instagram-inspired UI**: Modern, clean design with gradient accents
- **Color Scheme**: Purple and pink gradients (#833AB4, #E1306C, #FD1D1D)
- **Responsive**: Mobile-first design that works on all screen sizes
- **Smooth Animations**: Hover effects and transitions
- **Clean Typography**: Readable fonts and proper spacing

## 🔐 Authentication Flow

1. User signs up with username, email, and password
2. JWT token is stored in localStorage
3. Token is automatically added to all API requests via Axios interceptor
4. Protected routes redirect to login if not authenticated
5. Logout removes token and redirects to login

## 📱 Pages

### Login (`/login`)
- Username and password authentication
- Link to register page
- Error handling

### Register (`/register`)
- Create new account
- Form validation
- Automatic login after signup

### Feed (`/feed`)
- View all posts
- Like and comment on posts
- Empty state for no posts
- Loading and error states

### Create Post (`/create`)
- Upload image (max 5MB)
- Add caption
- Image preview
- Form validation

### Profile (`/profile/:username`)
- View user information
- Post grid layout
- Stats (posts, followers, following)
- Own profile vs other users

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Follow the prompts to complete deployment

### Deploy to Netlify

1. Build the project:
```bash
yarn build
```

2. Deploy the `dist` folder to Netlify

## 🔄 API Integration

The frontend connects to the backend at: `https://snapbee-backend-2.onrender.com`

### API Endpoints Used:
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like a post
- `DELETE /api/posts/:id/like` - Unlike a post
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/comments` - Add comment
- `GET /api/users/:username` - Get user profile
- `GET /api/users/:username/posts` - Get user posts

## 🐛 Troubleshooting

### Backend is slow to respond
The backend is hosted on Render's free tier and may take 30-60 seconds to wake up from sleep mode on first request.

### Images not displaying
Ensure the backend returns proper image URLs and CORS is configured correctly.

### Authentication errors
Check that JWT token is being stored in localStorage and included in request headers.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using React and Vite
