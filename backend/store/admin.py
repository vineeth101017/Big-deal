from django.contrib import admin
from .models import Product, ProductImage, Order, OrderItem, User, AdminUser, Review, PromoCode, WishlistItem

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'price', 'stock')
    search_fields = ('title', 'category', 'description')
    list_filter = ('category',)
    inlines = [ProductImageInline, ReviewInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'customer_email', 'total', 'status', 'created_at')
    search_fields = ('customer_name', 'customer_email', 'promo_code')
    list_filter = ('status', 'created_at')
    inlines = [OrderItemInline]

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'created_at')
    search_fields = ('name', 'email')

@admin.register(AdminUser)
class AdminUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username')
    search_fields = ('username',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'username', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('username', 'comment')

@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'discount_value', 'active')
    list_filter = ('discount_type', 'active')
    search_fields = ('code',)

@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product')
