class State:
    def __init__(self, name):
        self.name = name
        self.transitions = {}
    
    def add_transition(self, read_symbols, next_state, write_symbols, directions):
        self.transitions[read_symbols] = (next_state, write_symbols, directions)
    
    def get_transition(self, read_symbols):
        return self.transitions.get(read_symbols, None)

class CounterMachineTM:
    def __init__(self, num_registers=5):
        self.blank = 'B'
        self.num_rows = num_registers
        self.registers = [0] * num_registers  # Store actual values
        self.tapes = []
        for i in range(num_registers):
            self.tapes.append([self.blank] * 50)
        self.head_cols = [0 for _ in range(self.num_rows)]
        self.step_count = 0

    def _write_binary_value(self, register, value):
        """Encode a numeric value into binary on the tape."""
        binary_digits = bin(value)[2:] if value > 0 else ""
        tape = self.tapes[register]
        for i in range(len(tape)):
            if i < len(binary_digits):
                tape[i] = binary_digits[i]
            else:
                tape[i] = self.blank
        self.head_cols[register] = max(len(binary_digits) - 1, 0) if binary_digits else 0

    def _read_binary_from_tape(self, register):
        """Return the integer represented on the tape (binary, MSB at index 0)."""
        tape = self.tapes[register]
        digits = []
        idx = 0
        while idx < len(tape) and tape[idx] in ("0", "1"):
            digits.append(tape[idx])
            idx += 1
        if digits:
            return int("".join(digits), 2)
        return 0
    
    def initialize_register(self, register, value):
        """Initialize a register with a value"""
        self.registers[register] = value
        self._write_binary_value(register, value)
    
    def sync_register_from_tape(self, register):
        """Update register value by reading binary digits on tape"""
        value = self._read_binary_from_tape(register)
        self.registers[register] = value
        self._write_binary_value(register, value)
    
    def read_register_value(self, register):
        """Return the stored register value"""
        return self.registers[register]
    
    def read_cells(self, tape_indices):
        """Read symbols at head positions for specified tapes"""
        symbols = []
        for idx in tape_indices:
            symbols.append(self.tapes[idx][self.head_cols[idx]])
        return tuple(symbols)
    
    def write_cells(self, tape_indices, symbols):
        """Write symbols at head positions for specified tapes"""
        for i, idx in enumerate(tape_indices):
            self.tapes[idx][self.head_cols[idx]] = symbols[i]
    
    def move_heads(self, tape_indices, directions):
        """Move heads for specified tapes"""
        for i, idx in enumerate(tape_indices):
            if directions[i] == 'R':
                if self.head_cols[idx] < len(self.tapes[idx]) - 1:
                    self.head_cols[idx] += 1
                else:
                    self.tapes[idx].append(self.blank)
                    self.head_cols[idx] += 1
            elif directions[i] == 'L':
                if self.head_cols[idx] > 0:
                    self.head_cols[idx] -= 1
                else:
                    self.tapes[idx].insert(0, self.blank)
    
    def display_tapes(self):
        """Display all tapes"""
        for row in range(self.num_rows):
            last_symbol = -1
            for i in range(len(self.tapes[row])):
                if self.tapes[row][i] in ('0', '1'):
                    last_symbol = i
            
            display_end = max(self.head_cols[row] + 3, last_symbol + 2, 10)
            
            tape_display = []
            for col in range(min(display_end, len(self.tapes[row]))):
                symbol = self.tapes[row][col]
                if col == self.head_cols[row]:
                    tape_display.append(f"[{symbol}]")
                else:
                    tape_display.append(f" {symbol} ")
            
            print(f"  Tape{row}: {''.join(tape_display)}")

    def INC(self, tape_idx, verbose=True):
        """Increment register - uses 1 tape"""
        self.head_cols[tape_idx] = 0
        if verbose:
            print(f"=== Executing INC on Register {tape_idx} ===\n")
            print("Initial configuration:")
            self.display_tapes()
            print()
        
        q0 = State('q0')
        q1 = State('q1')
        qf = State('qf')
        
        q0.add_transition(('0',), 'q0', ('0',), ('R',))
        q0.add_transition(('1',), 'q0', ('1',), ('R',))
        q0.add_transition(('B',), 'q1', ('B',), ('L',))
        q1.add_transition(('1',), 'q1', ('0',), ('L',))
        q1.add_transition(('0',), 'qf', ('1',), ('R',))
        q1.add_transition(('B',), 'qf', ('1',), ('R',))
        
        states = {'q0': q0, 'q1': q1, 'qf': qf}
        
        self.step_count = 0
        current_state = 'q0'
        max_steps = 500
        
        while current_state != 'qf':
            if self.step_count >= max_steps:
                print(f"\n!!! STEP LIMIT REACHED ({max_steps} steps) - Operation aborted !!!")
                return
            
            read_sym = (self.tapes[tape_idx][self.head_cols[tape_idx]],)
            
            if verbose:
                print(f"Step {self.step_count}: State={current_state}, Read={list(read_sym)}")
            
            transition = states[current_state].get_transition(read_sym)
            if transition:
                next_state, write_syms, directions = transition
                if verbose:
                    print(f"  Transition: δ({current_state}, {list(read_sym)}) = ({next_state}, {list(write_syms)}, {list(directions)})")
                
                self.tapes[tape_idx][self.head_cols[tape_idx]] = write_syms[0]
                self.move_heads([tape_idx], [directions[0]])
                current_state = next_state
            
            self.step_count += 1
            if verbose:
                self.display_tapes()
                print()
        
        # Sync register value after operation
        self.sync_register_from_tape(tape_idx)
        
        if verbose:
            print(f"Machine HALTED in state '{current_state}' (ACCEPTED)\n")
    
    def DEC(self, tape_idx, verbose=True):
        """Decrement register - uses 1 tape"""
        self.head_cols[tape_idx] = 0
        if verbose:
            print(f"=== Executing DEC on Register {tape_idx} ===\n")
            print("Initial configuration:")
            self.display_tapes()
            print()

        if self.registers[tape_idx] == 0:
            if verbose:
                print("Register already zero - cannot decrement (reject)\n")
            return
        
        q0 = State('q0')
        q1 = State('q1')
        qf = State('qf')
        qreject = State('qreject')
        
        q0.add_transition(('0',), 'q0', ('0',), ('R',))
        q0.add_transition(('1',), 'q0', ('1',), ('R',))
        q0.add_transition(('B',), 'q1', ('B',), ('L',))
        q1.add_transition(('0',), 'q1', ('1',), ('L',))
        q1.add_transition(('1',), 'qf', ('0',), ('R',))
        q1.add_transition(('B',), 'qreject', ('B',), ('S',))
        
        states = {'q0': q0, 'q1': q1, 'qf': qf, 'qreject': qreject}
        
        self.step_count = 0
        current_state = 'q0'
        max_steps = 500
        
        while current_state not in ('qf', 'qreject'):
            if self.step_count >= max_steps:
                print(f"\n!!! STEP LIMIT REACHED ({max_steps} steps) - Operation aborted !!!")
                return
            
            read_sym = (self.tapes[tape_idx][self.head_cols[tape_idx]],)
            
            if verbose:
                print(f"Step {self.step_count}: State={current_state}, Read={list(read_sym)}")
            
            transition = states[current_state].get_transition(read_sym)
            if transition:
                next_state, write_syms, directions = transition
                if verbose:
                    print(f"  Transition: δ({current_state}, {list(read_sym)}) = ({next_state}, {list(write_syms)}, {list(directions)})")
                
                self.tapes[tape_idx][self.head_cols[tape_idx]] = write_syms[0]
                self.move_heads([tape_idx], [directions[0]])
                current_state = next_state
            
            self.step_count += 1
            if verbose:
                self.display_tapes()
                print()
        
        if current_state == 'qreject':
            if verbose:
                print(f"Machine HALTED in state '{current_state}' (REJECTED)\n")
            return
        
        self.sync_register_from_tape(tape_idx)
        
        if verbose:
            print(f"Machine HALTED in state '{current_state}' (ACCEPTED)\n")
    
    def CZ(self, tape_idx, verbose=True):
        """Compare register to zero - uses 1 tape"""
        self.head_cols[tape_idx] = 0
        if verbose:
            print(f"=== Executing CZ on Register {tape_idx} ===\n")
            print("Initial configuration:")
            self.display_tapes()
            print()
        
        q0 = State('q0')
        q1 = State('q1')
        qf = State('qf')
        
        q0.add_transition(('B',), 'qf', ('B',), ('S',))
        q0.add_transition(('0',), 'q1', ('0',), ('S',))
        q0.add_transition(('1',), 'q1', ('1',), ('S',))
        
        states = {'q0': q0, 'q1': q1, 'qf': qf}
        
        self.step_count = 0
        current_state = 'q0'
        result = False
        self.head_cols[tape_idx] = 0
        
        read_sym = (self.tapes[tape_idx][self.head_cols[tape_idx]],)
        
        if verbose:
            print(f"Step {self.step_count}: State={current_state}, Read={list(read_sym)}")
        
        transition = states[current_state].get_transition(read_sym)
        if transition:
            next_state, write_syms, directions = transition
            if verbose:
                print(f"  Transition: δ({current_state}, {list(read_sym)}) = ({next_state}, {list(write_syms)}, {list(directions)})")
            
            self.tapes[tape_idx][self.head_cols[tape_idx]] = write_syms[0]
            current_state = next_state
            result = (current_state == 'qf')
        
        self.step_count += 1
        if verbose:
            self.display_tapes()
            print()
        
        if verbose:
            if result:
                print(f"Machine HALTED in state '{current_state}' (ACCEPTED)\n")
            else:
                print(f"Machine HALTED in state '{current_state}' (REJECTED)\n")
        
        return result
    
    def CMP(self, tape1_idx, tape2_idx, verbose=True):
        """Compare two registers - uses 2 tapes"""
        self.head_cols[tape1_idx] = 0
        self.head_cols[tape2_idx] = 0
        if verbose:
            print(f"=== Executing CMP on Registers {tape1_idx} and {tape2_idx} ===\n")
            print("Initial configuration:")
            self.display_tapes()
            print()
        
        q0 = State('q0')
        q1 = State('q1')
        qf = State('qf')
        
        q0.add_transition(('0', '0'), 'q0', ('0', '0'), ('R', 'R'))
        q0.add_transition(('1', '1'), 'q0', ('1', '1'), ('R', 'R'))
        q0.add_transition(('B', 'B'), 'qf', ('B', 'B'), ('S', 'S'))
        q0.add_transition(('0', '1'), 'q1', ('0', '1'), ('S', 'S'))
        q0.add_transition(('1', '0'), 'q1', ('1', '0'), ('S', 'S'))
        q0.add_transition(('0', 'B'), 'q1', ('0', 'B'), ('S', 'S'))
        q0.add_transition(('1', 'B'), 'q1', ('1', 'B'), ('S', 'S'))
        q0.add_transition(('B', '0'), 'q1', ('B', '0'), ('S', 'S'))
        q0.add_transition(('B', '1'), 'q1', ('B', '1'), ('S', 'S'))
        
        states = {'q0': q0, 'q1': q1, 'qf': qf}
        
        self.step_count = 0
        current_state = 'q0'
        max_steps = 500
        
        while current_state not in ['qf', 'q1']:
            if self.step_count >= max_steps:
                print(f"\n!!! STEP LIMIT REACHED ({max_steps} steps) - Operation aborted !!!")
                return False
            
            tape_indices = [tape1_idx, tape2_idx]
            read_syms = self.read_cells(tape_indices)
            
            if verbose:
                print(f"Step {self.step_count}: State={current_state}, Read={list(read_syms)}")
            
            transition = states[current_state].get_transition(read_syms)
            if transition:
                next_state, write_syms, directions = transition
                if verbose:
                    print(f"  Transition: δ({current_state}, {list(read_syms)}) = ({next_state}, {list(write_syms)}, {list(directions)})")
                
                self.write_cells(tape_indices, write_syms)
                self.move_heads(tape_indices, directions)
                current_state = next_state
            
            self.step_count += 1
            if verbose:
                self.display_tapes()
                print()
        
        if verbose:
            if current_state == 'qf':
                print(f"Machine HALTED in state '{current_state}' (ACCEPTED)\n")
            else:
                print(f"Machine HALTED in state '{current_state}' (REJECTED)\n")
        
        return current_state == 'qf'
    
    def CLR(self, tape_idx, verbose=True):
        """Clear register - uses 1 tape"""
        self.head_cols[tape_idx] = 0
        if verbose:
            print(f"=== Executing CLR on Register {tape_idx} ===\n")
            print("Initial configuration:")
            self.display_tapes()
            print()
        
        q0 = State('q0')
        q1 = State('q1')
        qf = State('qf')
        
        q0.add_transition(('0',), 'q0', ('B',), ('R',))
        q0.add_transition(('1',), 'q0', ('B',), ('R',))
        q0.add_transition(('B',), 'q1', ('B',), ('L',))
        q1.add_transition(('B',), 'q1', ('B',), ('L',))
        
        states = {'q0': q0, 'q1': q1, 'qf': qf}
        
        self.step_count = 0
        current_state = 'q0'
        max_steps = 500
        
        while current_state != 'qf':
            if self.step_count >= max_steps:
                print(f"\n!!! STEP LIMIT REACHED ({max_steps} steps) - Operation aborted !!!")
                return
            
            read_sym = (self.tapes[tape_idx][self.head_cols[tape_idx]],)
            
            if verbose:
                print(f"Step {self.step_count}: State={current_state}, Read={list(read_sym)}")
            
            if current_state == 'q1' and self.head_cols[tape_idx] == 0:
                if verbose:
                    print(f"  Transition: δ({current_state}, {list(read_sym)}) = (qf, ['B'], ['S']) - Back at start")
                current_state = 'qf'
            else:
                transition = states[current_state].get_transition(read_sym)
                if transition:
                    next_state, write_syms, directions = transition
                    if verbose:
                        print(f"  Transition: δ({current_state}, {list(read_sym)}) = ({next_state}, {list(write_syms)}, {list(directions)})")
                    
                    self.tapes[tape_idx][self.head_cols[tape_idx]] = write_syms[0]
                    self.move_heads([tape_idx], [directions[0]])
                    current_state = next_state
            
            self.step_count += 1
            if verbose:
                self.display_tapes()
                print()
        
        self.sync_register_from_tape(tape_idx)
        
        if verbose:
            print(f"Machine HALTED in state '{current_state}' (ACCEPTED)\n")
    
    def CPY(self, dest_idx, src_idx, verbose=True):
        """Copy register - uses 2 tapes"""
        self.head_cols[dest_idx] = 0
        self.head_cols[src_idx] = 0
        if verbose:
            print(f"=== Executing CPY from Register {src_idx} to Register {dest_idx} ===\n")
            print("Initial configuration:")
            self.display_tapes()
            print()
        
        q0 = State('q0')
        qf = State('qf')
        q1 = State('q1')
        
        # Copy digits while src has bits
        for dest_sym in ('B', '0', '1'):
            q0.add_transition((dest_sym, '0'), 'q0', ('0', '0'), ('R', 'R'))
            q0.add_transition((dest_sym, '1'), 'q0', ('1', '1'), ('R', 'R'))

        # Once src hits blank, clear remaining dest cells
        q0.add_transition(('0', 'B'), 'q1', ('B', 'B'), ('R', 'S'))
        q0.add_transition(('1', 'B'), 'q1', ('B', 'B'), ('R', 'S'))
        q0.add_transition(('B', 'B'), 'qf', ('B', 'B'), ('S', 'S'))
        q1.add_transition(('0', 'B'), 'q1', ('B', 'B'), ('R', 'S'))
        q1.add_transition(('1', 'B'), 'q1', ('B', 'B'), ('R', 'S'))
        q1.add_transition(('B', 'B'), 'qf', ('B', 'B'), ('L', 'S'))
        
        states = {'q0': q0, 'q1': q1, 'qf': qf}
        
        self.step_count = 0
        current_state = 'q0'
        max_steps = 500
        
        while current_state != 'qf':
            if self.step_count >= max_steps:
                print(f"\n!!! STEP LIMIT REACHED ({max_steps} steps) - Operation aborted !!!")
                return
            
            tape_indices = [dest_idx, src_idx]
            read_syms = self.read_cells(tape_indices)
            
            if verbose:
                print(f"Step {self.step_count}: State={current_state}, Read={list(read_syms)}")
            
            if read_syms == ('B', 'B') and (self.head_cols[dest_idx] > 0 or self.head_cols[src_idx] > 0):
                if verbose:
                    print(f"  Transition: δ({current_state}, {list(read_syms)}) = (qf, ['B','B'], ['L','L'])")
                self.write_cells(tape_indices, ('B', 'B'))
                self.move_heads(tape_indices, ('L', 'L'))
                current_state = 'qf'
            else:
                transition = states[current_state].get_transition(read_syms)
                if transition:
                    next_state, write_syms, directions = transition
                    if verbose:
                        print(f"  Transition: δ({current_state}, {list(read_syms)}) = ({next_state}, {list(write_syms)}, {list(directions)})")
                    
                    self.write_cells(tape_indices, write_syms)
                    self.move_heads(tape_indices, directions)
                    current_state = next_state
            
            self.step_count += 1
            if verbose:
                self.display_tapes()
                print()
        
        self.sync_register_from_tape(dest_idx)
        
        if verbose:
            print(f"Machine HALTED in state '{current_state}' (ACCEPTED)\n")

