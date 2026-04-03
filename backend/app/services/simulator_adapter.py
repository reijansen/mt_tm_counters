from __future__ import annotations

import importlib.util
from functools import lru_cache
from types import ModuleType

from app.config import SIMULATOR_PATH


@lru_cache(maxsize=1)
def load_simulator_module() -> ModuleType:
    spec = importlib.util.spec_from_file_location("simulator", SIMULATOR_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load simulator module from {SIMULATOR_PATH}")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def get_operation_catalog() -> list[str]:
    # Keep the initial API explicit and stable even if the Python file changes.
    return ["INC", "DEC", "CZ", "CMP", "CLR", "CPY"]


def get_machine_class_name() -> str:
    module = load_simulator_module()
    machine_class = getattr(module, "CounterMachineTM", None)
    if machine_class is None:
        raise RuntimeError("CounterMachineTM class was not found in simulator.py")
    return machine_class.__name__

