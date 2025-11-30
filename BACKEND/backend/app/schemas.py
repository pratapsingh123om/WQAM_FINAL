# BACKEND/backend/app/schemas.py
from typing import Optional
from pydantic import BaseModel, Field, validator


class RegisterRequest(BaseModel):
    name: Optional[str] = None
    email: str = Field(..., description="User email (dev-friendly)")
    password: str = Field(..., min_length=6, description="Password (min 6 chars)")
    organisation: Optional[str] = None
    industry_type: Optional[str] = None  # e.g. "Industry" / "STP" / "WTP" / "Custom"
    validator_type: Optional[str] = None  # e.g. "Govt" / "Private" / "AI-enabled"

    @validator("email", pre=True)
    def normalize_email(cls, v: str) -> str:
        if isinstance(v, str):
            v = v.strip()
            if "@" not in v:
                raise ValueError("email must contain '@'")
            return v
        raise ValueError("invalid email")


class LoginRequest(BaseModel):
    email: str = Field(..., description="User email")
    password: str = Field(..., description="Password")
    role: Optional[str] = None  # user / validator / admin

    @validator("email", pre=True)
    def strip_email(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip()
        raise ValueError("invalid email")


class TokenResponse(BaseModel):
    access_token: str
    role: str


class UserPublic(BaseModel):
    id: int
    name: Optional[str] = None
    email: str
    role: str
    organisation: Optional[str] = None
    industry_type: Optional[str] = None
    validator_type: Optional[str] = None
    status: str

    # ✅ FIX: Use from_attributes instead of orm_mode for Pydantic v2
    model_config = {"from_attributes": True}