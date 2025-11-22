import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal, engine, Base
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import smtplib
from email.message import EmailMessage

# Config
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret_replace_me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24  # 1 day

# create DB tables


app = FastAPI(title="WQAM Backend")

# CORS: open for now; change to specific origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing context (avoids bcrypt native dependency)
pwd_ctx = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility: create hash / verify
def create_password_hash(password: str) -> str:
    # pbkdf2_sha256 handles any length safely
    return pwd_ctx.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)

# JWT helpers
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Email (simple SMTP stub) - configure via env if available
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@example.com")

def send_email(to_email: str, subject: str, body: str):
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
        # missing config, just log (or you can raise). For now, silent fallback.
        print("SMTP not configured — skipping email:", to_email, subject)
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

# Create default admin on startup if not exists
@app.on_event("startup")
def startup():
    # create tables here
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")
    
    db = SessionLocal()
    try:
        admin = db.query(models.User).filter(models.User.role == "admin").first()
        if not admin:
            admin_user = models.User(
                name="Administrator",
                email="admin@wqam.local",
                password_hash=create_password_hash("admin123"),
                role="admin",
                status="approved"
            )
            db.add(admin_user)
            db.commit()
            print("Created default admin: admin@wqam.local / admin123")
        else:
            print("Admin already exists. Skipping creation.")
    finally:
        db.close()


# -----------------------------
# Routes
# -----------------------------
@app.get("/health")
def health():
    return {"status":"ok"}

# Register (user or validator)
@app.post("/register")
def register(req: schemas.RegisterRequest, role: str, db: Session = Depends(get_db)):
    if role not in ("user", "validator"):
        raise HTTPException(status_code=400, detail="role must be 'user' or 'validator'")
    existing = db.query(models.User).filter(models.User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    new = models.User(
        name=req.name,
        email=req.email,
        password_hash=create_password_hash(req.password),
        role=role,
        organisation=req.organisation,
        industry_type=req.industry_type if role == "user" else None,
        validator_type=req.validator_type if role == "validator" else None,
        status="pending"
    )
    db.add(new)
    db.commit()
    db.refresh(new)
    # optionally send "registration received" email
    send_email(new.email, "WQAM: registration received", f"Hi {new.name or ''}, your registration is pending admin approval.")
    return {"message":"registered", "id": new.id, "status": new.status}

# Common login for user/validator
@app.post("/auth/login", response_model=schemas.TokenResponse)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if req.role and req.role != user.role:
        raise HTTPException(status_code=403, detail="Incorrect role selected")
    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.status != "approved":
        raise HTTPException(status_code=403, detail="Admin approval pending")
    access = create_access_token({"sub": user.email, "role": user.role, "id": user.id})
    return {"access_token": access, "role": user.role}

# Admin login (separate endpoint)
@app.post("/auth/admin-login", response_model=schemas.TokenResponse)
def admin_login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user or user.role != "admin":
        raise HTTPException(status_code=404, detail="Admin not found")
    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access = create_access_token({"sub": user.email, "role": "admin", "id": user.id})
    return {"access_token": access, "role": "admin"}

# Helper: get current user from Authorization header
from fastapi import Header
def get_current_user(authorization: str | None = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing auth header")
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    data = decode_token(token)
    email = data.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Admin-only: list pending accounts
@app.get("/admin/pending")
def pending_accounts(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="admin only")
    pending = db.query(models.User).filter(models.User.status == "pending").all()
    return [{"id": u.id, "email": u.email, "name": u.name, "role": u.role, "organisation": u.organisation, "industry_type": u.industry_type, "validator_type": u.validator_type, "status": u.status} for u in pending]

# Admin approve
@app.post("/admin/approve/{user_id}")
def approve(user_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="admin only")
    target = db.query(models.User).filter(models.User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    target.status = "approved"
    db.commit()
    send_email(target.email, "WQAM: Account approved", f"Hi {target.name or ''}, your account has been approved.")
    return {"message":"approved", "id": target.id}

# Admin reject
@app.post("/admin/reject/{user_id}")
def reject(user_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="admin only")
    target = db.query(models.User).filter(models.User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    target.status = "rejected"
    db.commit()
    send_email(target.email, "WQAM: Account rejected", f"Hi {target.name or ''}, your account was rejected by admin.")
    return {"message":"rejected", "id": target.id}

# Simple endpoint to get self info
@app.get("/me")
def me(current_user = Depends(get_current_user)):
    return {"email": current_user.email, "role": current_user.role, "id": current_user.id, "status": current_user.status}
