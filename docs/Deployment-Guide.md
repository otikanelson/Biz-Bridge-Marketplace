# BizBridge Deployment Guide

## Current Status
- ✅ Frontend deployed: https://biz-bridge-marketplace.vercel.app
- ⚠️ Backend deployed but returning 404: https://biz-bridge-marketplacebackend-9v16ggm0k-otikanelsons-projects.vercel.app
- ✅ MongoDB Atlas cluster configured: cluster0.pnsx1ps.mongodb.net

## Critical Issues to Fix

### 1. Backend Root Directory Configuration (URGENT)

The backend is returning 404 because Vercel doesn't know where to find your server.js file.

**Fix Steps:**
1. Go to https://vercel.com/dashboard
2. Find your backend project: `biz-bridge-marketplacebackend-9v16ggm0k`
3. Click **Settings** → **General**
4. Scroll to **Root Directory**
5. Click **Edit** and set to: `backend`
6. Click **Save**
7. Go to **Deployments** tab
8. Click the three dots on the latest deployment
9. Click **Redeploy**

**Verify:** After redeployment, visit:
- https://biz-bridge-marketplacebackend-9v16ggm0k-otikanelsons-projects.vercel.app/
- Should return: `{"message":"Welcome to BizBridge API","version":"2.0.0",...}`

### 2. Configure Backend Environment Variables in Vercel

Go to your backend project → **Settings** → **Environment Variables** and add:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://Nelson:RADSON292005@cluster0.pnsx1ps.mongodb.net/bizbridge?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=75b005282ee5db22a82b64c13fbe2517c140c50046a45ed61fa42836b2231f22
FRONTEND_URL=https://biz-bridge-marketplace.vercel.app
SEED_SECRET=bizbridge-seed-2024
MAX_FILE_SIZE=5000000
ENABLE_LOGGING=true
```

**Important:** After adding environment variables, redeploy the backend.

### 3. Configure Frontend Environment Variables in Vercel

Go to your frontend project → **Settings** → **Environment Variables** and add:

```
VITE_API_BASE_URL=https://biz-bridge-marketplacebackend-9v16ggm0k-otikanelsons-projects.vercel.app/api
VITE_APP_ENV=production
VITE_ENABLE_LOGGING=false
```

**Important:** After adding environment variables, redeploy the frontend.

## Seeding the Database

Once the backend is working (after fixing the Root Directory):

1. Open your browser
2. Visit: https://biz-bridge-marketplacebackend-9v16ggm0k-otikanelsons-projects.vercel.app/api/seed?secret=bizbridge-seed-2024
3. You should see a success response with credentials

**Test Accounts Created:**
- Artisan 1: adebayo@bizbridge.com / Password123
- Artisan 2: ngozi@bizbridge.com / Password123
- Artisan 3: fatima@bizbridge.com / Password123
- Customer 1: chidi@bizbridge.com / Password123
- Customer 2: amaka@bizbridge.com / Password123

### Remove Seed Route After Seeding (Security)

After successfully seeding, remove the seed route:

```bash
git rm backend/src/routes/seedRoutes.js
```

Then edit `backend/server.js` and remove these lines:
```javascript
import seedRoutes from './src/routes/seedRoutes.js';
app.use('/api/seed', seedRoutes);
```

Commit and push:
```bash
git commit -m "security: remove seed route after database seeding"
git push
```

## Security: Change MongoDB Password

Your MongoDB credentials were exposed in git commits. You should:

1. Go to MongoDB Atlas
2. Database Access → Edit user "Nelson"
3. Change password
4. Update `MONGO_URI` in Vercel backend environment variables
5. Redeploy backend

## Testing the Deployment

### Backend Health Check
```bash
curl https://biz-bridge-marketplacebackend-9v16ggm0k-otikanelsons-projects.vercel.app/
```

Expected response:
```json
{
  "message": "Welcome to BizBridge API",
  "version": "2.0.0",
  "status": "active"
}
```

### Database Connection Test
```bash
curl https://biz-bridge-marketplacebackend-9v16ggm0k-otikanelsons-projects.vercel.app/api/test-db
```

Expected response:
```json
{
  "success": true,
  "database": {
    "status": "connected",
    "host": "cluster0.pnsx1ps.mongodb.net",
    "name": "bizbridge"
  }
}
```

### Frontend Test
1. Visit: https://biz-bridge-marketplace.vercel.app
2. Services should load on the homepage
3. Try logging in with test accounts
4. Browse services

## Troubleshooting

### Backend still returns 404
- Verify Root Directory is set to `backend` in Vercel settings
- Check deployment logs for errors
- Ensure all environment variables are set

### Frontend can't connect to backend
- Check browser console for CORS errors
- Verify `VITE_API_BASE_URL` is set correctly in Vercel
- Ensure backend `FRONTEND_URL` includes your frontend domain

### Database connection fails
- Verify MongoDB Atlas network access allows 0.0.0.0/0
- Check if password contains special characters (URL encode if needed)
- Test connection from Vercel deployment logs

## Local Development

For local development, use the `.env` files (not committed to git):

**backend/.env:**
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://Nelson:RADSON292005@cluster0.pnsx1ps.mongodb.net/bizbridge?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=75b005282ee5db22a82b64c13fbe2517c140c50046a45ed61fa42836b2231f22
FRONTEND_URL=http://localhost:5174
MAX_FILE_SIZE=5000000
ENABLE_LOGGING=true
```

**frontend/.env:**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_ENV=development
VITE_ENABLE_LOGGING=true
```

## Next Steps After Deployment

1. ✅ Fix backend Root Directory
2. ✅ Configure environment variables
3. ✅ Seed database
4. ✅ Remove seed route
5. ✅ Change MongoDB password
6. Test all features
7. Monitor error logs
8. Set up custom domain (optional)
