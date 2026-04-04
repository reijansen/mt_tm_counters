from __future__ import annotations

from dataclasses import asdict, dataclass


MAX_STEPS = 500
DEFAULT_NUM_REGISTERS = 5


@dataclass
class OperationDefinition:
    code: str
    label: str
    tape_count: int
    parameter_names: list[str]


@dataclass
class StepTrace:
    step_number: int
    state: str
    read_symbols: list[str]
    write_symbols: list[str]
    directions: list[str]
    tape_indices: list[int]
    head_positions: list[int]
    registers: list[int]
    tapes: list[list[str]]
    halted: bool = False
    accepted: bool | None = None
    message: str | None = None


@dataclass
class SimulationResult:
    operation: str
    accepted: bool
    halted_state: str
    step_count: int
    registers: list[int]
    tapes: list[list[str]]
    head_positions: list[int]
    steps: list[StepTrace]
    message: str | None = None

    def to_dict(self) -> dict:
        data = asdict(self)
        data["steps"] = [asdict(step) for step in self.steps]
        return data


class State:
    def __init__(self, name):
        self.name = name
        self.transitions = {}

    def add_transition(self, read_symbols, next_state, write_symbols, directions):
        self.transitions[read_symbols] = (next_state, write_symbols, directions)

    def get_transition(self, read_symbols):
        return self.transitions.get(read_symbols, None)


OPERATION_DEFINITIONS = [
    OperationDefinition("INC", "Increment register", 1, ["target"]),
    OperationDefinition("DEC", "Decrement register", 1, ["target"]),
    OperationDefinition("CZ", "Compare register to zero", 1, ["target"]),
    OperationDefinition("CMP", "Compare two registers", 2, ["left", "right"]),
    OperationDefinition("CLR", "Clear register", 1, ["target"]),
    OperationDefinition("CPY", "Copy register", 2, ["destination", "source"]),
]


