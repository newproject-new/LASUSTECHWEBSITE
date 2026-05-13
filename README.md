# LASUSTECH Network-Aware Adaptive E-Learning Platform

![LASUSTECH Banner](client/public/images/lasustech_gate.jpg)

A state-of-the-art e-learning solution designed specifically for environments with varying network conditions. This platform uses **Network-Aware** technology to dynamically adjust content delivery, ensuring a seamless learning experience for students regardless of their internet speed.

---

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Production Build](#production-build)
- [Default Accounts](#default-accounts)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Key Features

### 🌐 Network-Aware Adaptation
- **Lite Mode:** Automatically detects slow connections and replaces heavy images/videos with lightweight CSS-generated placeholders and text summaries.
- **Medium Mode:** Serves optimized, compressed media assets.
- **High Mode:** Delivers full high-definition content for stable, high-speed connections.
- **Real-time Monitoring:** Integrated network dashboard for users to track their current connectivity status.

### 🎓 Academic Management
- **Student Portal:** Course catalog, lesson viewer with progress tracking, assignment submission, and interactive quizzes.
- **Lecturer Dashboard:** Tools for managing courses, creating quizzes, grading assignments, and tracking student performance.
- **Admin Suite:** System-wide health monitoring, user management, and platform configuration.

### 💬 Engagement Tools
- **Discussion Forums:** Threaded discussions for each course to facilitate peer-to-peer learning.
- **Progress Tracking:** Visualized learning data using interactive charts (Recharts).
- **Notifications:** Real-time feedback via hot-toasts for actions like submissions and login.

---

## Tech Stack

- **Frontend:** React 18, Tailwind CSS, React Router 6, Recharts, Axios
- **Backend:** Node.js, Express, JWT Authentication, Multer (file handling)
- **Database:** JSON-based persistent store (ready for MongoDB/PostgreSQL migration)
- **Deployment:** Optimized for Firebase, Railway, and Vercel

---

## Project Structure

```
webportal/
├── client/          # React frontend (Create React App)
│   ├── public/
│   └── src/
├── server/          # Express backend API
│   ├── data/        # JSON persistence layer
│   ├── routes/
│   └── server.js
└── package.json     # Root scripts to run both
```

---

## Prerequisites

Before running the platform, make sure you have the following installed:

- **Node.js** `18.x` (required — specified in `engines`)
- **npm** `9.x` or newer (ships with Node 18)
- **Git** (to clone the repository)

Verify your installation:

```bash
node --version    # should print v18.x
npm --version
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd webportal
```

### 2. Install dependencies

Install dependencies for the root, server, and client in one command:

```bash
npm run install:all
```

This installs packages in three places: the root (for `concurrently`), `server/`, and `client/`.

---

## Environment Variables

### Backend (`server/.env`)

Create a file at [server/.env](server/.env) with the following variables:

```env
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
NODE_ENV=development
```

| Variable     | Required | Description                                            |
| ------------ | -------- | ------------------------------------------------------ |
| `JWT_SECRET` | Yes      | Secret used to sign authentication tokens. Use a strong random string in production. |
| `PORT`       | No       | Port the API listens on (defaults to `5000`).          |
| `NODE_ENV`   | No       | `development` or `production`.                         |

### Frontend (`client/.env.production`)

Only required for production builds. Copy the example:

```bash
cp client/.env.production.example client/.env.production
```

Then edit it:

```env
REACT_APP_API_URL=https://your-backend-url/api
```

In development, the React dev server proxies API calls to `http://localhost:5000` automatically via the `proxy` setting in [client/package.json](client/package.json) — no frontend `.env` is needed.

---

## Running the Application

### Development mode (recommended)

From the project root, start both the backend and frontend together:

```bash
npm run dev
```

This launches:
- **Backend API** at [http://localhost:5000](http://localhost:5000)
- **Frontend** at [http://localhost:3000](http://localhost:3000)

The frontend auto-proxies API requests to the backend, and both services hot-reload on file changes.

### Run services individually

If you want to run them in separate terminals:

```bash
# Terminal 1 — backend
npm run dev:server

# Terminal 2 — frontend
npm run dev:client
```

---

## Production Build

To create an optimized production build and serve it from the Express server:

```bash
npm run build
npm start
```

The build script:
1. Installs server and client dependencies
2. Builds the React app
3. Moves the compiled output to `server/build/` so Express can serve it

The combined app will be available at [http://localhost:5000](http://localhost:5000).

> **Note (Windows users):** The `build` script in [package.json](package.json) uses `rm -rf` and `mv`, which are POSIX commands. On Windows, run the build inside Git Bash or WSL, or run the steps manually:
> ```powershell
> npm install --prefix server
> npm install --prefix client
> npm run build --prefix client
> Remove-Item -Recurse -Force server\build -ErrorAction SilentlyContinue
> Move-Item client\build server\build
> ```

---

## Default Accounts

The JSON store is seeded with sample accounts for each role so you can sign in immediately. Check [server/data/store.js](server/data/store.js) for the current credentials, or register new accounts through the sign-up page.

---

## Available Scripts

Run from the project root:

| Script                | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `npm run install:all` | Install dependencies for root, server, and client.       |
| `npm run dev`         | Start backend and frontend concurrently in dev mode.     |
| `npm run dev:server`  | Start only the backend with `nodemon` (auto-reload).     |
| `npm run dev:client`  | Start only the React dev server.                         |
| `npm run build`       | Build the client and copy it into `server/build/`.       |
| `npm start`           | Run the production server (serves API + built client).   |

---

## Deployment

The platform is configured for several hosting providers:

- **Backend (API):** Railway, Render, or any Node.js host. Set `JWT_SECRET`, `PORT`, and `NODE_ENV=production` as environment variables.
- **Frontend (static build):** Vercel or Firebase Hosting. Set `REACT_APP_API_URL` to the deployed backend URL before building.
- **Single-host option:** Run `npm run build && npm start` to serve the entire app (frontend + API) from one Node process.

---

## Troubleshooting

- **Port `5000` already in use:** Change `PORT` in `server/.env` (and update `proxy` in `client/package.json` to match).
- **`npm run dev` fails immediately:** Run `npm run install:all` to make sure all three workspaces have dependencies installed.
- **API requests return 401:** Confirm `JWT_SECRET` is set in `server/.env` and that you're logged in. Tokens are cleared if the secret changes.
- **Login appears to succeed but data is empty:** The JSON store lives in `server/data/`. Delete the data file to reset to seeded defaults, or check file permissions.
- **`rm` / `mv` not recognized on Windows:** Use the manual PowerShell steps shown in the [Production Build](#production-build) section.

---

## License

This project is for academic and educational use at LASUSTECH.
