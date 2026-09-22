import importlib
from datetime import datetime
import pytest

@pytest.fixture()
def client():
    app_module = importlib.import_module("backend.app")
    app_module.app.config.update(TESTING=True)
    with app_module.app.test_client() as client:
        from backend.models import db, Product, PromoCode, Review
        with app_module.app.app_context():
            db.create_all()
            # Ensure basic test seeds exist
            if PromoCode.query.filter_by(code="TEST10").first() is None:
                p1 = PromoCode(code="TEST10", discount_type="percent", discount_value=10.0)
                p2 = PromoCode(code="TEST50", discount_type="fixed", discount_value=50.0)
                db.session.add(p1)
                db.session.add(p2)
            
            # Ensure a test product with known stock exists
            prod = Product.query.filter_by(title="Test Widget").first()
            if not prod:
                prod = Product(
                    title="Test Widget",
                    category="Electronics",
                    price=100.0,
                    description="A widget for unit testing.",
                    image_url="http://example.com/widget.jpg",
                    stock=5
                )
                db.session.add(prod)
            else:
                prod.stock = 5
                prod.price = 100.0
                
            db.session.commit()
        yield client


def test_apply_promo_percentage(client):
    # Apply 10% off of 200.00
    response = client.post(
        "/api/promo/apply",
        json={"code": "TEST10", "cart_total": 200.00}
    )
    assert response.status_code == 200
    res_data = response.get_json()
    assert res_data["success"] is True
    assert res_data["discount_amount"] == 20.0
    assert res_data["new_total"] == 180.0


def test_apply_promo_fixed(client):
    # Apply $50 off of 200.00
    response = client.post(
        "/api/promo/apply",
        json={"code": "TEST50", "cart_total": 200.00}
    )
    assert response.status_code == 200
    res_data = response.get_json()
    assert res_data["discount_amount"] == 50.0
    assert res_data["new_total"] == 150.0


def test_apply_promo_invalid(client):
    response = client.post(
        "/api/promo/apply",
        json={"code": "INVALID_CODE", "cart_total": 200.00}
    )
    assert response.status_code == 400
    assert "detail" in response.get_json()


def test_get_and_post_product_reviews(client):
    from backend.app import app
    from backend.models import Product
    with app.app_context():
        prod = Product.query.filter_by(title="Test Widget").first()
        prod_id = prod.id

    # Post a review
    post_res = client.post(
        f"/api/products/{prod_id}/reviews",
        json={
            "username": "Tester Bob",
            "rating": 5,
            "comment": "Incredible quality! Highly recommended."
        }
    )
    assert post_res.status_code == 201
    assert post_res.get_json()["username"] == "Tester Bob"
    assert post_res.get_json()["rating"] == 5

    # Get reviews and assert review exists
    get_res = client.get(f"/api/products/{prod_id}/reviews")
    assert get_res.status_code == 200
    reviews = get_res.get_json()
    assert len(reviews) >= 1
    assert reviews[0]["comment"] == "Incredible quality! Highly recommended."


def test_checkout_stock_enforcement(client):
    from backend.app import app
    from backend.models import db, Product
    with app.app_context():
        prod = Product.query.filter_by(title="Test Widget").first()
        prod_id = prod.id
        initial_stock = prod.stock # Should be 5

    # 1. Purchase quantity larger than stock - should fail
    fail_res = client.post(
        "/api/checkout",
        json={
            "customer_name": "Alice Smith",
            "customer_email": "alice@example.com",
            "items": [{"id": prod_id, "title": "Test Widget", "quantity": 10, "price": 100.0}]
        }
    )
    assert fail_res.status_code == 400
    assert "detail" in fail_res.get_json()
    assert "units left" in fail_res.get_json()["detail"] or "stock" in fail_res.get_json()["detail"].lower()

    # 2. Purchase quantity within stock - should succeed and deduct stock
    success_res = client.post(
        "/api/checkout",
        json={
            "customer_name": "Alice Smith",
            "customer_email": "alice@example.com",
            "items": [{"id": prod_id, "title": "Test Widget", "quantity": 2, "price": 100.0}]
        }
    )
    assert success_res.status_code == 200
    assert success_res.get_json()["success"] is True

    # 3. Assert stock decreased from 5 to 3
    with app.app_context():
        prod_updated = db.session.get(Product, prod_id)
        assert prod_updated.stock == initial_stock - 2


def test_admin_edit_product(client):
    import importlib
    app_module = importlib.import_module("backend.app")
    
    # Login as admin to get token
    login_res = client.post("/api/admin/login", json={"username": "admin", "password": "admin123"})
    assert login_res.status_code == 200
    token = login_res.get_json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Edit product with ID 101 (featured product)
    edit_res = client.put(
        "/api/products/101",
        json={
            "title": "AeroPulse Chrono Precision Analog Watch - Updated",
            "category": "Electronics",
            "price": 549.0,
            "stock": 20,
            "description": "Updated description for luxury timepiece",
            "image_url": "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
            "images": ["https://images.unsplash.com/photo-1524805444758-089113d48a6d"]
        },
        headers=headers
    )
    assert edit_res.status_code == 200
    res_data = edit_res.get_json()
    assert res_data["title"] == "AeroPulse Chrono Precision Analog Watch - Updated"
    assert res_data["price"] == 549.0
    assert res_data["stock"] == 20
