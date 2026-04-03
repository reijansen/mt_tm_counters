from __future__ import annotations

from app.schemas import SimulationRequest
from app.services.simulator_adapter import run_simulation


def execute_simulation(request: SimulationRequest) -> dict:
    payload = run_simulation(
        operation=request.operation,
        register_values=request.register_values,
        parameters=request.parameters.model_dump(exclude_none=True),
        num_registers=request.num_registers,
    )
    if not request.include_steps:
        payload["steps"] = []
    return payload
