# LASUSTECH Learn Portal — Deployment Guide

This guide covers deploying the portal on a Linux server (Ubuntu 22.04 recommended), a Windows server, and optionally via Docker.

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Clone and Install Dependencies](#2-clone-and-install-dependencies)
3. [Configure Environment Variables](#3-configure-environment-variables)
4. [Build the Frontend](#4-build-the-frontend)
5. [Run the Application](#5-run-the-application)
6. [Production Setup with PM2 (Recommended)](#6-production-setup-with-pm2-recommended)
7. [Serving with Nginx (Reverse Proxy)](#7-serving-with-nginx-reverse-proxy)
8. [SSL / HTTPS with Certbot](#8-ssl--https-with-certbot)
9. [Docker Deployment (Optional)](#9-docker-deployment-optional)
10. [Updating the Application](#10-updating-the-application)
11. [Troubleshooting](#11-troubleshooting)
12. [Firebase Deployment (Hosting + Cloud Functions)](#12-firebase-deployment-hosting--cloud-functions)
13. [Vercel Deployment](#13-vercel-deployment)

---

## 1. Prerequisites

Install the following on your server:

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18.x or 20.x LTS | Required for both client and server |
| npm | 9.x or later | Comes with Node.js |
| Git | Any recent | For cloning the repo |
| Nginx | 1.18+ | For reverse proxy (recommended) |
| PM2 | Latest | For process management (recommended) |

**Install Node.js on Ubuntu:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # Should print v20.x.x
npm -v    # Should print 9.x.x or higher
```

**Install PM2 globally:**
```bash
sudo npm install -g pm2
```

---

## 2. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url> /var/www/lasustech-portal
cd /var/www/lasustech-portal

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

---

## 3. Configure Environment Variables

**Server environment (`server/.env`):**

Create the file:
```bash
nano /var/www/lasustech-portal/server/.env
```

Add the following (change values for production):
```env
PORT=5000
JWT_SECRET=your-very-strong-random-secret-key-here
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
```

> Generate a strong JWT secret:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

**Client environment (`client/.env.production`):**

```bash
nano /var/www/lasustech-portal/client/.env.production
```

```env
REACT_APP_API_URL=https://yourdomain.com/api
```

> Replace `yourdomain.com` with your actual domain or server IP.

---

## 4. Build the Frontend

```bash
cd /var/www/lasustech-portal/client
npm run build
```

This creates a `client/build/` folder with the compiled static files. This step takes 1–3 minutes.

---

## 5. Run the Application

### Development (test only)

```bash
# From project root — starts both client and server concurrently
npm run dev
```

### Production (manual)

```bash
# Start the API server
cd /var/www/lasustech-portal/server
node server.js
```

The API will listen on port **5000** by default.

---

## 6. Production Setup with PM2 (Recommended)

PM2 keeps the server running after a crash or reboot.

```bash
cd /var/www/lasustech-portal/server

# Start the server with PM2
pm2 start server.js --name "lasustech-api"

# Save the process list so it restarts on system reboot
pm2 save

# Set PM2 to launch on startup
pm2 startup
# Follow the command printed on screen (copy-paste and run it)
```

**Useful PM2 commands:**
```bash
pm2 status                    # View running processes
pm2 logs lasustech-api        # Tail the server logs
pm2 restart lasustech-api     # Restart after code updates
pm2 stop lasustech-api        # Stop the server
pm2 delete lasustech-api      # Remove from PM2
```

---

## 7. Serving with Nginx (Reverse Proxy)

Nginx serves the built React frontend as static files and proxies `/api` calls to the Node.js server.

**Install Nginx:**
```bash
sudo apt install -y nginx
```

**Create a site configuration:**
```bash
sudo nano /etc/nginx/sites-available/lasustech
```

Paste the following (replace `yourdomain.com` with your domain or IP):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Serve the React build
    root /var/www/lasustech-portal/client/build;
    index index.html;

    # Handle React Router — send all non-API requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded files
    location /uploads/ {
        alias /var/www/lasustech-portal/server/uploads/;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/lasustech /etc/nginx/sites-enabled/
sudo nginx -t        # Test configuration
sudo systemctl reload nginx
```

---

## 8. SSL / HTTPS with Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain an SSL certificate (replace with your actual domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot auto-renews certificates. Verify renewal works:
sudo certbot renew --dry-run
```

After Certbot, your Nginx config will be updated automatically to redirect HTTP → HTTPS.

---

## 9. Docker Deployment (Optional)

If you prefer containers, create these files in the project root:

**`Dockerfile`** (for the server):
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install --production
COPY server ./server
EXPOSE 5000
CMD ["node", "server/server.js"]
```

**`docker-compose.yml`:**
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - JWT_SECRET=your-secret-here
      - NODE_ENV=production
    restart: unless-stopped
    volumes:
      - ./server/uploads:/app/server/uploads
```

**Build and run:**
```bash
# Build the React client first
cd client && npm run build && cd ..

# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f api
```

Serve `client/build/` using Nginx as described in Step 7, pointing to the Docker-hosted API on `localhost:5000`.

---

## 10. Updating the Application

```bash
cd /var/www/lasustech-portal

# Pull latest code
git pull origin main

# Update backend dependencies (if package.json changed)
cd server && npm install && cd ..

# Rebuild the frontend
cd client && npm install && npm run build && cd ..

# Restart the API server
pm2 restart lasustech-api
```

---

## 11. Troubleshooting

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| `Cannot connect to API` | Server not running on port 5000 | Run `pm2 status` and check logs |
| `White screen / 404 on refresh` | Nginx not configured for React Router | Ensure `try_files $uri /index.html` is in Nginx config |
| `JWT errors on login` | JWT_SECRET mismatch | Ensure `.env` JWT_SECRET is set and server was restarted |
| `File uploads failing` | Uploads directory missing or no permissions | `mkdir -p server/uploads && chmod 755 server/uploads` |
| `Port 5000 already in use` | Another process on port 5000 | `lsof -i :5000` then `kill -9 <PID>` |
| `Nginx 502 Bad Gateway` | API server is down | `pm2 restart lasustech-api` |
| `CORS errors in browser` | Client URL not matching `CLIENT_URL` in `.env` | Update `CLIENT_URL` in `server/.env` to match your domain |

---

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lasustech.edu.ng | 123456 |
| Lecturer | prof.basit@lasustech.edu.ng | 123456 |
| Student | john.ola@student.lasustech.edu.ng | 141414 |

> **Important:** Change all default passwords before going live.

---

## Port Reference

| Service | Port | Notes |
|---------|------|-------|
| Node.js API | 5000 | Internal — proxied by Nginx |
| Nginx HTTP | 80 | Public |
| Nginx HTTPS | 443 | Public (after SSL setup) |

---

## 12. Firebase Deployment (Hosting + Cloud Functions)

Firebase Hosting serves the React frontend; Firebase Cloud Functions runs the Express API. This is the originally intended production architecture for this project.

> **Important note on the data store:** The current server uses an in-memory data store that resets on every cold start. For a lasting Firebase deployment, the data store must be replaced with **Firebase Firestore** (the database originally specified in the project design). The steps below deploy what exists now and flag exactly where to swap in Firestore.

### Step 1 — Create a Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project**, name it (e.g. `lasustech-portal`), and follow the prompts.
3. In the project dashboard, go to **Project settings → General** and note your **Project ID**.

### Step 2 — Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login        # opens browser for Google sign-in
firebase projects:list   # confirm your project appears
```

### Step 3 — Initialise Firebase in the project

Run this from the project root (`/var/www/lasustech-portal` or your local folder):

```bash
firebase init
```

When prompted, select these features using the spacebar, then press Enter:
- **Hosting: Configure files for Firebase Hosting**
- **Functions: Configure a Cloud Functions directory**

Answer the setup questions as follows:

| Question | Answer |
|----------|--------|
| Use an existing project? | Yes → select your project |
| What do you want to use as your public directory? | `client/build` |
| Configure as a single-page app (rewrite all URLs to /index.html)? | **Yes** |
| Set up automatic builds and deploys with GitHub? | No |
| What language would you like to use in Cloud Functions? | JavaScript |
| Do you want to use ESLint? | No |
| Do you want to install dependencies now? | Yes |

This creates `firebase.json` and a `functions/` directory.

### Step 4 — Wrap the Express server as a Cloud Function

Install the required package inside `functions/`:
```bash
cd functions
npm install express cors bcryptjs jsonwebtoken multer
```

Create `functions/index.js`:
```js
const functions = require('firebase-functions');
const app = require('../server/server');   // re-use the existing Express app

exports.api = functions.https.onRequest(app);
```

Then open `server/server.js` and make sure the last line **exports** the app rather than calling `app.listen` directly when running inside Functions. Add this at the bottom:

```js
// Export app for Firebase Functions; listen only when run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
```

### Step 5 — Update `firebase.json` for API rewrites

Open `firebase.json` and update the `hosting` block so all `/api/**` requests are forwarded to the Cloud Function:

```json
{
  "hosting": {
    "public": "client/build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "/api/**", "destination": "/api/**", "function": "api" },
      { "source": "**",      "destination": "/index.html" }
    ]
  },
  "functions": {
    "source": "functions"
  }
}
```

### Step 6 — Set environment variables for the Function

```bash
firebase functions:config:set app.jwt_secret="your-strong-secret-here" app.node_env="production"
```

Then inside `server/server.js` (or wherever `process.env.JWT_SECRET` is read), add a fallback for Functions config:

```js
const functions = require('firebase-functions');
const JWT_SECRET = process.env.JWT_SECRET || functions.config().app?.jwt_secret;
```

### Step 7 — Build the frontend and deploy

```bash
# Build React
cd client
REACT_APP_API_URL=/api npm run build
cd ..

# Deploy everything
firebase deploy
```

Or deploy individually:
```bash
firebase deploy --only hosting     # frontend only
firebase deploy --only functions   # backend only
```

After deployment, Firebase prints your live URL (e.g. `https://lasustech-portal.web.app`).

### Step 8 — Custom domain (optional)

In the Firebase console → Hosting → **Add custom domain**, follow the DNS verification steps for your domain registrar.

### Firestore migration (for persistent data)

To replace the in-memory store with Firestore:

1. Enable Firestore in the Firebase console (Build → Firestore Database → Create database).
2. Install the SDK: `cd server && npm install firebase-admin`
3. Download a service account key from Project settings → Service accounts → Generate new private key. Save it as `server/serviceAccountKey.json`.
4. Initialise in `server/server.js`:
   ```js
   const admin = require('firebase-admin');
   admin.initializeApp({ credential: admin.credential.cert(require('./serviceAccountKey.json')) });
   const db = admin.firestore();
   ```
5. Replace all reads/writes in `server/data/store.js` with `db.collection(...)` calls.

---

## 13. Vercel Deployment

Vercel is best suited for deploying the **React frontend**. The Express backend can run on Vercel as a Serverless Function, but because Vercel Functions are stateless, the in-memory data store resets on every cold start. Use **Option A** (split hosting) for any real usage.

> **Recommendation:** Deploy the frontend on Vercel and the backend on **Railway** or **Render** (both have free tiers, persistent Node.js processes, and simple GitHub deploys).

---

### Option A — Frontend on Vercel + Backend on Railway/Render (Recommended)

#### Deploy the backend on Railway

1. Create a free account at [https://railway.app](https://railway.app).
2. Click **New Project → Deploy from GitHub repo** and select your repository.
3. In the service settings, set:
   - **Root directory:** `server`
   - **Start command:** `node server.js`
4. Add environment variables under the **Variables** tab:
   ```
   PORT=5000
   JWT_SECRET=your-strong-secret-here
   NODE_ENV=production
   CLIENT_URL=https://your-app.vercel.app
   ```
5. Railway provides a public URL like `https://lasustech-api.up.railway.app`. Note it down.

#### Deploy the frontend on Vercel

1. Push your project to GitHub (if not already done).
2. Go to [https://vercel.com](https://vercel.com) and click **Add New → Project**.
3. Import your GitHub repository.
4. In the project configuration:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Under **Environment Variables**, add:
   ```
   REACT_APP_API_URL=https://lasustech-api.up.railway.app/api
   ```
   Replace the URL with your Railway backend URL from the previous step.
6. Click **Deploy**. Vercel builds and publishes the frontend.

#### Fix CORS on the backend

Update `server/.env` (or Railway environment variables) so the backend accepts requests from your Vercel domain:
```
CLIENT_URL=https://your-app.vercel.app
```

---

### Option B — Full-stack on Vercel (Serverless)

This option runs both frontend and backend on Vercel. Suitable only for **demos** because the in-memory store loses all data on cold starts.

#### 1. Create `vercel.json` in the project root

```json
{
  "version": 2,
  "builds": [
    { "src": "client/package.json", "use": "@vercel/static-build", "config": { "distDir": "build" } },
    { "src": "server/server.js",    "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server/server.js" },
    { "src": "/(.*)",     "dest": "client/build/$1"  }
  ]
}
```

#### 2. Make the Express server export the app

At the bottom of `server/server.js`, ensure the app is exported (same change as in the Firebase section):
```js
if (require.main === module) {
  app.listen(process.env.PORT || 5000);
}
module.exports = app;
```

#### 3. Add a `vercel-build` script to `client/package.json`

```json
"scripts": {
  "vercel-build": "react-scripts build"
}
```

#### 4. Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Or push to GitHub and connect the repo on [vercel.com](https://vercel.com) — Vercel detects `vercel.json` automatically.

#### 5. Set environment variables in the Vercel dashboard

Go to your project → **Settings → Environment Variables** and add:
```
JWT_SECRET=your-strong-secret-here
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
REACT_APP_API_URL=/api
```

---

### Vercel custom domain

In the Vercel dashboard → **Domains**, add your domain and follow the DNS instructions for your registrar.
