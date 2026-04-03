# MT TM Counters

Phase 0 scaffolding for a web app version of the multitape Turing machine counter simulator.

## Stack

- Backend: FastAPI
- Frontend: React
- Tooling: Vite

## Project Structure

```text
backend/
  app/
    main.py
    schemas.py
    services/
frontend/
  src/
simulator.py
```

## Local Setup

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Phase 0 Goal

- Establish the backend/frontend split
- Verify FastAPI can load `CounterMachineTM` from `simulator.py`
- Provide a starter React UI that reads backend data
- Prepare the repo for Phase 1 simulation endpoints
