from __future__ import annotations

import importlib.util
import sys
from functools import lru_cache
from types import ModuleType

from app.config import SIMULATOR_PATH


@lru_cache(maxsize=1)
def load_simulator_module() -> ModuleType:
    spec = importlib.util.spec_from_file_location("simulator", SIMULATOR_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load simulator module from {SIMULATOR_PATH}")

    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def get_operation_catalog() -> list[dict]:
    module = load_simulator_module()
    return module.get_operation_catalog()


def get_machine_class_name() -> str:
    module = load_simulator_module()
    machine_class = getattr(module, "CounterMachineTM", None)
    if machine_class is None:
        raise RuntimeError("CounterMachineTM class was not found in simulator.py")
    return machine_class.__name__


def run_simulation(operation: str, register_values: list[int], parameters: dict, num_registers: int) -> dict:
    module = load_simulator_module()
    result = module.run_simulation(
        operation=operation,
        register_values=register_values,
        parameters=parameters,
        num_registers=num_registers,
    )
    return result.to_dict()
