from Backend.database import engine, SessionLocal
from Backend.schemas import Base
from Backend.auth import get_password_hash
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv("key.env")

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create initial admin user if it doesn't exist
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                username="admin",
                email="admin@careerforge.ai",
                hashed_password=get_password_hash(os.getenv("ADMIN_PASSWORD", "admin123")),
                full_name="Admin User",
                credits=1000,
                plan="premium",
                is_active=True
            )
            db.add(admin)
            db.commit()
            print("Admin user created successfully")
    except Exception as e:
        print(f"Error creating admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialization complete!") 