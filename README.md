# MT TM Counters

Phase 0 scaffolding for a web app version of the multitape Turing machine counter simulator.

## Stack

- Backend: FastAPI
- Frontend: React
- Tooling: Vite
- Styling and animation: Tailwind CSS

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

### Run Both Services Together

From the repo root:

```powershell
npm install
npm run setup
npm run dev
```

This uses `concurrently` to run:

- FastAPI from `backend`
- Vite from `frontend`

The backend runner prefers `backend\.venv\Scripts\python.exe` if it exists, and falls back to `python` otherwise.
The setup command installs frontend dependencies and creates or updates the backend virtual environment with `requirements.txt`.

## Phase 0 Goal

- Establish the backend/frontend split
- Verify FastAPI can load `CounterMachineTM` from `simulator.py`
- Provide a starter React UI that reads backend data
- Prepare the repo for Phase 1 simulation endpoints

## Phase 1 Backend API

Available endpoints:

- `GET /api/health`
- `GET /api/operations`
- `GET /api/project-info`
- `POST /api/simulations`

Example simulation request:

```json
{
  "operation": "INC",
  "register_values": [3, 0, 0, 0, 0],
  "parameters": {
    "target": 0
  },
  "num_registers": 5,
  "include_steps": true
}
```

## Phase 2 Frontend

Frontend structure:

- `src/pages/HomePage.jsx`
- `src/pages/Simulator.jsx`
- `src/components/simulator/SimulationForm.jsx`
- `src/components/simulator/SimulationSummary.jsx`
- `src/components/simulator/ExecutionTrace.jsx`

The simulator form fetches available operations from the backend and submits runs to `POST /api/simulations`.

## Phase 3 Playback

The frontend now includes guided trace playback using backend-returned step data only.

- `src/components/simulator/TracePlayer.jsx`
- next/previous navigation
- jump to first/last step
- autoplay
- playback speed selection
- focused tape viewer with highlighted head positions
