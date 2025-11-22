from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User

router = APIRouter(prefix="/admin")

@router.get("/pending")
def pending_users(db: Session = Depends(get_db)):
    return db.query(User).filter(User.approved == False).all()

@router.post("/approve/{user_id}")
def approve(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    user.approved = True
    db.commit()
    return {"message": "User approved"}

@router.post("/reject/{user_id}")
def reject(user_id: int, db: Session = Depends(get_db)):
    db.query(User).filter(User.id == user_id).delete()
    db.commit()
    return {"message": "User rejected"}
