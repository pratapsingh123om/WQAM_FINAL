from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import get_db
from models import User, Role

router = APIRouter(prefix="/auth")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/signup")
def signup(username: str, password: str, role: str, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        username=username,
        password=pwd_context.hash(password),
        role=Role(role),
        approved=False
    )
    db.add(new_user)
    db.commit()
    return {"message": "Signup submitted, wait for approval"}

@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not pwd_context.verify(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.approved:
        raise HTTPException(status_code=403, detail="Account not approved yet")

    return {"message": "Login success", "role": user.role, "user_id": user.id}
