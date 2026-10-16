from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.task import Task
from app.schemas.user import UserAdminView, RoleUpdateRequest
from app.api.deps import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=list[UserAdminView])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    users = db.scalars(select(User).order_by(User.id.asc())).all()
    
    # Fetch task count per user in a single aggregated query
    task_counts = dict(
        db.execute(
            select(Task.owner_id, func.count(Task.id)).group_by(Task.owner_id)
        ).all()
    )

    result = []
    for u in users:
        result.append(
            UserAdminView(
                id=u.id,
                email=u.email,
                role=u.role,
                is_verified=u.is_verified,
                created_at=u.created_at,
                task_count=task_counts.get(u.id, 0),
            )
        )
    return result

@router.patch("/users/{user_id}/role", response_model=UserAdminView)
def update_user_role(
    user_id: int,
    payload: RoleUpdateRequest,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    target = db.get(User, user_id)
    if not target:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    
    # Prevent self-demoting the only admin
    if target.id == admin_user.id and payload.role != UserRole.admin.value:
        admin_count = db.scalar(
            select(func.count(User.id)).where(User.role == UserRole.admin.value)
        ) or 0
        if admin_count <= 1:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, "Cannot remove the only admin in the organization"
            )

    target.role = payload.role
    db.commit()
    db.refresh(target)

    task_count = db.scalar(select(func.count(Task.id)).where(Task.owner_id == target.id)) or 0
    return UserAdminView(
        id=target.id,
        email=target.email,
        role=target.role,
        is_verified=target.is_verified,
        created_at=target.created_at,
        task_count=task_count,
    )

@router.post("/users/{user_id}/verify", response_model=UserAdminView)
def verify_user_manually(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    target = db.get(User, user_id)
    if not target:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    target.is_verified = True
    target.verification_token = None
    target.verification_token_expires_at = None
    db.commit()
    db.refresh(target)

    task_count = db.scalar(select(func.count(Task.id)).where(Task.owner_id == target.id)) or 0
    return UserAdminView(
        id=target.id,
        email=target.email,
        role=target.role,
        is_verified=target.is_verified,
        created_at=target.created_at,
        task_count=task_count,
    )

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    target = db.get(User, user_id)
    if not target:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    if target.id == admin_user.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Admin cannot delete their own account")

    db.delete(target)
    db.commit()
