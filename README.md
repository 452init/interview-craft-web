# InterviewCraft

InterviewCraft is a modern, AI-powered application that generates role-specific interview questions based on a given job position, seniority level, and focus area.

## Architecture

- **Frontend**: React + TypeScript + Vite, using a premium custom glassmorphism Vanilla CSS design.
- **Backend**: Python + Flask + Google Gemini AI.
- **Database**: PostgreSQL (using SQLAlchemy).

---

## Step-by-Step Explanation of Decisions

1. **Frontend Architecture**: I chose React (via Vite) and TypeScript because it provides a robust, fast development environment. The UI features debounced API calls for dynamically fetching focus areas while the user types the position, reducing unnecessary network requests.
2. **Dynamic Focus Areas**: When the user enters a job title, a request is made to the backend which asks the Gemini AI to suggest 5 focus areas relevant to that job. This ensures that the focus areas adapt beautifully to *any* white-collar job input by the user.
3. **Backend Architecture**: Flask provides a lightweight, easy-to-deploy API layer. It serves two endpoints:
   - `GET /api/focus-areas`: Calls Gemini AI to suggest areas.
   - `POST /api/generate-questions`: Calls Gemini AI to generate exactly 3 questions and saves the entry to PostgreSQL.
4. **Database (PostgreSQL)**: I save generated questions to Postgres for auditing and caching purposes. SQLAlchemy was chosen to abstract the SQL queries and make model management simple.
5. **Deployment Suitability**: The backend is structured with an `api/index.py` and a `vercel.json` file, which makes it natively compatible with Vercel's Serverless Functions. 

---

## What You Need to Add (Prerequisites)

Before running the application, you need to set up two things:

### 1. Database Connection (Supabase)
Since you plan to host the database on Supabase:
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Go to **Project Settings -> Database** and copy the `URI` connection string.
3. It will look like this: `postgresql://postgres.xxx:your-password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`
4. Replace `your-password` with your actual database password.

### 2. Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key**.
3. Copy the generated key.

---

## How to Run Locally

### 1. Backend Setup
Navigate to the `backend` folder and create a virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory and add your keys:
```env
# backend/.env
DATABASE_URL=postgresql://postgres... (Your Supabase URL)
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend server:
```bash
python api/index.py
```
*The backend will run on `http://localhost:5000`.*

### 2. Frontend Setup
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (if your backend isn't on port 5000):
```env
# frontend/.env
VITE_API_URL=http://localhost:5000
```

Run the frontend server:
```bash
npm run dev
```
*The frontend will run on `http://localhost:5173`. Open it in your browser!*

---

## Testing the Application

The backend includes a suite of unit tests. You can run them using `pytest`.

```bash
cd backend
pip install -r requirements-dev.txt
PYTHONPATH=.. pytest
```

---

## Deployment to Vercel

1. **Frontend Deployment**: Connect your GitHub repository to Vercel. Vercel will automatically detect the Vite React app in the `frontend` directory. Ensure you set the `Root Directory` in Vercel to `frontend`.
2. **Backend Deployment**: Create a *separate* Vercel project for the backend. Set the `Root Directory` to `backend`. Vercel will detect `api/index.py` and `vercel.json` and deploy it as a Serverless Python API. Don't forget to add `DATABASE_URL` and `GEMINI_API_KEY` to the Environment Variables settings in Vercel.
3. Once the backend is deployed, go back to your Frontend Vercel project settings and add an Environment Variable:
   `VITE_API_URL` = `<your-backend-vercel-url>`
