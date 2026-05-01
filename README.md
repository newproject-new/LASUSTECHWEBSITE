# LASUSTECH Network-Aware Adaptive E-Learning Platform

![LASUSTECH Banner](client/public/images/lasustech_gate.jpg)

A state-of-the-art e-learning solution designed specifically for environments with varying network conditions. This platform utilizes "Network-Aware" technology to dynamically adjust content delivery, ensuring a seamless learning experience for students regardless of their internet speed.

## Key Features

### 🌐 Network-Aware Adaptation
- **Lite Mode:** Automatically detects slow connections and replaces heavy images/videos with lightweight CSS-generated placeholders and text summaries.
- **Medium Mode:** Serves optimized, compressed media assets.
- **High Mode:** Delivers full high-definition content for stable, high-speed connections.
- **Real-time Monitoring:** Integrated network dashboard for users to track their current connectivity status.

### 🎓 Academic Management
- **Student Portal:** Course catalog, lesson viewer with progress tracking, assignment submission, and interactive quizzes.
- **Lecturer Dashboard:** Comprehensive tools for managing courses, creating quizzes, grading assignments, and tracking student performance.
- **Admin Suite:** System-wide health monitoring, user management, and platform configuration.

### 💬 Engagement Tools
- **Discussion Forums:** Threaded discussions for each course to facilitate peer-to-peer learning.
- **Progress Tracking:** Visualized learning data using interactive charts (Recharts).
- **Notifications:** Real-time feedback via hot-toasts for actions like submissions and login.

## 🛠️ Tech Stack

- **Frontend:** React 18, Tailwind CSS, React Router 6, Recharts, Axios.
- **Backend:** Node.js, Express, JWT Authentication, Multer (File Handling).
- **Database:** JSON-based persistent store (ready for MongoDB/PostgreSQL migration).
- **Deployment:** Optimized for Firebase, Railway, and Vercel.

