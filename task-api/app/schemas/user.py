from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    role: str | None = None

    @field_validator("email")
    @classmethod
    def lowercase_email(cls, v: str) -> str:
        return v.lower()


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    role: str = "member"
    is_verified: bool = False
    created_at: datetime | None = None


class UserRegisterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    role: str = "member"
    is_verified: bool = False
    verification_token: str | None = None
    message: str = "Registration successful. Please verify your email."


class VerifyEmailRequest(BaseModel):
    token: str = Field(min_length=1)


class RoleUpdateRequest(BaseModel):
    role: str = Field(pattern="^(admin|manager|member)$")


class UserAdminView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    role: str
    is_verified: bool
    created_at: datetime | None = None
    task_count: int = 0