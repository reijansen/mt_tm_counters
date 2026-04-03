from pydantic import BaseModel, Field, model_validator


class HealthResponse(BaseModel):
    status: str
    message: str


class OperationDefinitionResponse(BaseModel):
    code: str
    label: str
    tape_count: int
    parameter_names: list[str]


class OperationCatalogResponse(BaseModel):
    operations: list[OperationDefinitionResponse]


class ProjectInfoResponse(BaseModel):
    title: str
    developer: str
    course: str
    program: str
    division: str
    college: str
    university: str


class SimulationParametersRequest(BaseModel):
    target: int | None = Field(default=None, ge=0)
    left: int | None = Field(default=None, ge=0)
    right: int | None = Field(default=None, ge=0)
    destination: int | None = Field(default=None, ge=0)
    source: int | None = Field(default=None, ge=0)


class SimulationRequest(BaseModel):
    operation: str = Field(min_length=2, max_length=3)
    register_values: list[int] = Field(min_length=1)
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
        return self


class StepTraceResponse(BaseModel):
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


class SimulationResponse(BaseModel):
    operation: str
    accepted: bool
    halted_state: str
    step_count: int
    registers: list[int]
    tapes: list[list[str]]
    head_positions: list[int]
    steps: list[StepTraceResponse]
    message: str | None = None
