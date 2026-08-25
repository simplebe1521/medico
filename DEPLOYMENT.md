# MEDSIM Deployment & Publishing Guide 🚀

This guide provides step-by-step instructions for publishing and deploying the **MEDSIM Medical Simulation & AI Learning Platform** to popular cloud platforms.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Option A: Deploy to Render.com (Recommended for Node.js)](#option-a-deploy-to-rendercom)
3. [Option B: Deploy to Vercel (Serverless Hosting)](#option-b-deploy-to-vercel)
4. [Option C: Deploy via Docker (Railway / Cloud Run / AWS / Azure)](#option-c-deploy-via-docker)
5. [Option D: Publish Code to GitHub](#option-d-publish-code-to-github)
6. [Environment Variables](#environment-variables)

---

## Prerequisites
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/).
- Git installed on your system.
- Node.js 18+ installed.

---

## Option A: Deploy to Render.com

Render supports standard web services and dynamic Express backends.

1. **Push your code to a GitHub repository** (see Option D below).
2. Log in to [Render.com](https://render.com/).
3. Click **New +** -> **Blueprint** or **Web Service**.
4. Connect your GitHub repository. Render will automatically detect `render.yaml`.
5. Add your environment variable:
   - `GEMINI_API_KEY`: `your_actual_gemini_api_key`
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide your public application URL (e.g., `https://medsim.onrender.com`).

---

## Option B: Deploy to Vercel

Vercel provides instant zero-config deployments for web apps.

1. Install Vercel CLI locally (or connect Vercel via GitHub):
   ```bash
   npm install -g vercel
   ```
2. Run `vercel` in the project root:
   ```bash
   vercel
   ```
3. Follow the CLI prompts. Set environment variables when prompted:
   ```bash
   GEMINI_API_KEY=your_actual_gemini_api_key
   ```
4. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## Option C: Deploy via Docker

You can build and containerize MEDSIM to deploy anywhere Docker is supported (Railway, Cloud Run, Fly.io, AWS App Runner).

1. **Build the Docker Image**:
   ```bash
   docker build -t medsim:latest .
   ```
2. **Run locally to verify**:
   ```bash
   docker run -d -p 8001:8001 --env GEMINI_API_KEY="your_api_key" --name medsim-app medsim:latest
   ```
3. Open `http://localhost:8001` in your browser.

---

## Option D: Publish Code to GitHub

1. Initialize git (if not already done):
   ```bash
   git init
   ```
2. Stage and commit files:
   ```bash
   git add .
   git commit -m "Initial commit - Prepare MEDSIM for publishing & deployment"
   ```
3. Create a repository on [GitHub](https://github.com/new).
4. Link local repo and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/medsim.git
   git branch -M main
   git push -u origin main
   ```

---

## Environment Variables Reference

| Variable | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key for AI Tutor & Assistant | **Yes** | - |
| `PORT` | HTTP Server port | No | `8001` |
| `NODE_ENV` | Application environment (`production` / `development`) | No | `development` |
