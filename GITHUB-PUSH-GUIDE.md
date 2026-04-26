# How to Push This Project to GitHub — Step-by-Step Guide

This guide walks you through publishing the LASUSTECH Learn portal to a GitHub repository so you can back it up, share it, or deploy it.

---

## Prerequisites

Before you begin, make sure you have:

- **Git** installed on your computer — download from https://git-scm.com
- A **GitHub account** — sign up free at https://github.com
- **Node.js** installed (already required to run the project)

---

## Part 1: Set Up Git on Your Computer (First Time Only)

Open a terminal (Command Prompt, PowerShell, or Git Bash) and run:

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your-email@example.com"
```

Replace the values with the name and email linked to your GitHub account.

---

## Part 2: Create a New Repository on GitHub

1. Go to **https://github.com** and sign in.
2. Click the **+** button (top-right) and select **New repository**.
3. Fill in the details:
   - **Repository name:** `lasustech-learn-portal` (or any name you choose)
   - **Description:** LASUSTECH e-Learning Portal
   - **Visibility:** Choose **Private** (recommended) or Public
   - **Do NOT** tick "Add a README file" — the project already has one
4. Click **Create repository**.
5. GitHub will show you a page with setup instructions. Keep it open — you will need the repository URL in the next step. It will look like:
   ```
   https://github.com/your-username/lasustech-learn-portal.git
   ```

---

## Part 3: Initialise Git in the Project Folder

Open a terminal and navigate to the project folder:

```bash
cd "C:\Users\HRC GROUP\webportal"
```

Run these commands in order:

### Step 1 — Initialise the repository
```bash
git init
```

### Step 2 — Create a .gitignore file (prevents uploading unnecessary files)
```bash
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
echo "client/build/" >> .gitignore
```

> **Note:** The `node_modules` folders are very large. They are excluded because anyone who clones the project can recreate them by running `npm install`.

### Step 3 — Add all project files to staging
```bash
git add .
```

### Step 4 — Review what will be committed (optional but recommended)
```bash
git status
```

### Step 5 — Create your first commit
```bash
git commit -m "Initial commit: LASUSTECH Learn Portal"
```

---

## Part 4: Connect to GitHub and Push

### Step 6 — Link your local project to the GitHub repository
Replace the URL below with the one from your GitHub repository page:

```bash
git remote add origin https://github.com/your-username/lasustech-learn-portal.git
```

### Step 7 — Rename the default branch to 'main' (if needed)
```bash
git branch -M main
```

### Step 8 — Push the project to GitHub
```bash
git push -u origin main
```

GitHub will ask you to sign in. Use your GitHub username and a **Personal Access Token** as the password (not your GitHub account password — see Part 5 below).

---

## Part 5: Generate a GitHub Personal Access Token (PAT)

GitHub no longer accepts plain passwords over HTTPS. You need a token:

1. Go to **https://github.com/settings/tokens**
2. Click **Generate new token (classic)**
3. Give it a name, e.g. `lasustech-portal`
4. Set an expiry (90 days is reasonable)
5. Under **Select scopes**, tick **repo** (full control of repositories)
6. Click **Generate token**
7. Copy the token immediately — GitHub only shows it once
8. When the terminal asks for your password during `git push`, paste the token

---

## Part 6: Future Updates (Pushing New Changes)

After you make changes to the code, push them with:

```bash
cd "C:\Users\HRC GROUP\webportal"
git add .
git commit -m "Describe what you changed here"
git push
```

Good commit messages describe the change, for example:
- `"Add forgot password instructions to login page"`
- `"Update VC photo and remove Sign In button from home navbar"`
- `"Fix student surname login authentication"`

---

## Part 7: Verify the Upload

1. Go to your repository page on GitHub: `https://github.com/your-username/lasustech-learn-portal`
2. You should see all your project files listed there
3. The `node_modules` folder should NOT appear (it was excluded by `.gitignore`)

---

## Quick Reference — Common Commands

| Command | What it does |
|---------|-------------|
| `git status` | Show which files have changed |
| `git add .` | Stage all changed files for commit |
| `git add filename` | Stage a specific file |
| `git commit -m "message"` | Save staged changes with a description |
| `git push` | Upload commits to GitHub |
| `git pull` | Download the latest changes from GitHub |
| `git log --oneline` | View commit history |

---

## Troubleshooting

**"git is not recognised as a command"**
— Git is not installed. Download and install it from https://git-scm.com, then restart your terminal.

**"remote origin already exists"**
— The repository is already linked. Skip the `git remote add` step. To check the current remote: `git remote -v`

**"src refspec main does not match any"**
— You have no commits yet. Make sure you ran `git add .` and `git commit` before pushing.

**Authentication failed**
— Use a Personal Access Token (see Part 5), not your GitHub account password.

---

*Guide prepared for LASUSTECH Learn Portal — webportal project.*
