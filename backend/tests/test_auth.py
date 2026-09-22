import importlib
from datetime import datetime

import pytest


@pytest.fixture()
def client():
    app_module = importlib.import_module("backend.app")
    app_module.app.config.update(TESTING=True)
    with app_module.app.test_client() as client:
        yield client


def test_register_and_login_flow(client):
    email = f"ava_{datetime.utcnow().strftime('%H%M%S%f')}@example.com"
    register_response = client.post(
        "/api/auth/register",
        json={
            "name": "Ava",
            "email": email,
            "password": "secret123",
        },
    )
    assert register_response.status_code == 200
    assert register_response.get_json()["user"]["email"] == email

    login_response = client.post(
        "/api/auth/login",
        json={"email": email, "password": "secret123"},
    )
    assert login_response.status_code == 200
    assert login_response.get_json()["user"]["email"] == email
