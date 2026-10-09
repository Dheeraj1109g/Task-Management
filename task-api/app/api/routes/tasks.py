from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate, TaskRead

router = APIRouter(prefix="/tasks", tags=["tasks"])

def get_owned_task(task_id: int, db: Session, user: User) -> Task:
    task = db.scalar(select(Task).where(Task.id == task_id, Task.owner_id == user.id))
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")
    return task

@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(data: TaskCreate, db: Session = Depends(get_db),
                user: User = Depends(get_current_user)):
    task = Task(**data.model_dump(), owner_id=user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("", response_model=list[TaskRead])
def list_tasks(
    status_filter: TaskStatus | None = Query(default=None, alias="status"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    stmt = select(Task).where(Task.owner_id == user.id)
    if status_filter:
        stmt = stmt.where(Task.status == status_filter)
    stmt = stmt.order_by(Task.created_at.desc()).limit(limit).offset(offset)
    return db.scalars(stmt).all()

@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: int, db: Session = Depends(get_db),
             user: User = Depends(get_current_user)):
    return get_owned_task(task_id, db, user)

@router.patch("/{task_id}", response_model=TaskRead)
def update_task(task_id: int, data: TaskUpdate, db: Session = Depends(get_db),
                user: User = Depends(get_current_user)):
    task = get_owned_task(task_id, db, user)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db),
                user: User = Depends(get_current_user)):
    db.delete(get_owned_task(task_id, db, user))
    db.commit()