def main():
    print("=== Counter Machine using Multi-Tape TM ===\n")
    
    cm = CounterMachineTM(num_registers=5)
    
    print("Available operations:")
    print("1. INC - Increment register (uses 1 tape)")
    print("2. DEC - Decrement register (uses 1 tape)")
    print("3. CZ - Compare register to zero (uses 1 tape)")
    print("4. CMP - Compare two registers (uses 2 tapes)")
    print("5. CLR - Clear register (uses 1 tape)")
    print("6. CPY - Copy register (uses 2 tapes)")
    
    operation = input("\nSelect operation (1-6): ")
    
    registers_needed = []
    
    if operation == '1':
        tape = int(input("Which register to increment (0-4)? "))
        registers_needed = [tape]
        print(f"\nInitialize Register {tape}:")
        value = int(input(f"  Register {tape} value: "))
        cm.initialize_register(tape, value)
        cm.INC(tape, verbose=True)
        
    elif operation == '2':
        tape = int(input("Which register to decrement (0-4)? "))
        registers_needed = [tape]
        print(f"\nInitialize Register {tape}:")
        value = int(input(f"  Register {tape} value: "))
        cm.initialize_register(tape, value)
        cm.DEC(tape, verbose=True)
        
    elif operation == '3':
        tape = int(input("Which register to compare to zero (0-4)? "))
        registers_needed = [tape]
        print(f"\nInitialize Register {tape}:")
        value = int(input(f"  Register {tape} value: "))
        cm.initialize_register(tape, value)
        cm.CZ(tape, verbose=True)
        
    elif operation == '4':
        tape1 = int(input("First register (0-4)? "))
        tape2 = int(input("Second register (0-4)? "))
        registers_needed = [tape1, tape2]
        print(f"\nInitialize Registers {tape1} and {tape2}:")
        value1 = int(input(f"  Register {tape1} value: "))
        value2 = int(input(f"  Register {tape2} value: "))
        cm.initialize_register(tape1, value1)
        cm.initialize_register(tape2, value2)
        cm.CMP(tape1, tape2, verbose=True)
        
    elif operation == '5':
        tape = int(input("Which register to clear (0-4)? "))
        registers_needed = [tape]
        print(f"\nInitialize Register {tape}:")
        value = int(input(f"  Register {tape} value: "))
        cm.initialize_register(tape, value)
        cm.CLR(tape, verbose=True)
        
    elif operation == '6':
        dest = int(input("Destination register (0-4)? "))
        src = int(input("Source register (0-4)? "))
        registers_needed = [dest, src]
        print(f"\nInitialize Registers {dest} and {src}:")
        value_dest = int(input(f"  Register {dest} value: "))
        value_src = int(input(f"  Register {src} value: "))
        cm.initialize_register(dest, value_dest)
        cm.initialize_register(src, value_src)
        cm.CPY(dest, src, verbose=True)
        
    else:
        print("Invalid operation!")
        return
    
    print("Final Register Values:")
    for i in registers_needed:
        print(f"  Register {i}: {cm.read_register_value(i)}")

if __name__ == "__main__":
    main()
