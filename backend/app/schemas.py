from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    message: str


class OperationCatalogResponse(BaseModel):
    operations: list[str]


class ProjectInfoResponse(BaseModel):
    title: str
    developer: str
    course: str
    program: str
    division: str
    college: str
    university: str

