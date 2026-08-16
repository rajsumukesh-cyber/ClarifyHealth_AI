from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db

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

def test_preset_load_and_chat_flow():
    # 1. Login demo
    login_resp = client.post("/api/auth/demo-login")
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get presets
    presets_resp = client.get("/api/reports/presets/list")
    assert presets_resp.status_code == 200
    presets = presets_resp.json()
    assert len(presets) >= 4

    # 3. Load CBC preset
    load_resp = client.post("/api/reports/preset/load", data={"preset_id": "cbc-panel"}, headers=headers)
    assert load_resp.status_code == 201
    report = load_resp.json()
    report_id = report["id"]
    assert report["status"] == "completed"
    assert len(report["terms_data"]) > 0

    # 4. List reports
    list_resp = client.get("/api/reports", headers=headers)
    assert list_resp.status_code == 200
    reports = list_resp.json()
    assert len(reports) >= 1
    assert reports[0]["id"] == report_id

    # 5. Chat about report
    chat_resp = client.post(
        f"/api/reports/{report_id}/chat",
        json={"message": "What values are outside the reference ranges?"},
        headers=headers
    )
    assert chat_resp.status_code == 200
    chat_data = chat_resp.json()
    assert "outside" in chat_data["content"].lower() or "hemoglobin" in chat_data["content"].lower() or "flagged" in chat_data["content"].lower()

    # 6. Delete report
    del_resp = client.delete(f"/api/reports/{report_id}", headers=headers)
    assert del_resp.status_code == 200
