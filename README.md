# MT TM Counters

An interactive web application for exploring a multitape Turing machine with counter-machine operations.

This project began as a final project for `CMSC 141 - Automata and Language Theory` under the `Bachelor of Science in Computer Science` program of the `Division of Physical Sciences and Mathematics`, `College of Arts and Sciences`, `University of the Philippines Visayas`.

The current web version is designed as a learner-friendly educational tool. It helps users inspect how selected counter-machine operations can be represented and executed through a multitape Turing machine model using structured traces, tape snapshots, and guided playback.

## Overview

The simulator supports a fixed set of operations:

- `INC`
- `DEC`
- `CZ`
- `CMP`
- `CLR`
- `CPY`

It is intentionally specialized. This is not a general-purpose Turing machine editor or arbitrary state-machine builder.

## Features

- Interactive simulator for supported counter-machine operations
- Guided step-by-step playback of recorded execution traces
- Tape viewer with head-position highlighting
- Register-value snapshots at each step
- Preset examples for demonstrations and self-study
- Dedicated guide page for interpreting traces and tape output
- Academic/project context page
- Responsive frontend for desktop and mobile use

## Tech Stack

**Frontend**

- React
- Vite
- Tailwind CSS

**Backend**

- FastAPI
- Pydantic
- Uvicorn

**Deployment**

- Vercel for the frontend
- Render for the backend

## Project Structure

```text
.
├─ backend/
│  ├─ app/
│  │  ├─ config.py
│  │  ├─ main.py
│  │  ├─ schemas.py
│  │  └─ services/
│  ├─ .env.example
│  ├─ requirements.txt
│  └─ runtime.txt
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ lib/
│  │  └─ pages/
│  ├─ .env.example
│  └─ package.json
├─ scripts/
├─ simulator.py
├─ package.json
└─ README.md
```

## Supported Operations

### `INC`
Increments a selected register by one.

### `DEC`
Decrements a selected register if it is nonzero.

### `CZ`
Checks whether a selected register is zero.

### `CMP`
Compares two registers for equality.

### `CLR`
Clears a selected register.

### `CPY`
Copies the contents of one register into another.

## Scope and Limitations

- Supports only the built-in operations listed above
- Uses binary tape encoding to represent register values
- Operates as a specialized educational simulator
- Does not support arbitrary transition editing
- Does not support free-form machine authoring
- Does not support unrestricted tape alphabets beyond the simulator's defined model

## Local Development

### Prerequisites

- Python `3.11` or `3.12`
- Node.js `18+`
- npm

### 1. Clone the Repository

```powershell
git clone <your-repo-url>
cd mt_tm_counters
```

### 2. Configure Environment Variables

Create the local environment files below.

**Frontend**  
Create `frontend/.env.local`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

**Backend**  
Create `backend/.env`

```env
FRONTEND_ORIGIN=http://localhost:5173
API_HOST=127.0.0.1
API_PORT=8000
```

Environment example files are included:

- [frontend/.env.example](./frontend/.env.example)
- [backend/.env.example](./backend/.env.example)

### 3. Install Dependencies

**Backend**

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..
```

**Frontend**

```powershell
cd frontend
npm install
cd ..
```

### 4. Run the Application

#### Option A: Run Frontend and Backend Separately

**Backend**

```powershell
cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Frontend**

```powershell
cd frontend
npm run dev
```

#### Option B: Run Both from the Repository Root

```powershell
npm install
npm run setup
npm run dev
```

## Environment Variables

### Frontend

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `VITE_API_BASE_URL` | Yes | `http://127.0.0.1:8000` | Base URL of the FastAPI backend |

### Backend

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `FRONTEND_ORIGIN` | Yes | `http://localhost:5173` | Allowed frontend origin for CORS |
| `API_HOST` | No | `127.0.0.1` | Backend host |
| `API_PORT` | No | `8000` | Backend port |

## API Endpoints

### `GET /api/health`
Checks whether the simulator service is available.

### `GET /api/operations`
Returns the supported operation catalog.

### `GET /api/project-info`
Returns academic and project metadata.

