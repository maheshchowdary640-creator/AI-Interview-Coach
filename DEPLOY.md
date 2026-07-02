# 🚀 Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide provides the exact steps to deploy your full-stack AI Interview Coach application. Because these deployments require linking your personal accounts and configuring sensitive environment variables (`GEMINI_API_KEY`, `MONGODB_URI`), you must trigger the deployments yourself using the instructions below.

---

## Step 1: Push Your Code to GitHub

1. Create a free account on [GitHub](https://github.com/) if you don't have one.
2. Create a new, empty repository named `ai-interview-coach` (keep it **Public** or **Private**). Do **NOT** initialize it with a README, `.gitignore`, or license.
3. Open a terminal in your project directory (`C:\Users\mahes\Desktop\AI Resume Analyzer`) and run the following commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of fullstack AI interview coach"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```

---

## Step 2: Deploy the Backend to Render

[Render](https://render.com/) is perfect for hosting the Node.js Express API.

1. Create a free account on Render and sign in using your **GitHub** account.
2. Click **New +** in the top right and select **Web Service**.
3. Under **Connect a repository**, choose your `ai-interview-coach` repository.
4. Set the following configurations:
   * **Name**: `ai-interview-coach-backend`
   * **Region**: Choose the one closest to you (e.g., Oregon or Singapore).
   * **Branch**: `main`
   * **Runtime**: `Node`
   * **Root Directory**: `backend` *(CRITICAL: This tells Render to run commands inside the backend folder)*
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
   * **Instance Type**: **Free**
5. Click **Advanced** and add the following **Environment Variables**:
   * `PORT`: `5000`
   * `NODE_ENV`: `production`
   * `MONGODB_URI`: *Your MongoDB connection string (e.g. MongoDB Atlas free cluster URI)*
   * `GEMINI_API_KEY`: *Your Google AI Studio API key*
6. Click **Create Web Service**. 
7. Once deployed, note down the generated Render URL (e.g. `https://ai-interview-coach-backend-xxxx.onrender.com`). You will need this for the frontend configuration.

---

## Step 3: Deploy the Frontend to Vercel

[Vercel](https://vercel.com/) is the premium hosting platform for React/Vite frontend assets.

1. Create a free account on Vercel and sign in using your **GitHub** account.
2. Click **Add New...** and select **Project**.
3. Import your `ai-interview-coach` repository.
4. Set the following configurations:
   * **Project Name**: `ai-interview-coach`
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend` *(CRITICAL: This tells Vercel to compile files in the frontend folder)*
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
   * **Install Command**: `npm install --legacy-peer-deps`
5. Expand the **Environment Variables** section and add:
   * `VITE_API_URL`: *The Render Backend URL you saved in Step 2, appended with `/api` (e.g. `https://ai-interview-coach-backend-xxxx.onrender.com/api`)*
6. Click **Deploy**.
7. Vercel will build the React application and provide you with your live URL (e.g. `https://ai-interview-coach.vercel.app`)!
