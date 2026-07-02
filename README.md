# PrepAI: Full-Stack AI Interview Coach

PrepAI is a full-stack web application designed to help job seekers and students prepare for upcoming interviews. Powered by Google Gemini AI, it generates customized mock interview questions based on the candidate's resume and a target job description, evaluates their answers using the STAR method, and provides detailed performance diagnostics alongside a downloadable PDF report.

---

## Features

1. **Modern SaaS Landing Page**: Beautiful dark-theme layout complete with a Hero section, core features lists, interactive how-it-works stepper, and mock pricing plans.
2. **Onboarding & Dashboard**: Onboard candidate profiles to track historic interview logs, completed counts, and cumulative score metrics.
3. **Tailored Question Generation**: Upload a resume PDF (auto text extraction) and paste a target job listing. Select the interview type (HR, Technical, Project, or Internship) and difficulty level to generate exactly 10 custom questions.
4. **Interactive Mock Session**: Live practice view to answer questions one by one. Preserves answers for easy back/forth review and warns users on skipping.
5. **STAR Answer Evaluation**: Recieve instant scores out of 10 for each response, highlighting strengths, identified gaps, actionable prep tips, and model answers.
6. **Detailed Scorecard & Roadmap**: Radial overall score gauges, capabilites bars, side-by-side lists of strong/weak areas, and a multi-phase personalized study roadmap.
7. **Direct PDF Download**: Export a clean, styled multi-page PDF evaluation report directly from the client.
8. **Robust Offline Fallbacks**: Automatically logs warnings and switches to high-quality mock questions and evaluations if MongoDB or the Gemini API key is missing.

---

## Tech Stack

* **Frontend**: React (Vite) + Tailwind CSS (v3) + React Router DOM + Lucide Icons
* **Backend**: Node.js + Express + Multer (PDF uploads) + pdf-parse (text extraction) + pdfkit (PDF generation)
* **Database**: MongoDB + Mongoose
* **AI Provider**: Google Gemini API (`gemini-1.5-flash`)

---

## Prerequisites

* **Node.js**: v18 or higher (v24 recommended)
* **npm**: v9 or higher
* **MongoDB**: A running local instance (`mongodb://127.0.0.1:27017/`) or a MongoDB Atlas connection string.

---

## Getting Started

### 1. Configure Environment Variables
Navigate to the `backend/` folder and locate the `.env` configuration file (created automatically or from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-interview-coach
GEMINI_API_KEY=your_gemini_api_key_here
```
*Replace `your_gemini_api_key_here` with a valid Google Gemini API Key. You can get one from the [Google AI Studio](https://aistudio.google.com/).*

### 2. Install Dependencies (Single Command)
In the project root directory, run the following command to install dependencies for the root, backend, and frontend concurrently:
```bash
npm run install-all
```

### 3. Run the Application
Start both the React front-end server and Node.js backend server concurrently using:
```bash
npm run dev
```

### 4. Access the Application
* **Frontend**: Open [http://localhost:5173](http://localhost:5173) in your browser.
* **Backend API**: Running on [http://localhost:5000](http://localhost:5000).

---

## API Endpoints Reference

* **POST** `/api/users` - Create or retrieve User profile
* **POST** `/api/upload-resume` - Extract text from uploaded PDF
* **POST** `/api/generate-questions` - Analyze resume/JD and generate 10 questions
* **POST** `/api/evaluate-answers` - Grade responses and generate scorecard
* **POST** `/api/generate-report` - Generate downloadable PDF report
* **GET** `/api/interviews` - Fetch all historic interviews for a user
* **GET** `/api/interviews/:id` - Fetch single interview session log
"# AI-Interview-Coach" 
