from rest_framework import serializers
from .models import Product, ProductImage, Order, OrderItem, User, AdminUser, Review, PromoCode, WishlistItem

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'is_primary', 'sort_order']


class ReviewSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S.%fZ", read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product_id', 'username', 'rating', 'comment', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'category', 'price', 'description', 
            'image_url', 'stock', 'average_rating', 'reviews_count', 'images', 'reviews'
        ]

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 0.0
        return round(sum(r.rating for r in reviews) / len(reviews), 1)

    def get_reviews_count(self, obj):
        return obj.reviews.count()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Match Flask format for images list fallback
        if not ret.get('images'):
            ret['images'] = [{"id": 0, "image_url": instance.image_url}]
        # Remove nested reviews from base product representation to match Flask to_dict()
        ret.pop('reviews', None)
        return ret


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'title', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S.%fZ", read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'customer_email', 'total', 
            'promo_code', 'discount_amount', 'status', 'created_at', 'items'
        ]


class UserSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S.%fZ", read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'created_at']


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['id', 'username']


class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = ['code', 'discount_type', 'discount_value', 'active']


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'user_id', 'product_id', 'product']
