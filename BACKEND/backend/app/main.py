# backend/app/main.py
import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import ValidationError
from sqlalchemy.orm import Session

from . import models, schemas
from .database import SessionLocal, engine, Base

import smtplib
from email.message import EmailMessage

# CONFIG
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret_replace_me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24))  # 1 day default

# create DB tables (migrations recommended for prod)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="WQAM Backend")

# Allow all origins for dev. Lock this down in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use pbkdf2_sha256 to avoid bcrypt native compilation issues in some environments
pwd_ctx = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_password_hash(password: str) -> str:
    return pwd_ctx.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Simple SMTP/email stub (configure env variables to enable real email)
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@example.com")


def send_email(to_email: str, subject: str, body: str):
    # If SMTP not configured we just log. Replace with production email provider in real deployment.
    if not (SMTP_HOST and SMTP_USER and SMTP_PASS):
        print("SMTP not configured; skipping email send:", to_email, subject)
        return
    msg = EmailMessage()
    msg["From"] = FROM_EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
        s.starttls()
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)


# Startup: ensure at least one admin exists (use a safe email for dev)
@app.on_event("startup")
def ensure_admin():
    db = SessionLocal()
    try:
        admin = db.query(models.User).filter(models.User.role == "admin").first()
        if not admin:
            admin_user = models.User(
                name="Administrator",
                email=os.getenv("DEFAULT_ADMIN_EMAIL", "admin@example.com"),
                password_hash=create_password_hash(os.getenv("DEFAULT_ADMIN_PASSWORD", "ganeshmeredeva")),
                role="admin",
                status="approved",
            )
            db.add(admin_user)
            db.commit()
            print(f"Created default admin: {admin_user.email} / (password from env or 'admin123')")
        else:
            print("Admin exists, skipping creation.")
    finally:
        db.close()


# ROUTES ----------------------------------------------------------

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/register")
def register(payload: schemas.RegisterRequest, role: str = Query(..., description="user or validator"), db: Session = Depends(get_db)):
    role = (role or "").lower()
    if role not in ("user", "validator"):
        raise HTTPException(status_code=400, detail="role must be 'user' or 'validator'")

    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    new = models.User(
        name=payload.name,
        email=payload.email,
        password_hash=create_password_hash(payload.password),
        role=role,
        organisation=payload.organisation,
        industry_type=payload.industry_type if role == "user" else None,
        validator_type=payload.validator_type if role == "validator" else None,
        status="pending",
    )
    db.add(new)
    db.commit()
    db.refresh(new)

    # optional email notification
    send_email(new.email, "WQAM: registration received", f"Hi {new.name or ''}, your registration is pending admin approval.")
    return {"message": "registered", "id": new.id, "status": new.status}


@app.post("/auth/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if payload.role and payload.role != user.role:
        raise HTTPException(status_code=403, detail="Incorrect role selected")
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.status != "approved":
        raise HTTPException(status_code=403, detail="Admin approval pending")
    token = create_access_token({"sub": user.email, "role": user.role, "id": user.id})
    return {"access_token": token, "role": user.role}


@app.post("/auth/admin-login", response_model=schemas.TokenResponse)
def admin_login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or user.role != "admin":
        raise HTTPException(status_code=404, detail="Admin not found")
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email, "role": "admin", "id": user.id})
    return {"access_token": token, "role": "admin"}


# Helper dependency: extract Bearer token from Authorization header and return SQLAlchemy user
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    data = decode_token(token)
    email = data.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/admin/pending")
def pending_accounts(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="admin only")
    pending = db.query(models.User).filter(models.User.status == "pending").all()
    return [schemas.UserPublic.from_orm(u) for u in pending]


@app.post("/admin/approve/{user_id}")
def approve(user_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="admin only")
    target = db.query(models.User).filter(models.User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    target.status = "approved"
    db.commit()
    send_email(target.email, "WQAM: Account approved", f"Hi {target.name or ''}, your account has been approved.")
    return {"message": "approved", "id": target.id}


@app.post("/admin/reject/{user_id}")
def reject(user_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="admin only")
    target = db.query(models.User).filter(models.User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    target.status = "rejected"
    db.commit()
    send_email(target.email, "WQAM: Account rejected", f"Hi {target.name or ''}, your account was rejected by admin.")
    return {"message": "rejected", "id": target.id}


@app.get("/me", response_model=schemas.UserPublic)
def me(current_user=Depends(get_current_user)):
    return schemas.UserPublic.from_orm(current_user)
