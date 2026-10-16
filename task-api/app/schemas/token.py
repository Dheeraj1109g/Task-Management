from pydantic import BaseModel
from app.schemas.user import UserRead

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str = "member"
    user: UserRead | None = None