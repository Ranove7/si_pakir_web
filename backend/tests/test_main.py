from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

# Mock koneksi database agar main.py tidak benar-benar konek ke MySQL saat testing
with patch("pymysql.connect", return_value=MagicMock()):
    from main import app

client = TestClient(app)

def test_root_api():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "API Smart Parking berjalan"