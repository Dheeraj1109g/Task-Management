from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.models.task import TaskStatus

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    due_date: datetime | None = None

class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus | None = None
    due_date: datetime | None = None

class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str | None
    status: TaskStatus
    due_date: datetime | None
    created_at: datetime