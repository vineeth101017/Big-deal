import os

from fastapi.testclient import TestClient

from backend.main import app

os.environ.setdefault("ADMIN_USERNAME", "admin")
os.environ.setdefault("ADMIN_PASSWORD", "admin123")

client = TestClient(app)


def test_admin_login_returns_token_for_valid_credentials():
    response = client.post(
        "/api/admin/login",
        json={"username": "admin", "password": "admin123"},
    )

    assert response.status_code == 200
    assert "token" in response.json()


def test_admin_products_requires_authentication():
    response = client.get("/api/admin/products")

    assert response.status_code == 401


def test_admin_can_create_product():
    login_response = client.post(
        "/api/admin/login",
        json={"username": "admin", "password": "admin123"},
    )
    token = login_response.json()["token"]

    response = client.post(
        "/api/admin/products",
        json={
            "title": "Smart Lamp",
            "category": "Home",
            "price": 89.99,
            "description": "A minimalist smart lamp for cozy rooms.",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json()["title"] == "Smart Lamp"
