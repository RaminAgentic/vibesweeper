# Deployment Guide - Minesweeper

This guide explains how to deploy the Minesweeper game to Vercel or Netlify.

## Pre-Deployment Checklist

- [x] Production build tested locally (`npm run build`)
- [x] All tests passing
- [x] PWA configuration verified
- [x] Bundle size < 500KB (gzipped)
- [x] No console errors in production build

## Option 1: Deploy to Vercel (Recommended)

### Prerequisites
- Vercel account (free tier available)
- Git repository pushed to GitHub/GitLab/Bitbucket

### Deployment Steps

#### Method A: Vercel CLI (Local)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Project will be automatically configured from `vercel.json`
   - First deployment creates a preview URL

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

#### Method B: Vercel Dashboard (Recommended)

1. **Visit** [vercel.com](https://vercel.com/)

2. **Import Git Repository:**
   - Click "Add New..." → "Project"
   - Import your GitHub/GitLab repository
   - Select the minesweeper project

3. **Configure Build Settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node Version: 18.x
   - (These are auto-detected from `vercel.json`)

4. **Environment Variables:**
   - None required for basic deployment
   - Add analytics keys if using external services

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)

6. **Automatic Deployments:**
   - Every push to `main` branch auto-deploys to production
   - Pull requests get preview deployments

### Post-Deployment (Vercel)

1. **Verify Deployment:**
   - Visit the deployed URL
   - Check PWA installation works
   - Test offline mode
   - Run Lighthouse audit

2. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add custom domain
   - Update DNS records as instructed
   - HTTPS automatically configured

## Option 2: Deploy to Netlify

### Prerequisites
- Netlify account (free tier available)
- Git repository pushed to GitHub/GitLab/Bitbucket

### Deployment Steps

#### Method A: Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Initialize:**
   ```bash
   netlify init
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

#### Method B: Netlify Dashboard (Recommended)

1. **Visit** [netlify.com](https://www.netlify.com/)

2. **Import Git Repository:**
   - Click "Add new site" → "Import an existing project"
   - Connect to Git provider
   - Select minesweeper repository

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

4. **Create `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [[headers]]
     for = "/assets/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000, immutable"

   [[headers]]
     for = "/sw.js"
     [headers.values]
       Cache-Control = "public, max-age=0, must-revalidate"

   [[headers]]
     for = "/manifest.webmanifest"
     [headers.values]
       Cache-Control = "public, max-age=86400"
   ```

5. **Deploy:**
   - Click "Deploy site"
   - Wait for build (~2-3 minutes)

### Post-Deployment (Netlify)

1. **Verify Deployment:**
   - Visit the deployed URL
   - Run production testing checklist
   - Verify PWA functionality

2. **Custom Domain:**
   - Go to Site settings → Domain management
   - Add custom domain
   - Configure DNS
   - HTTPS auto-configured with Let's Encrypt

## Continuous Deployment Setup

### Automatic Deployments

Both Vercel and Netlify support automatic deployments:

- **Production:** Pushes to `main` branch deploy to production
- **Preview:** Pull requests get unique preview URLs
- **Rollback:** Easy rollback to previous deployments in dashboard

### Build Notifications

Configure build notifications:
- Email notifications on build success/failure
- Slack/Discord webhooks
- GitHub status checks

## Environment Variables

If you add analytics or external services later:

### Vercel:
```bash
vercel env add VITE_ANALYTICS_KEY
```

### Netlify:
Site settings → Build & deploy → Environment → Add variable

## Monitoring & Analytics

### Built-in Metrics

**Vercel:**
- Built-in analytics (paid feature)
- Function logs
- Build logs
- Real-time monitoring

**Netlify:**
- Built-in analytics (paid feature)
- Form submissions (if added)
- Build logs
- Deploy previews

### External Services (Optional)

Add these for enhanced monitoring:

1. **Google Analytics** or **Plausible** (privacy-friendly)
   - Add tracking code to index.html or use React hooks

2. **Sentry** for error tracking
   - Install: `npm install @sentry/react`
   - Configure in main.tsx

3. **Lighthouse CI** for automated performance checks
   - Run on every deployment

## Performance Optimization

### Post-Deployment Optimizations:

1. **Enable Compression:**
   - Both platforms auto-enable gzip/brotli
   - Verify with browser DevTools

2. **CDN Configuration:**
   - Automatically handled by Vercel/Netlify
   - Edge network for global distribution

3. **Caching Strategy:**
   - Configured in vercel.json / netlify.toml
   - Assets: 1 year cache
   - Service worker: no cache (always fresh)

## Troubleshooting

### Build Fails

**Check:**
- Node version (should be 18+)
- All dependencies installed
- No TypeScript errors
- Build command correct

**Fix:**
```bash
# Test locally first
npm clean-install
npm run build
```

### PWA Not Working

**Check:**
- Manifest at /manifest.webmanifest
- Service worker at /sw.js
- HTTPS enabled (required for PWA)
- Icons present in /public

### 404 Errors

**Check:**
- SPA redirect rules configured
- vercel.json or netlify.toml present
- Build output directory correct (dist)

## Deployment Checklist

Before marking deployment complete:

- [ ] Build succeeds locally
- [ ] Deployed successfully to Vercel or Netlify
- [ ] Public URL accessible
- [ ] PWA installable on Chrome/Edge
- [ ] Offline mode works
- [ ] All features functional
- [ ] Lighthouse scores ≥ 90
- [ ] Custom domain configured (if applicable)
- [ ] Automatic deployments working
- [ ] No console errors on deployed site

## Quick Deploy Commands

### Vercel
```bash
# First time
npm install -g vercel
vercel login
vercel

# Subsequent deploys
vercel --prod
```

### Netlify
```bash
# First time
npm install -g netlify-cli
netlify login
netlify init

# Subsequent deploys
netlify deploy --prod
```

## URLs

After deployment, you'll receive:

- **Production URL:** `https://minesweeper-yourusername.vercel.app`
- **Preview URLs:** Unique URL for each PR/branch
- **Custom Domain:** `https://yourdomain.com` (if configured)

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html

---

**Ready to deploy? Follow the steps above and your Minesweeper game will be live in minutes!**
