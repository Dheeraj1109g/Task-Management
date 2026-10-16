from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.models.task import TaskStatus

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    due_date: datetime | None = None
    owner_id: int | None = None

class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus | None = None
    due_date: datetime | None = None
    owner_id: int | None = None

class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str | None
    status: TaskStatus
    due_date: datetime | None
    owner_id: int | None = None
    owner_email: str | None = None
    created_at: datetime

class TaskStats(BaseModel):
    todo: int = 0
    in_progress: int = 0
    done: int = 0
    total: int = 0