class CounterMachineTM:
    def __init__(self, num_registers=DEFAULT_NUM_REGISTERS):
        self.blank = "B"
        self.num_rows = num_registers
        self.registers = [0] * num_registers
        self.tapes = [[self.blank] * 50 for _ in range(num_registers)]
        self.head_cols = [0 for _ in range(self.num_rows)]
        self.step_count = 0

    def _write_binary_value(self, register, value):
        binary_digits = bin(value)[2:] if value > 0 else ""
        tape = self.tapes[register]
        for i in range(len(tape)):
            if i < len(binary_digits):
                tape[i] = binary_digits[i]
            else:
                tape[i] = self.blank
        self.head_cols[register] = max(len(binary_digits) - 1, 0) if binary_digits else 0

    def _read_binary_from_tape(self, register):
        tape = self.tapes[register]
        digits = []
        idx = 0
        while idx < len(tape) and tape[idx] in ("0", "1"):
            digits.append(tape[idx])
            idx += 1
        if digits:
            return int("".join(digits), 2)
        return 0

    def _snapshot_tapes(self):
        snapshots = []
        for row in range(self.num_rows):
            last_symbol = -1
            for i, symbol in enumerate(self.tapes[row]):
                if symbol in ("0", "1"):
                    last_symbol = i
            display_end = max(self.head_cols[row] + 3, last_symbol + 2, 10)
            snapshots.append(self.tapes[row][: min(display_end, len(self.tapes[row]))].copy())
        return snapshots

    def _build_step_trace(
        self,
        step_number,
        state,
        read_symbols,
        write_symbols,
        directions,
        tape_indices,
        halted=False,
        accepted=None,
        message=None,
    ):
        return StepTrace(
            step_number=step_number,
            state=state,
            read_symbols=list(read_symbols),
            write_symbols=list(write_symbols),
            directions=list(directions),
            tape_indices=list(tape_indices),
            head_positions=self.head_cols.copy(),
            registers=self.registers.copy(),
            tapes=self._snapshot_tapes(),
            halted=halted,
            accepted=accepted,
            message=message,
        )

    def initialize_register(self, register, value):
        self.registers[register] = value
        self._write_binary_value(register, value)

    def initialize_registers(self, values):
        for register, value in enumerate(values):
            self.initialize_register(register, value)

    def sync_register_from_tape(self, register):
        value = self._read_binary_from_tape(register)
        self.registers[register] = value
        self._write_binary_value(register, value)

    def read_register_value(self, register):
        return self.registers[register]

    def read_cells(self, tape_indices):
        return tuple(self.tapes[idx][self.head_cols[idx]] for idx in tape_indices)

    def write_cells(self, tape_indices, symbols):
        for i, idx in enumerate(tape_indices):
            self.tapes[idx][self.head_cols[idx]] = symbols[i]

    def move_heads(self, tape_indices, directions):
        for i, idx in enumerate(tape_indices):
            direction = directions[i]
            if direction == "R":
                if self.head_cols[idx] < len(self.tapes[idx]) - 1:
                    self.head_cols[idx] += 1
                else:
                    self.tapes[idx].append(self.blank)
                    self.head_cols[idx] += 1
            elif direction == "L":
                if self.head_cols[idx] > 0:
                    self.head_cols[idx] -= 1
                else:
                    self.tapes[idx].insert(0, self.blank)

    def display_tapes(self):
        for row, tape in enumerate(self._snapshot_tapes()):
            tape_display = []
            for col, symbol in enumerate(tape):
                if col == self.head_cols[row]:
                    tape_display.append(f"[{symbol}]")
                else:
                    tape_display.append(f" {symbol} ")
            print(f"  Tape{row}: {''.join(tape_display)}")

    def _finalize_result(self, operation, current_state, accepted, steps, message=None):
        return SimulationResult(
            operation=operation,
            accepted=accepted,
            halted_state=current_state,
            step_count=self.step_count,
            registers=self.registers.copy(),
            tapes=self._snapshot_tapes(),
            head_positions=self.head_cols.copy(),
            steps=steps,
            message=message,
        )

    def _run_single_tape_machine(
        self,
        operation,
        tape_idx,
        states,
        start_state,
        accept_states,
        reject_states=None,
        max_steps=MAX_STEPS,
        stop_condition=None,
        before_run=None,
        on_halt=None,
        abort_message=None,
    ):
        reject_states = set(reject_states or [])
        accept_states = set(accept_states)
        steps = []
        self.step_count = 0
        current_state = start_state
        self.head_cols[tape_idx] = 0

        if before_run is not None:
            short_circuit = before_run()
            if short_circuit is not None:
                accepted, halted_state, message = short_circuit
                steps.append(
                    self._build_step_trace(
                        step_number=0,
                        state=halted_state,
                        read_symbols=[],
                        write_symbols=[],
                        directions=[],
                        tape_indices=[tape_idx],
                        halted=True,
                        accepted=accepted,
                        message=message,
                    )
                )
                return self._finalize_result(operation, halted_state, accepted, steps, message)

        while current_state not in accept_states and current_state not in reject_states:
            if self.step_count >= max_steps:
                message = abort_message or (
                    f"The simulation stopped after reaching the safety limit of {max_steps} steps."
                )
                steps.append(
                    self._build_step_trace(
                        step_number=self.step_count,
                        state=current_state,
                        read_symbols=[],
                        write_symbols=[],
                        directions=[],
                        tape_indices=[tape_idx],
                        halted=True,
                        accepted=False,
                        message=message,
                    )
                )
                return self._finalize_result(operation, current_state, False, steps, message)

            read_symbols = (self.tapes[tape_idx][self.head_cols[tape_idx]],)
            if stop_condition is not None:
                custom_result = stop_condition(current_state, read_symbols, tape_idx)
                if custom_result is not None:
                    next_state, write_symbols, directions, message = custom_result
                    current_state = next_state
                    self.step_count += 1
                    steps.append(
                        self._build_step_trace(
                            step_number=self.step_count,
                            state=current_state,
                            read_symbols=read_symbols,
                            write_symbols=write_symbols,
                            directions=directions,
                            tape_indices=[tape_idx],
                            halted=current_state in accept_states,
                            accepted=current_state in accept_states,
                            message=message,
                        )
                    )
                    continue

            transition = states[current_state].get_transition(read_symbols)
            if transition is None:
                message = "The machine reached a configuration without a matching transition."
                steps.append(
                    self._build_step_trace(
                        step_number=self.step_count,
                        state=current_state,
                        read_symbols=read_symbols,
                        write_symbols=[],
                        directions=[],
                        tape_indices=[tape_idx],
                        halted=True,
                        accepted=False,
                        message=message,
                    )
                )
                return self._finalize_result(operation, current_state, False, steps, message)

            next_state, write_symbols, directions = transition
            self.tapes[tape_idx][self.head_cols[tape_idx]] = write_symbols[0]
            self.move_heads([tape_idx], [directions[0]])
            current_state = next_state
            self.step_count += 1
            steps.append(
                self._build_step_trace(
                    step_number=self.step_count,
                    state=current_state,
                    read_symbols=read_symbols,
                    write_symbols=write_symbols,
                    directions=directions,
                    tape_indices=[tape_idx],
                    halted=current_state in accept_states or current_state in reject_states,
                    accepted=current_state in accept_states if current_state in accept_states or current_state in reject_states else None,
                )
            )

        accepted = current_state in accept_states
        if accepted and on_halt is not None:
            on_halt()
            steps.append(
                self._build_step_trace(
                    step_number=self.step_count,
                    state=current_state,
                    read_symbols=[],
                    write_symbols=[],
                    directions=[],
                    tape_indices=[tape_idx],
                    halted=True,
                    accepted=True,
                    message="The register values were updated from the final tape contents.",
                )
            )
        elif steps:
            steps[-1].halted = True
            steps[-1].accepted = accepted

        return self._finalize_result(operation, current_state, accepted, steps)

    def _run_multi_tape_machine(
        self,
        operation,
        tape_indices,
        states,
        start_state,
        accept_states,
        reject_states=None,
        max_steps=MAX_STEPS,
        special_case=None,
        on_halt=None,
        abort_message=None,
    ):
        reject_states = set(reject_states or [])
        accept_states = set(accept_states)
        steps = []
        self.step_count = 0
        current_state = start_state
        for tape_idx in tape_indices:
            self.head_cols[tape_idx] = 0

        while current_state not in accept_states and current_state not in reject_states:
            if self.step_count >= max_steps:
                message = abort_message or (
                    f"The simulation stopped after reaching the safety limit of {max_steps} steps."
                )
                steps.append(
                    self._build_step_trace(
                        step_number=self.step_count,
                        state=current_state,
                        read_symbols=[],
                        write_symbols=[],
                        directions=[],
                        tape_indices=tape_indices,
                        halted=True,
                        accepted=False,
                        message=message,
                    )
                )
                return self._finalize_result(operation, current_state, False, steps, message)

            read_symbols = self.read_cells(tape_indices)

            if special_case is not None:
                custom_result = special_case(current_state, read_symbols, tape_indices)
                if custom_result is not None:
                    next_state, write_symbols, directions, message = custom_result
                    if write_symbols:
                        self.write_cells(tape_indices, write_symbols)
                    if directions:
                        self.move_heads(tape_indices, directions)
                    current_state = next_state
                    self.step_count += 1
                    steps.append(
                        self._build_step_trace(
                            step_number=self.step_count,
                            state=current_state,
                            read_symbols=read_symbols,
                            write_symbols=write_symbols,
                            directions=directions,
                            tape_indices=tape_indices,
                            halted=current_state in accept_states or current_state in reject_states,
                            accepted=current_state in accept_states if current_state in accept_states or current_state in reject_states else None,
                            message=message,
                        )
                    )
                    continue

            transition = states[current_state].get_transition(read_symbols)
            if transition is None:
                message = "The machine reached a configuration without a matching transition."
                steps.append(
                    self._build_step_trace(
                        step_number=self.step_count,
                        state=current_state,
                        read_symbols=read_symbols,
                        write_symbols=[],
                        directions=[],
                        tape_indices=tape_indices,
                        halted=True,
                        accepted=False,
                        message=message,
                    )
                )
                return self._finalize_result(operation, current_state, False, steps, message)

            next_state, write_symbols, directions = transition
            self.write_cells(tape_indices, write_symbols)
            self.move_heads(tape_indices, directions)
            current_state = next_state
            self.step_count += 1
            steps.append(
                self._build_step_trace(
                    step_number=self.step_count,
                    state=current_state,
                    read_symbols=read_symbols,
                    write_symbols=write_symbols,
                    directions=directions,
                    tape_indices=tape_indices,
                    halted=current_state in accept_states or current_state in reject_states,
                    accepted=current_state in accept_states if current_state in accept_states or current_state in reject_states else None,
                )
            )

        accepted = current_state in accept_states
        if accepted and on_halt is not None:
            on_halt()
            steps.append(
                self._build_step_trace(
                    step_number=self.step_count,
                    state=current_state,
                    read_symbols=[],
                    write_symbols=[],
                    directions=[],
                    tape_indices=tape_indices,
                    halted=True,
                    accepted=True,
                    message="The register values were updated from the final tape contents.",
                )
            )
        elif steps:
            steps[-1].halted = True
            steps[-1].accepted = accepted

        return self._finalize_result(operation, current_state, accepted, steps)

    def INC(self, tape_idx):
        q0 = State("q0")
        q1 = State("q1")
        qf = State("qf")

        q0.add_transition(("0",), "q0", ("0",), ("R",))
        q0.add_transition(("1",), "q0", ("1",), ("R",))
        q0.add_transition(("B",), "q1", ("B",), ("L",))
        q1.add_transition(("1",), "q1", ("0",), ("L",))
        q1.add_transition(("0",), "qf", ("1",), ("R",))
        q1.add_transition(("B",), "qf", ("1",), ("R",))

        states = {"q0": q0, "q1": q1, "qf": qf}
        return self._run_single_tape_machine(
            operation="INC",
            tape_idx=tape_idx,
            states=states,
            start_state="q0",
            accept_states={"qf"},
            on_halt=lambda: self.sync_register_from_tape(tape_idx),
        )

    def DEC(self, tape_idx):
        q0 = State("q0")
        q1 = State("q1")
        qf = State("qf")
        qreject = State("qreject")

        q0.add_transition(("0",), "q0", ("0",), ("R",))
        q0.add_transition(("1",), "q0", ("1",), ("R",))
        q0.add_transition(("B",), "q1", ("B",), ("L",))
        q1.add_transition(("0",), "q1", ("1",), ("L",))
        q1.add_transition(("1",), "qf", ("0",), ("R",))
        q1.add_transition(("B",), "qreject", ("B",), ("S",))

        states = {"q0": q0, "q1": q1, "qf": qf, "qreject": qreject}
        return self._run_single_tape_machine(
            operation="DEC",
            tape_idx=tape_idx,
            states=states,
            start_state="q0",
            accept_states={"qf"},
            reject_states={"qreject"},
            before_run=lambda: (
                (False, "qreject", "This register is already zero, so it cannot be decremented.")
                if self.registers[tape_idx] == 0
                else None
            ),
            on_halt=lambda: self.sync_register_from_tape(tape_idx),
        )

    def CZ(self, tape_idx):
        q0 = State("q0")
        q1 = State("q1")
        qf = State("qf")

        q0.add_transition(("B",), "qf", ("B",), ("S",))
        q0.add_transition(("0",), "q1", ("0",), ("S",))
        q0.add_transition(("1",), "q1", ("1",), ("S",))

        states = {"q0": q0, "q1": q1, "qf": qf}
        result = self._run_single_tape_machine(
            operation="CZ",
            tape_idx=tape_idx,
            states=states,
            start_state="q0",
            accept_states={"qf"},
            reject_states={"q1"},
        )
        return result

    def CMP(self, tape1_idx, tape2_idx):
        q0 = State("q0")
        q1 = State("q1")
        qf = State("qf")

        q0.add_transition(("0", "0"), "q0", ("0", "0"), ("R", "R"))
        q0.add_transition(("1", "1"), "q0", ("1", "1"), ("R", "R"))
        q0.add_transition(("B", "B"), "qf", ("B", "B"), ("S", "S"))
        q0.add_transition(("0", "1"), "q1", ("0", "1"), ("S", "S"))
        q0.add_transition(("1", "0"), "q1", ("1", "0"), ("S", "S"))
        q0.add_transition(("0", "B"), "q1", ("0", "B"), ("S", "S"))
        q0.add_transition(("1", "B"), "q1", ("1", "B"), ("S", "S"))
        q0.add_transition(("B", "0"), "q1", ("B", "0"), ("S", "S"))
        q0.add_transition(("B", "1"), "q1", ("B", "1"), ("S", "S"))

        states = {"q0": q0, "q1": q1, "qf": qf}
        return self._run_multi_tape_machine(
            operation="CMP",
            tape_indices=[tape1_idx, tape2_idx],
            states=states,
            start_state="q0",
            accept_states={"qf"},
            reject_states={"q1"},
        )

    def CLR(self, tape_idx):
        q0 = State("q0")
        q1 = State("q1")
        qf = State("qf")

        q0.add_transition(("0",), "q0", ("B",), ("R",))
        q0.add_transition(("1",), "q0", ("B",), ("R",))
        q0.add_transition(("B",), "q1", ("B",), ("L",))
        q1.add_transition(("B",), "q1", ("B",), ("L",))

        states = {"q0": q0, "q1": q1, "qf": qf}
        return self._run_single_tape_machine(
            operation="CLR",
            tape_idx=tape_idx,
            states=states,
            start_state="q0",
            accept_states={"qf"},
            stop_condition=lambda current_state, read_symbols, idx: (
                ("qf", ("B",), ("S",), "The head returned to the start of the cleared tape.")
                if current_state == "q1" and self.head_cols[idx] == 0
                else None
            ),
            on_halt=lambda: self.sync_register_from_tape(tape_idx),
        )

    def CPY(self, dest_idx, src_idx):
        q0 = State("q0")
        q1 = State("q1")
        qf = State("qf")

        for dest_sym in ("B", "0", "1"):
            q0.add_transition((dest_sym, "0"), "q0", ("0", "0"), ("R", "R"))
            q0.add_transition((dest_sym, "1"), "q0", ("1", "1"), ("R", "R"))

        q0.add_transition(("0", "B"), "q1", ("B", "B"), ("R", "S"))
        q0.add_transition(("1", "B"), "q1", ("B", "B"), ("R", "S"))
        q0.add_transition(("B", "B"), "qf", ("B", "B"), ("S", "S"))
        q1.add_transition(("0", "B"), "q1", ("B", "B"), ("R", "S"))
        q1.add_transition(("1", "B"), "q1", ("B", "B"), ("R", "S"))
        q1.add_transition(("B", "B"), "qf", ("B", "B"), ("L", "S"))

        states = {"q0": q0, "q1": q1, "qf": qf}
        return self._run_multi_tape_machine(
            operation="CPY",
            tape_indices=[dest_idx, src_idx],
            states=states,
            start_state="q0",
            accept_states={"qf"},
            special_case=lambda current_state, read_symbols, indices: (
                ("qf", ("B", "B"), ("L", "L"), "Both tapes reached blank cells at the end of the copied value.")
                if read_symbols == ("B", "B")
                and (self.head_cols[indices[0]] > 0 or self.head_cols[indices[1]] > 0)
                else None
            ),
            on_halt=lambda: self.sync_register_from_tape(dest_idx),
        )

    def run_operation(self, operation, parameters):
        operation = operation.upper()
        handlers = {
            "INC": lambda: self.INC(parameters["target"]),
            "DEC": lambda: self.DEC(parameters["target"]),
            "CZ": lambda: self.CZ(parameters["target"]),
            "CMP": lambda: self.CMP(parameters["left"], parameters["right"]),
            "CLR": lambda: self.CLR(parameters["target"]),
            "CPY": lambda: self.CPY(parameters["destination"], parameters["source"]),
        }
        if operation not in handlers:
            raise ValueError(f"Unsupported operation: {operation}")
        return handlers[operation]()


