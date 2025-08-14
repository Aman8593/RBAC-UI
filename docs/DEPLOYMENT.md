# Deployment Guide

## Environment Setup

### Required Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/rbac-ui?retryWrites=true&w=majority"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_JWT_SECRET="your-jwt-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# Development
NODE_ENV="production"
```

### Environment Variable Details

#### `DATABASE_URL`

- MongoDB connection string
- Use MongoDB Atlas for cloud hosting
- Ensure network access is configured for your deployment platform

#### `NEXTAUTH_SECRET`

- Used to encrypt JWT tokens and session data
- Generate with: `openssl rand -base64 32`
- Must be consistent across deployments

#### `NEXTAUTH_JWT_SECRET`

- Additional JWT encryption key
- Generate with: `openssl rand -base64 32`
- Keep separate from NEXTAUTH_SECRET

#### `NEXTAUTH_URL`

- Your application's base URL
- Include protocol (https://)
- No trailing slash

## Vercel Deployment (Recommended)

### Prerequisites

- Vercel account
- GitHub repository
- MongoDB Atlas database

### Steps

1. **Connect Repository**

   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel

   # Login to Vercel
   vercel login
   ```

2. **Configure Project**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select "Next.js" framework preset

3. **Environment Variables**

   - In Vercel dashboard, go to Project Settings
   - Navigate to Environment Variables
   - Add all required variables from `.env`
   - Ensure they're available for Production, Preview, and Development

4. **Database Setup**

   - Ensure MongoDB Atlas allows connections from `0.0.0.0/0` (all IPs)
   - Or configure Vercel's IP ranges in MongoDB Atlas

5. **Deploy**

   ```bash
   # Automatic deployment on git push
   git push origin main

   # Or manual deployment
   vercel --prod
   ```

### Vercel Configuration

Create `vercel.json` for advanced configuration:

```json
{
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Railway Deployment

### Steps

1. **Create Railway Account**

   - Sign up at [railway.app](https://railway.app)
   - Connect GitHub account

2. **Deploy Project**

   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Initialize project
   railway init

   # Deploy
   railway up
   ```

3. **Configure Environment**
   ```bash
   # Set environment variables
   railway variables set DATABASE_URL="your-mongodb-url"
   railway variables set NEXTAUTH_SECRET="your-secret"
   railway variables set NEXTAUTH_JWT_SECRET="your-jwt-secret"
   railway variables set NEXTAUTH_URL="https://your-app.railway.app"
   ```

## Netlify Deployment

### Prerequisites

- Netlify account
- Build command: `npm run build`
- Publish directory: `.next`

### Steps

1. **Build Configuration**
   Create `netlify.toml`:

   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [build.environment]
     NODE_ENV = "production"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Deploy**
   - Connect repository in Netlify dashboard
   - Configure environment variables
   - Deploy automatically on push

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_JWT_SECRET=${NEXTAUTH_JWT_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## Database Migration

### Production Database Setup

1. **MongoDB Atlas Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push
   ```

2. **Seed Data (Optional)**
   ```bash
   # Create seed script
   npx prisma db seed
   ```

### Migration Commands

```bash
# Generate Prisma client
npx prisma generate

# Apply schema changes
npx prisma db push

# Reset database (development only)
npx prisma migrate reset

# View database
npx prisma studio
```

## Performance Optimization

### Next.js Configuration

Update `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  images: {
    domains: ["your-image-domain.com"],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
```

### Build Optimization

```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# Build with analysis
ANALYZE=true npm run build
```

## Monitoring & Logging

### Error Tracking

1. **Sentry Integration**

   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**

   ```javascript
   // sentry.client.config.js
   import * as Sentry from "@sentry/nextjs";

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
   });
   ```

### Performance Monitoring

- Use Vercel Analytics
- Monitor Core Web Vitals
- Set up uptime monitoring

## Security Checklist

- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation added
- [ ] Error messages sanitized
- [ ] Dependency vulnerabilities checked

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Review build logs for specific errors

2. **Database Connection**

   - Verify DATABASE_URL format
   - Check network access rules
   - Test connection locally

3. **Authentication Issues**

   - Verify NEXTAUTH_URL matches deployment URL
   - Check secret keys are properly set
   - Ensure JWT secrets are consistent

4. **Performance Issues**
   - Enable compression
   - Optimize images
   - Use CDN for static assets
   - Implement caching strategies
