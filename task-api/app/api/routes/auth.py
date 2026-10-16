from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.user import (
    UserCreate,
    UserRead,
    UserRegisterResponse,
    VerifyEmailRequest,
)
from app.schemas.token import Token
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    generate_verification_token,
)
from app.core.email import send_verification_email
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserRegisterResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_db)):
    email = data.email.strip().lower()
    existing = db.scalar(select(User).where(User.email == email))
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")

    # If first user in database, grant admin role; otherwise use requested valid role or member
    user_count = db.scalar(select(func.count(User.id))) or 0
    assigned_role = UserRole.admin.value if user_count == 0 else (data.role if data.role in [r.value for r in UserRole] else UserRole.member.value)

    token = generate_verification_token()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

    user = User(
        email=email,
        hashed_password=hash_password(data.password),
        role=assigned_role,
        is_verified=False,
        verification_token=token,
        verification_token_expires_at=expires_at,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    send_verification_email(email, token)

    return UserRegisterResponse(
        id=user.id,
        email=user.email,
        role=user.role,
        is_verified=user.is_verified,
        verification_token=token,
        message="Account created! Verification token sent to your email.",
    )

@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email = form.username.strip().lower()
    user = db.scalar(select(User).where(User.email == email))
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")
    
    token = create_access_token(user.id, role=user.role, email=user.email)
    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        user=UserRead.model_validate(user),
    )

@router.post("/verify-email", response_model=UserRead)
def verify_email(payload: VerifyEmailRequest, db: Session = Depends(get_db)):
    token = payload.token.strip()
    user = db.scalar(select(User).where(User.verification_token == token))
    if not user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid verification token")

    if user.verification_token_expires_at:
        exp = user.verification_token_expires_at
        now = datetime.now(timezone.utc)
        if exp.tzinfo is None:
            now = datetime.now(timezone.utc).replace(tzinfo=None)
        if exp < now:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Verification token has expired")

    user.is_verified = True
    user.verification_token = None
    user.verification_token_expires_at = None
    db.commit()
    db.refresh(user)
    return user

@router.get("/verify-email", response_model=UserRead)
def verify_email_get(token: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    return verify_email(VerifyEmailRequest(token=token), db)

@router.post("/resend-verification")
def resend_verification(email: str = Query(...), db: Session = Depends(get_db)):
    clean_email = email.strip().lower()
    user = db.scalar(select(User).where(User.email == clean_email))
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    if user.is_verified:
        return {"message": "Email is already verified"}

    token = generate_verification_token()
    user.verification_token = token
    user.verification_token_expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
    db.commit()

    send_verification_email(clean_email, token)
    return {"message": "Verification token sent to your email", "verification_token": token}

@router.post("/demo-login/{target_role}", response_model=Token)
def demo_login(target_role: str, db: Session = Depends(get_db)):
    if target_role not in [r.value for r in UserRole]:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Invalid role: {target_role}")

    demo_email = f"demo.{target_role}@taskpulse.io"
    user = db.scalar(select(User).where(User.email == demo_email))
    if not user:
        user = User(
            email=demo_email,
            hashed_password=hash_password("DemoPassword123!"),
            role=target_role,
            is_verified=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Ensure role and verified status match demo role
        if user.role != target_role or not user.is_verified:
            user.role = target_role
            user.is_verified = True
            db.commit()
            db.refresh(user)

    token = create_access_token(user.id, role=user.role, email=user.email)
    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        user=UserRead.model_validate(user),
    )

@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user