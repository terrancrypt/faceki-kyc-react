# Deployment Guide - Vercel

## Prerequisites

- Node.js 18+ (Vercel supports Node.js 18.x)
- pnpm package manager
- Vercel account

## Deployment Steps

### 1. Prepare for Deployment

The project is already configured for Vercel deployment with:
- `vercel.json` configuration file
- Proper build scripts in `package.json`
- TypeScript configuration for production builds

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts to configure your project
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`
5. Click "Deploy"

### 3. Environment Variables

No environment variables are required for this project as it uses client-side processing.

### 4. Build Configuration

The project uses:
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x (automatically set by Vercel)

### 5. Important Notes

#### Camera Access
- The app requires camera access which only works on HTTPS
- Vercel automatically provides HTTPS for all deployments
- Users will need to grant camera permissions

#### AI Models
- Face detection models are loaded from CDN
- First load may take a few minutes
- No server-side processing required

#### Browser Compatibility
- Modern browsers with WebRTC support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers may have limited functionality

### 6. Troubleshooting

#### Build Errors
- Ensure Node.js version is 18+
- Check that all dependencies are properly installed
- Verify TypeScript compilation passes locally

#### Camera Issues
- Ensure HTTPS is enabled (automatic on Vercel)
- Check browser permissions
- Test on different browsers

#### Performance
- Models are loaded from CDN for faster initial load
- Consider implementing lazy loading for better performance
- Monitor bundle size (currently ~850KB)

### 7. Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

### 8. Monitoring

- Use Vercel Analytics to monitor performance
- Check build logs for any issues
- Monitor camera access errors in browser console

## Support

For deployment issues:
1. Check Vercel build logs
2. Verify local build works: `pnpm run build`
3. Test camera functionality locally first
4. Check browser console for errors

