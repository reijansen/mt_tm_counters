from typing import Annotated

from pydantic import BaseModel, Field, StringConstraints, model_validator

OperationCode = Annotated[str, StringConstraints(strip_whitespace=True, to_upper=True)]
ShortText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
MediumText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]
SymbolText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=8)]
RegisterValue = Annotated[int, Field(ge=0)]
RegisterIndex = Annotated[int, Field(ge=0)]


class HealthResponse(BaseModel):
    status: ShortText
    message: MediumText


class OperationDefinitionResponse(BaseModel):
    code: OperationCode = Field(min_length=2, max_length=3)
    label: MediumText
    tape_count: int = Field(ge=1, le=2)
    parameter_names: list[ShortText] = Field(default_factory=list)


class OperationCatalogResponse(BaseModel):
    operations: list[OperationDefinitionResponse] = Field(default_factory=list)


class ProjectInfoResponse(BaseModel):
    title: MediumText
    developer: MediumText
    course: MediumText
    program: MediumText
    division: MediumText
    college: MediumText
    university: MediumText


class SimulationParametersRequest(BaseModel):
    target: RegisterIndex | None = None
    left: RegisterIndex | None = None
    right: RegisterIndex | None = None
    destination: RegisterIndex | None = None
    source: RegisterIndex | None = None


class SimulationRequest(BaseModel):
    operation: OperationCode = Field(min_length=2, max_length=3)
    register_values: list[RegisterValue] = Field(min_length=1)
    parameters: SimulationParametersRequest
    num_registers: int = Field(default=5, ge=1, le=20)
    include_steps: bool = True

    @model_validator(mode="after")
    def validate_operation_specific_parameters(self):
        operation = self.operation.upper()
        if operation in {"INC", "DEC", "CZ", "CLR"} and self.parameters.target is None:
            raise ValueError(f"{operation} requires parameters.target.")
        if operation == "CMP" and (self.parameters.left is None or self.parameters.right is None):
            raise ValueError("CMP requires parameters.left and parameters.right.")
        if operation == "CPY" and (self.parameters.destination is None or self.parameters.source is None):
            raise ValueError("CPY requires parameters.destination and parameters.source.")
        if len(self.register_values) > self.num_registers:
            raise ValueError("register_values length cannot exceed num_registers.")
        for field_name in ("target", "left", "right", "destination", "source"):
            field_value = getattr(self.parameters, field_name)
            if field_value is not None and field_value >= self.num_registers:
                raise ValueError(f"parameters.{field_name} must be less than num_registers.")
        return self


class StepTraceResponse(BaseModel):
    step_number: int = Field(ge=0)
    state: ShortText
    read_symbols: list[SymbolText] = Field(default_factory=list)
    write_symbols: list[SymbolText] = Field(default_factory=list)
    directions: list[SymbolText] = Field(default_factory=list)
    tape_indices: list[RegisterIndex] = Field(default_factory=list)
    head_positions: list[int] = Field(default_factory=list)
    registers: list[RegisterValue] = Field(default_factory=list)
    tapes: list[list[SymbolText]] = Field(default_factory=list)
    halted: bool = False
    accepted: bool | None = None
    message: MediumText | None = None


class SimulationResponse(BaseModel):
    operation: OperationCode = Field(min_length=2, max_length=3)
    accepted: bool
    halted_state: ShortText
    step_count: int = Field(ge=0)
    registers: list[RegisterValue] = Field(default_factory=list)
    tapes: list[list[SymbolText]] = Field(default_factory=list)
    head_positions: list[int] = Field(default_factory=list)
    steps: list[StepTraceResponse] = Field(default_factory=list)
    message: MediumText | None = None
