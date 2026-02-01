# SnapBee Frontend - Deployment Guide

## 🚀 Quick Deploy to Vercel (Recommended)

### Method 1: Vercel CLI (Fastest)

1. **Install Vercel CLI globally**:
```bash
npm install -g vercel
```

2. **Navigate to frontend directory**:
```bash
cd frontend
```

3. **Login to Vercel**:
```bash
vercel login
```

4. **Deploy**:
```bash
vercel
```

5. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name: **snapbee-frontend** (or your choice)
   - Directory: **./  ** (current directory)
   - Override settings? **N**

6. **Deploy to production**:
```bash
vercel --prod
```

Your app will be live at: `https://your-project-name.vercel.app`

### Method 2: Vercel Dashboard (No CLI needed)

1. **Push your code to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Go to [Vercel Dashboard](https://vercel.com/new)**

3. **Import your GitHub repository**

4. **Configure project**:
   - Framework Preset: **Vite**
   - Root Directory: **frontend** (if frontend is in a subdirectory)
   - Build Command: `yarn build`
   - Output Directory: `dist`
   - Install Command: `yarn install`

5. **Add Environment Variable**:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://snapbee-backend-2.onrender.com`

6. **Click Deploy**

---

## 🌐 Deploy to Netlify

### Method 1: Netlify CLI

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Build the project**:
```bash
cd frontend
yarn build
```

3. **Deploy**:
```bash
netlify deploy
```

4. **For production**:
```bash
netlify deploy --prod
```

### Method 2: Netlify Dashboard

1. **Build the project locally**:
```bash
cd frontend
yarn build
```

2. **Go to [Netlify](https://app.netlify.com/)**

3. **Drag and drop the `dist` folder** to deploy

4. **Configure environment variables** in Site Settings:
   - `VITE_API_BASE_URL=https://snapbee-backend-2.onrender.com`

---

## 🐳 Deploy with Docker

1. **Create Dockerfile in frontend directory**:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Create nginx.conf**:
```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Build and run**:
```bash
docker build -t snapbee-frontend .
docker run -p 80:80 snapbee-frontend
```

---

## ☁️ Deploy to AWS S3 + CloudFront

1. **Build the project**:
```bash
yarn build
```

2. **Create S3 bucket** and enable static website hosting

3. **Upload dist folder** to S3:
```bash
aws s3 sync dist/ s3://your-bucket-name
```

4. **Create CloudFront distribution** pointing to S3 bucket

5. **Update environment variables** in build process

---

## 🔧 Environment Variables

Make sure to set these environment variables in your deployment platform:

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_BASE_URL` | `https://snapbee-backend-2.onrender.com` | Yes |

---

## ✅ Post-Deployment Checklist

- [ ] Frontend is accessible via HTTPS
- [ ] API calls are working (check Network tab)
- [ ] Authentication flow works (login/signup)
- [ ] Images are loading properly
- [ ] All routes are accessible
- [ ] Mobile responsiveness is working
- [ ] Environment variables are set correctly

---

## 🐛 Troubleshooting

### Issue: API calls failing
**Solution**: Check that `VITE_API_BASE_URL` is set correctly and the backend is running.

### Issue: 404 on page refresh
**Solution**: Configure your hosting provider to redirect all routes to `index.html`

**Vercel**: Automatically handled
**Netlify**: Add `_redirects` file:
```
/*    /index.html   200
```

### Issue: Environment variables not working
**Solution**: 
- Rebuild the application after adding environment variables
- Ensure variables start with `VITE_` prefix
- Check that `.env` file is in the correct location

### Issue: CORS errors
**Solution**: Ensure backend has proper CORS configuration for your frontend domain.

---

## 📊 Performance Optimization

1. **Enable compression** on your hosting provider
2. **Use CDN** for faster content delivery
3. **Enable caching** for static assets
4. **Optimize images** before uploading
5. **Use lazy loading** for images

---

## 🔒 Security Recommendations

1. **Use HTTPS** for all deployments
2. **Set proper security headers**
3. **Keep dependencies updated**
4. **Use environment variables** for sensitive data
5. **Enable DDoS protection** on your hosting provider

---

## 📱 Testing Production Build Locally

```bash
# Build the project
yarn build

# Preview the production build
yarn preview
```

Open http://localhost:4173 to test the production build locally.

---

## 🆘 Support

If you encounter any issues during deployment:

1. Check the build logs for errors
2. Verify environment variables are set correctly
3. Ensure the backend is accessible
4. Check browser console for JavaScript errors
5. Review network requests in DevTools

---

**Happy Deploying! 🎉**