### `POST /api/simulations`
Runs a simulation and returns the final state plus an optional trace.

Example request:

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

Example response shape:

```json
{
  "operation": "INC",
  "accepted": true,
  "halted_state": "qf",
  "step_count": 4,
  "registers": [4, 0, 0, 0, 0],
  "tapes": [],
  "head_positions": [],
  "steps": []
}
```

## Validation and Error Handling

The backend validates:

- operation code
- non-negative register values
- register count range
- operation-specific parameters
- parameter indices relative to `num_registers`

The frontend converts backend and network errors into learner-friendly messages instead of exposing raw internal details.

## Deployment

### Frontend on Vercel

Set this environment variable in Vercel:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

### Backend on Render

Recommended Render settings:

- Root Directory: `backend`
- Build Command:

```bash
pip install -r requirements.txt
```

- Start Command:

```bash
gunicorn -k uvicorn.workers.UvicornWorker app.main:app
```

Set these environment variables in Render:

```env
FRONTEND_ORIGIN=https://your-project.vercel.app
API_HOST=0.0.0.0
API_PORT=10000
PYTHON_VERSION=3.12.8
```

Python runtime is also pinned in [backend/runtime.txt](./backend/runtime.txt).

## Security Notes

### CORS

The backend uses `FRONTEND_ORIGIN` from configuration and restricts methods to:

- `GET`
- `POST`
- `OPTIONS`

Credentials are disabled because the project does not use cookie-based authentication.

### HTTPS

No application code changes are required for HTTPS:

- Vercel provides HTTPS for the frontend
- Render provides HTTPS for the backend

Use the deployed `https://` URLs in production environment variables.

### Secrets and Local Configuration

- Local `.env` files are ignored by Git
- `.env.example` files are committed for documentation only
- Production values should be stored in Vercel and Render dashboards

## Testing

### Test CORS

```powershell
curl -i -X OPTIONS http://127.0.0.1:8000/api/simulations `
  -H "Origin: http://localhost:5173" `
  -H "Access-Control-Request-Method: POST"
```

Check that:

- `access-control-allow-origin` matches the configured frontend origin
- allowed methods include `GET`, `POST`, and `OPTIONS`

### Test Invalid Input Handling

```powershell
curl -i -X POST http://127.0.0.1:8000/api/simulations `
  -H "Content-Type: application/json" `
  -d "{\"operation\":\"CMP\",\"register_values\":[1],\"parameters\":{\"left\":0},\"num_registers\":1,\"include_steps\":true}"
```

Expected behavior:

- `400` for operation-specific logical issues
- `422` for schema validation issues
- friendly frontend display of errors

### Test Production Health

Open these in the browser after deployment:

- `https://your-render-service.onrender.com/api/health`
- `https://your-render-service.onrender.com/api/operations`
- `https://your-render-service.onrender.com/api/project-info`

## Troubleshooting

### Render Build Uses Python 3.14

If Render still builds with Python `3.14`, confirm:

- [backend/runtime.txt](./backend/runtime.txt) exists
- Render Root Directory is set to `backend`
- `PYTHON_VERSION=3.12.8` is set in Render environment variables
- the latest commit has been pushed and redeployed

### Frontend Cannot Reach Backend

Check:

- `VITE_API_BASE_URL` in Vercel or `frontend/.env.local`
- `FRONTEND_ORIGIN` in Render or `backend/.env`
- deployed URLs do not contain trailing dots or malformed domains

### CORS Errors in Production

Most reported browser CORS failures in this project are actually caused by:

- wrong backend URL
- wrong frontend origin
- backend route returning `404`

Check the actual request URL first.

## Git and Repository Hygiene

Ignored local/development files include:

- `.env`
- `.env.local`
- `frontend/.env.local`
- `backend/.env`
- virtual environments
- Python caches
- build output folders
- editor metadata

Committed files that should remain tracked:

- `.env.example`
- `package-lock.json`
- source code
- deployment configuration files

## Author

**Rei Jansen Buerom**  
Final project origin: `CMSC 141 - Automata and Language Theory`  
`Bachelor of Science in Computer Science`  
`University of the Philippines Visayas`

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.