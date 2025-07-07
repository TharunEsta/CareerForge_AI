from sqlalchemy import create_engine, Column, Integer, String, DateTime, UniqueConstraint, ForeignKey, Float, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
import uuid

DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class RevokedToken(Base):
    __tablename__ = "revoked_tokens"
    id = Column(Integer, primary_key=True, index=True)
    jti = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    __table_args__ = (UniqueConstraint('jti', name='uq_jti'),)

class Subscription(Base):
    __tablename__ = "subscriptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    plan_id = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    status = Column(String, default="active", index=True)  # active, cancelled, expired
    credits_remaining = Column(Integer, default=0)
    auto_renew = Column(Boolean, default=True)
    user = relationship("User")

class VoiceAssistantLicense(Base):
    __tablename__ = "voice_assistant_licenses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    license_key = Column(String, unique=True, default=lambda: str(uuid.uuid4()), nullable=False)
    plan_id = Column(String, nullable=False)
    status = Column(String, default="active", index=True)  # active, expired, revoked
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    wake_name = Column(String, default="Assistant")
    user = relationship("User")

class PaymentHistory(Base):
    __tablename__ = "payment_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    payment_method = Column(String, nullable=False)
    payment_gateway = Column(String, nullable=False)
    transaction_id = Column(String, unique=True, nullable=False)
    status = Column(String, default="completed")  # completed, failed, refunded
    created_at = Column(DateTime, nullable=False)
    invoice_url = Column(String, nullable=True)
    user = relationship("User")

Base.metadata.create_all(bind=engine)

