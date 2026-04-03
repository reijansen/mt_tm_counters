from fastapi import FastAPI
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import FRONTEND_ORIGIN
from app.schemas import (
    HealthResponse,
    OperationCatalogResponse,
    ProjectInfoResponse,
    SimulationRequest,
    SimulationResponse,
)
from app.services.simulation_service import execute_simulation
from app.services.simulator_adapter import get_machine_class_name, get_operation_catalog


app = FastAPI(
    title="MT TM Counters API",
    version="0.1.0",
    description="Backend API for the multitape Turing machine counter simulator.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    machine_name = get_machine_class_name()
    return HealthResponse(
        status="ok",
        message=f"FastAPI is running and connected to {machine_name}.",
    )


@app.get("/api/operations", response_model=OperationCatalogResponse)
def list_operations() -> OperationCatalogResponse:
    return OperationCatalogResponse(operations=get_operation_catalog())


@app.get("/api/project-info", response_model=ProjectInfoResponse)
def project_info() -> ProjectInfoResponse:
    return ProjectInfoResponse(
        title="Multitape Turing Machine with Counter Machine Implementation",
        developer="Rei Jansen Buerom",
        course="CMSC 141 - Automata and Language Theory",
        program="Bachelor of Science in Computer Science",
        division="Division of Physical Sciences and Mathematics",
        college="College of Arts and Sciences",
        university="University of the Philippines Visayas",
    )


@app.post("/api/simulations", response_model=SimulationResponse)
def run_simulation_endpoint(request: SimulationRequest) -> SimulationResponse:
    try:
        return SimulationResponse(**execute_simulation(request))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
