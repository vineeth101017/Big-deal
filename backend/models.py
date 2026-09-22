from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=False, default='')
    stock = db.Column(db.Integer, nullable=False, default=10)
    
    # Relationship to ProductImage model
    images = db.relationship('ProductImage', backref='product', lazy=True, cascade="all, delete-orphan")
    reviews = db.relationship('Review', backref='product', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        avg_rating = round(sum(r.rating for r in self.reviews) / len(self.reviews), 1) if self.reviews else 0.0
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "price": self.price,
            "description": self.description,
            "image_url": self.image_url,
            "stock": self.stock,
            "average_rating": avg_rating,
            "reviews_count": len(self.reviews),
            "images": [img.to_dict() for img in self.images] if self.images else [{"id": 0, "image_url": self.image_url}]
        }


class ProductImage(db.Model):
    __tablename__ = 'product_images'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    sort_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "is_primary": self.is_primary,
            "sort_order": self.sort_order
        }


class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_name = db.Column(db.String(255), nullable=False)
    customer_email = db.Column(db.String(255), nullable=False)
    total = db.Column(db.Float, nullable=False)
    promo_code = db.Column(db.String(50), nullable=True)
    discount_amount = db.Column(db.Float, nullable=False, default=0.0)
    status = db.Column(db.String(50), nullable=False, default="Placed")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to OrderItem model
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "customer_name": self.customer_name,
            "customer_email": self.customer_email,
            "total": self.total,
            "promo_code": self.promo_code,
            "discount_amount": self.discount_amount,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at,
            "items": [item.to_dict() for item in self.items]
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "title": self.title,
            "quantity": self.quantity,
            "price": self.price
        }


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }


class AdminUser(db.Model):
    __tablename__ = 'admin_users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username
        }


class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    username = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "username": self.username,
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }


class PromoCode(db.Model):
    __tablename__ = 'promo_codes'
    
    code = db.Column(db.String(50), primary_key=True)
    discount_type = db.Column(db.String(20), nullable=False) # 'percent' or 'fixed'
    discount_value = db.Column(db.Float, nullable=False)
    active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "code": self.code,
            "discount_type": self.discount_type,
            "discount_value": self.discount_value,
            "active": self.active
        }


class WishlistItem(db.Model):
    __tablename__ = 'wishlist_items'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    
    # Relationship
    product = db.relationship('Product', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "product": self.product.to_dict() if self.product else None
        }
