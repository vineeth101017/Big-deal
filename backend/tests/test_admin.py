import os
import importlib
import pytest

os.environ.setdefault("ADMIN_USERNAME", "admin")
os.environ.setdefault("ADMIN_PASSWORD", "admin123")

@pytest.fixture()
def client():
    app_module = importlib.import_module("backend.app")
    app_module.app.config.update(TESTING=True)
    with app_module.app.test_client() as client:
        yield client


def test_admin_login_returns_token_for_valid_credentials(client):
    response = client.post(
        "/api/admin/login",
        json={"username": "admin", "password": "admin123"},
    )

    assert response.status_code == 200
    assert "token" in response.get_json()


def test_admin_products_requires_authentication(client):
    response = client.post("/api/admin/products", json={"title": "Test Product"})

    assert response.status_code == 401


def test_admin_can_create_product(client):
    login_response = client.post(
        "/api/admin/login",
        json={"username": "admin", "password": "admin123"},
    )
    token = login_response.get_json()["token"]

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

    assert response.status_code == 201
    assert response.get_json()["title"] == "Smart Lamp"
    pid = response.get_json().get("id")
    if pid:
        client.delete(f"/api/admin/products/{pid}", headers={"Authorization": f"Bearer {token}"})
