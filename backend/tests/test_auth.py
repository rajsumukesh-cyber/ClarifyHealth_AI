import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.services.auth_service import verify_password, get_password_hash

# In-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
Base.metadata.create_all(bind=engine)
client = TestClient(app)

def test_password_hashing():
    pwd = "MySecretPassword123!"
    hashed = get_password_hash(pwd)
    assert verify_password(pwd, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_user_registration_and_login():
    # Register
    email = "tester@example.com"
    pwd = "StrongPassword2026!"
    reg_resp = client.post("/api/auth/register", json={
        "email": email,
        "password": pwd,
        "full_name": "Test User"
    })
    assert reg_resp.status_code == 201
    data = reg_resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == email

    # Login
    login_resp = client.post("/api/auth/login-json", json={
        "email": email,
        "password": pwd
    })
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "access_token" in login_data
    token = login_data["access_token"]

    # Profile check with token
    prof_resp = client.get("/api/auth/profile", headers={"Authorization": f"Bearer {token}"})
    assert prof_resp.status_code == 200
    assert prof_resp.json()["email"] == email

def test_demo_login():
    resp = client.post("/api/auth/demo-login")
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["is_demo_user"] is True
