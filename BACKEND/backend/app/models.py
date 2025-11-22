from sqlalchemy import Column, Integer, String, Boolean
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin / user / validator
    organisation = Column(String, nullable=True)
    industry_type = Column(String, nullable=True)   # Industry/STP/WTP/Custom
    validator_type = Column(String, nullable=True)  # govt/private/ai-enabled
    status = Column(String, default="pending")      # pending/approved/rejected
