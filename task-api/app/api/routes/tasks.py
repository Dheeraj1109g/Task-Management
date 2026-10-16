from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User, UserRole
from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate, TaskRead, TaskStats

router = APIRouter(prefix="/tasks", tags=["tasks"])

def get_accessible_task(task_id: int, db: Session, user: User, for_delete: bool = False) -> Task:
    task = db.scalar(
        select(Task).options(joinedload(Task.owner)).where(Task.id == task_id)
    )
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")
    
    # Check permissions:
    # 1. Owner always has full access
    if task.owner_id == user.id:
        return task
    # 2. Admin has full access to any task
    if user.role == UserRole.admin.value:
        return task
    # 3. Manager can view and update, but cannot delete another user's task
    if user.role == UserRole.manager.value and not for_delete:
        return task

    raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")

def task_to_read(task: Task) -> TaskRead:
    return TaskRead(
        id=task.id,
        title=task.title,
        description=task.description,
        status=task.status,
        due_date=task.due_date,
        owner_id=task.owner_id,
        owner_email=task.owner.email if task.owner else None,
        created_at=task.created_at,
    )

@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    target_owner_id = user.id
    if data.owner_id and user.role in [UserRole.admin.value, UserRole.manager.value]:
        assigned_user = db.get(User, data.owner_id)
        if assigned_user:
            target_owner_id = assigned_user.id

    payload = data.model_dump()
    payload["owner_id"] = target_owner_id

    task = Task(**payload)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task_to_read(task)

@router.get("", response_model=list[TaskRead])
def list_tasks(
    status_filter: TaskStatus | None = Query(default=None, alias="status"),
    all_users: bool = Query(default=False, alias="all"),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    stmt = select(Task).options(joinedload(Task.owner))

    # Allow admins and managers to view all tasks across organization if requested
    if all_users and user.role in [UserRole.admin.value, UserRole.manager.value]:
        pass
    else:
        stmt = stmt.where(Task.owner_id == user.id)

    if status_filter:
        stmt = stmt.where(Task.status == status_filter)

    stmt = stmt.order_by(Task.created_at.desc()).limit(limit).offset(offset)
    tasks = db.scalars(stmt).all()
    return [task_to_read(t) for t in tasks]

@router.get("/stats", response_model=TaskStats)
def task_stats(
    scope: str = Query(default="mine"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    stmt = select(Task.status, func.count(Task.id))
    if scope == "all" and user.role in [UserRole.admin.value, UserRole.manager.value]:
        pass
    else:
        stmt = stmt.where(Task.owner_id == user.id)

    rows = db.execute(stmt.group_by(Task.status)).all()
    counts = {
        (status.value if hasattr(status, "value") else str(status)): count
        for status, count in rows
    }
    stats = {s.value: counts.get(s.value, 0) for s in TaskStatus}
    return TaskStats(**stats, total=sum(stats.values()))

@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    task = get_accessible_task(task_id, db, user)
    return task_to_read(task)

@router.patch("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    task = get_accessible_task(task_id, db, user)
    update_data = data.model_dump(exclude_unset=True)
    
    # Only admin/manager can reassign owner_id
    if "owner_id" in update_data and user.role not in [UserRole.admin.value, UserRole.manager.value]:
        del update_data["owner_id"]

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task_to_read(task)

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    task = get_accessible_task(task_id, db, user, for_delete=True)
    db.delete(task)
    db.commit()