def get_operation_catalog():
    return [asdict(definition) for definition in OPERATION_DEFINITIONS]


def create_machine_with_registers(register_values, num_registers=None):
    if num_registers is None:
        num_registers = max(DEFAULT_NUM_REGISTERS, len(register_values))
    machine = CounterMachineTM(num_registers=num_registers)
    machine.initialize_registers(register_values)
    return machine


def run_simulation(operation, register_values, parameters, num_registers=None):
    machine = create_machine_with_registers(register_values, num_registers=num_registers)
    return machine.run_operation(operation, parameters)


def _print_result(result):
    print(f"Operation: {result.operation}")
    print(f"Accepted: {result.accepted}")
    print(f"Halted state: {result.halted_state}")
    print(f"Steps: {result.step_count}")
    print("Final register values:")
    for index, value in enumerate(result.registers):
        print(f"  Register {index}: {value}")
    print("\nExecution trace:")
    for step in result.steps:
        print(
            f"Step {step.step_number}: state={step.state}, "
            f"read={step.read_symbols}, write={step.write_symbols}, "
            f"directions={step.directions}, heads={step.head_positions}"
        )
        if step.message:
            print(f"  {step.message}")


def main():
    print("=== Counter Machine using Multi-Tape TM ===\n")
    print("Available operations:")
    for index, definition in enumerate(OPERATION_DEFINITIONS, start=1):
        print(f"{index}. {definition.code} - {definition.label} (uses {definition.tape_count} tape(s))")

    operation_index = input("\nSelect operation (1-6): ").strip()
    try:
        definition = OPERATION_DEFINITIONS[int(operation_index) - 1]
    except (ValueError, IndexError):
        print("Invalid operation!")
        return

    register_values = [0] * DEFAULT_NUM_REGISTERS
    parameters = {}

    if definition.code in {"INC", "DEC", "CZ", "CLR"}:
        target = int(input("Which register (0-4)? "))
        value = int(input(f"Register {target} value: "))
        register_values[target] = value
        parameters["target"] = target
    elif definition.code == "CMP":
        left = int(input("First register (0-4)? "))
        right = int(input("Second register (0-4)? "))
        register_values[left] = int(input(f"Register {left} value: "))
        register_values[right] = int(input(f"Register {right} value: "))
        parameters["left"] = left
        parameters["right"] = right
    elif definition.code == "CPY":
        destination = int(input("Destination register (0-4)? "))
        source = int(input("Source register (0-4)? "))
        register_values[destination] = int(input(f"Register {destination} value: "))
        register_values[source] = int(input(f"Register {source} value: "))
        parameters["destination"] = destination
        parameters["source"] = source

    result = run_simulation(definition.code, register_values, parameters, num_registers=DEFAULT_NUM_REGISTERS)
    _print_result(result)


if __name__ == "__main__":
    main()
