from django.db import models
from django.utils import timezone

class Product(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    price = models.FloatField()
    description = models.TextField()
    image_url = models.CharField(max_length=500, blank=True, default='')
    stock = models.IntegerField(default=10)

    class Meta:
        db_table = 'products'
        ordering = ['id']

    def __str__(self):
        return self.title

    def to_dict(self):
        reviews_list = list(self.reviews.all())
        avg_rating = round(sum(r.rating for r in reviews_list) / len(reviews_list), 1) if reviews_list else 0.0
        images_list = list(self.images.all())
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "price": self.price,
            "description": self.description,
            "image_url": self.image_url,
            "stock": self.stock,
            "average_rating": avg_rating,
            "reviews_count": len(reviews_list),
            "images": [img.to_dict() for img in images_list] if images_list else [{"id": 0, "image_url": self.image_url}]
        }


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image_url = models.CharField(max_length=500)
    is_primary = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = 'product_images'
        ordering = ['sort_order', 'id']

    def __str__(self):
        return f"{self.product.title} - Image ({self.sort_order})"

    def to_dict(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "is_primary": self.is_primary,
            "sort_order": self.sort_order
        }


class Order(models.Model):
    customer_name = models.CharField(max_length=255)
    customer_email = models.CharField(max_length=255)
    total = models.FloatField()
    promo_code = models.CharField(max_length=50, null=True, blank=True)
    discount_amount = models.FloatField(default=0.0)
    status = models.CharField(max_length=50, default="Placed")
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'orders'
        ordering = ['-id']

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"

    def to_dict(self):
        return {
            "id": self.id,
            "customer_name": self.customer_name,
            "customer_email": self.customer_email,
            "total": self.total,
            "promo_code": self.promo_code,
            "discount_amount": self.discount_amount,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "items": [item.to_dict() for item in self.items.all()]
        }


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_id = models.IntegerField()
    title = models.CharField(max_length=255)
    quantity = models.IntegerField()
    price = models.FloatField()

    class Meta:
        db_table = 'order_items'

    def __str__(self):
        return f"{self.title} x {self.quantity}"

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "title": self.title,
            "quantity": self.quantity,
            "price": self.price
        }


class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.name} ({self.email})"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class AdminUser(models.Model):
    username = models.CharField(max_length=255, unique=True)
    password_hash = models.CharField(max_length=255)

    class Meta:
        db_table = 'admin_users'

    def __str__(self):
        return self.username

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username
        }


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    username = models.CharField(max_length=255)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.username} on {self.product.title}"

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "username": self.username,
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class PromoCode(models.Model):
    code = models.CharField(max_length=50, primary_key=True)
    discount_type = models.CharField(max_length=20)  # 'percent' or 'fixed'
    discount_value = models.FloatField()
    active = models.BooleanField(default=True)

    class Meta:
        db_table = 'promo_codes'

    def __str__(self):
        return f"{self.code} ({self.discount_value}{'%' if self.discount_type == 'percent' else '$'})"

    def to_dict(self):
        return {
            "code": self.code,
            "discount_type": self.discount_type,
            "discount_value": self.discount_value,
            "active": self.active
        }


class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')

    class Meta:
        db_table = 'wishlist_items'
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.email} - {self.product.title}"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "product": self.product.to_dict() if self.product else None
        }
