# CAPWA App - Deployment Guide to Netlify

## Step 1: Commit and Push to GitHub

### 1.1 Check Git Status
```bash
git status
```

### 1.2 Add All Files
```bash
git add .
```

### 1.3 Commit Changes
```bash
git commit -m "Add complete CAPWA app with UI improvements and Netlify configuration"
```

### 1.4 Push to GitHub
```bash
git push origin React
```
(Or use `git push origin main` if your main branch is `main`)

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Go to Netlify**: Visit [https://app.netlify.com](https://app.netlify.com)

2. **Sign in/Sign up**: Use your GitHub account to sign in

3. **Add New Site**:
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account
   - Select your repository: `Conrad-Tinio/CAPWA-Website`

4. **Configure Build Settings**:
   - **Branch to deploy**: `React` (or `main` if that's your main branch)
   - **Build command**: `npm run build` (should auto-detect)
   - **Publish directory**: `dist` (should auto-detect)
   - Netlify will automatically detect the `netlify.toml` file we created

5. **Deploy**:
   - Click "Deploy site"
   - Wait for the build to complete (usually 1-2 minutes)

6. **Custom Domain (Optional)**:
   - After deployment, you can add a custom domain in Site settings
   - Netlify provides a free subdomain like `your-site.netlify.app`

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**:
```bash
netlify login
```

3. **Initialize and Deploy**:
```bash
netlify init
netlify deploy --prod
```

## Step 3: Verify Deployment

1. Visit your Netlify site URL (e.g., `https://your-site.netlify.app`)
2. Test all features:
   - Home page loads
   - Map displays correctly
   - Login/Register works
   - Admin dashboard accessible
   - Incident reporting works

## Configuration Files

### `netlify.toml`
This file is already created in your project root and contains:
- Build command: `npm run build`
- Publish directory: `dist`
- Redirect rules for React Router (SPA routing)

### `.gitignore`
Already configured to exclude:
- `node_modules/`
- `dist/`
- Environment files
- Editor files

## Troubleshooting

### Build Fails
- Check Netlify build logs
- Ensure Node.js version is 18+ (configured in `netlify.toml`)
- Verify all dependencies are in `package.json`

### Routing Issues (404 on refresh)
- The `netlify.toml` includes redirect rules for SPA routing
- If issues persist, check the redirect configuration

### Environment Variables
If you need environment variables:
1. Go to Site settings → Environment variables
2. Add variables like:
   - `VITE_APP_TITLE=CAPWA`
   - `VITE_DEFAULT_LAT=14.5995`
   - `VITE_DEFAULT_LNG=120.9842`

## Continuous Deployment

Netlify automatically deploys when you push to your connected branch:
- Every push triggers a new build
- Deploy previews are created for pull requests
- You can configure branch-specific settings

## Next Steps

1. ✅ Commit and push your code
2. ✅ Connect to Netlify
3. ✅ Deploy
4. 🎉 Share your live site!

