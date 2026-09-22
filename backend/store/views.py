import hashlib
import secrets
from django.db import transaction
from django.db.models import Min, Max
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Product, ProductImage, Order, OrderItem, User, AdminUser, Review, PromoCode, WishlistItem

# In-memory admin tokens set matching Flask behavior
issued_admin_tokens = set()


def require_admin(request) -> bool:
    auth_header = request.headers.get("Authorization") or request.META.get("HTTP_AUTHORIZATION", "")
    if not auth_header or not auth_header.startswith("Bearer "):
        return False
    token = auth_header.split(" ", 1)[1]
    return token in issued_admin_tokens


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


# -------------------------------------------------------------
# Health Check
# -------------------------------------------------------------
@api_view(['GET'])
def health(request):
    return Response({"status": "ok", "message": "Big Deal e-commerce API is running"})


# -------------------------------------------------------------
# Auth Endpoints
# -------------------------------------------------------------
@api_view(['POST'])
def register_user(request):
    data = request.data or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not name or not email or not password:
        return Response({"detail": "Name, email, and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"detail": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(
        name=name,
        email=email,
        password_hash=hash_password(password)
    )

    return Response({"success": True, "user": user.to_dict()}, status=status.HTTP_200_OK)


@api_view(['POST'])
def login_user(request):
    data = request.data or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not email or not password:
        return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.filter(email=email, password_hash=hash_password(password)).first()
    if not user:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    token = secrets.token_urlsafe(16)
    return Response({"success": True, "token": token, "user": user.to_dict()}, status=status.HTTP_200_OK)


@api_view(['POST'])
def admin_login(request):
    data = request.data or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()

    admin = AdminUser.objects.filter(username=username, password_hash=hash_password(password)).first()
    if not admin:
        return Response({"detail": "Invalid admin credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    token = secrets.token_urlsafe(16)
    issued_admin_tokens.add(token)
    return Response({"token": token}, status=status.HTTP_200_OK)


# -------------------------------------------------------------
# Products & Catalog
# -------------------------------------------------------------
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all().order_by('id')
    return Response([p.to_dict() for p in products])


@api_view(['GET'])
def search_products(request):
    query = (request.query_params.get("q") or "").strip().lower()
    category = (request.query_params.get("category") or "").strip().lower()
    
    try:
        min_price = float(request.query_params.get("min_price", 0))
    except (TypeError, ValueError):
        min_price = 0.0
        
    try:
        max_price = float(request.query_params.get("max_price", float('inf')))
    except (TypeError, ValueError):
        max_price = float('inf')

    all_products = Product.objects.all().order_by('price')
    results = []
    for product in all_products:
        title_lower = product.title.lower()
        desc_lower = product.description.lower()
        cat_lower = product.category.lower()

        matches_query = not query or query in title_lower or query in desc_lower
        matches_category = not category or cat_lower == category
        matches_price = min_price <= product.price <= max_price

        if matches_query and matches_category and matches_price:
            results.append(product.to_dict())

    return Response(results)


@api_view(['GET'])
def get_categories(request):
    categories = list(Product.objects.values_list('category', flat=True).distinct().order_by('category'))
    return Response(categories)


@api_view(['GET'])
def get_price_range(request):
    stats = Product.objects.aggregate(min_price=Min('price'), max_price=Max('price'))
    return Response({
        "min_price": stats['min_price'] if stats['min_price'] is not None else 0,
        "max_price": stats['max_price'] if stats['max_price'] is not None else 999
    })


# -------------------------------------------------------------
# Reviews
# -------------------------------------------------------------
@api_view(['GET', 'POST'])
def product_reviews(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        reviews = product.reviews.all().order_by('-created_at')
        return Response([r.to_dict() for r in reviews])

    # POST new review
    data = request.data or {}
    username = (data.get("username") or "").strip() or "Anonymous"
    rating = data.get("rating")
    comment = (data.get("comment") or "").strip()

    if rating is None:
        return Response({"detail": "Rating is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        rating_val = int(rating)
        if rating_val < 1 or rating_val > 5:
            raise ValueError()
    except (TypeError, ValueError):
        return Response({"detail": "Rating must be an integer between 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)

    if not comment:
        return Response({"detail": "Comment is required"}, status=status.HTTP_400_BAD_REQUEST)

    review = Review.objects.create(
        product=product,
        username=username,
        rating=rating_val,
        comment=comment
    )
    return Response(review.to_dict(), status=status.HTTP_201_CREATED)


# -------------------------------------------------------------
# Promo Codes
# -------------------------------------------------------------
@api_view(['POST'])
def apply_promo(request):
    data = request.data or {}
    code = (data.get("code") or "").strip().upper()
    try:
        cart_total = float(data.get("cart_total", 0.0))
    except (TypeError, ValueError):
        cart_total = 0.0

    promo = PromoCode.objects.filter(code=code, active=True).first()
    if not promo:
        return Response({"detail": "Invalid or expired promo code"}, status=status.HTTP_400_BAD_REQUEST)

    if promo.discount_type == "percent":
        discount = round(cart_total * (promo.discount_value / 100.0), 2)
    else:
        discount = round(min(promo.discount_value, cart_total), 2)

    new_total = round(max(0.0, cart_total - discount), 2)
    return Response({
        "success": True,
        "code": promo.code,
        "discount_type": promo.discount_type,
        "discount_value": promo.discount_value,
        "discount_amount": discount,
        "new_total": new_total
    })


# -------------------------------------------------------------
# Checkout & Orders
# -------------------------------------------------------------
@api_view(['POST'])
def checkout(request):
    data = request.data or {}
    items = data.get("items", [])
    if not items:
        return Response({"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        # 1. Enforce stock validation first
        products_to_update = []
        for item in items:
            pid = item.get("id")
            qty = item.get("quantity", 0)
            if qty <= 0:
                return Response({"detail": f"Invalid quantity for item ID {pid}"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                prod = Product.objects.select_for_update().get(id=pid)
            except Product.DoesNotExist:
                return Response({"detail": f"Product with ID {pid} not found"}, status=status.HTTP_404_NOT_FOUND)

            if prod.stock < qty:
                return Response({"detail": f"Not enough stock for '{prod.title}'. Only {prod.stock} units left."}, status=status.HTTP_400_BAD_REQUEST)

            products_to_update.append((prod, qty))

        # Calculate initial subtotal
        subtotal = sum(item.get("quantity", 0) * item.get("price", 0) for item in items)

        # 2. Server-side Promo validation
        promo_code = (data.get("promo_code") or "").strip().upper()
        discount_amount = 0.0
        if promo_code:
            promo = PromoCode.objects.filter(code=promo_code, active=True).first()
            if promo:
                if promo.discount_type == "percent":
                    discount_amount = round(subtotal * (promo.discount_value / 100.0), 2)
                else:
                    discount_amount = round(min(promo.discount_value, subtotal), 2)
            else:
                return Response({"detail": f"Promo code '{promo_code}' is invalid or expired."}, status=status.HTTP_400_BAD_REQUEST)

        total = round(max(0.0, subtotal - discount_amount), 2)

        order = Order.objects.create(
            customer_name=data.get("customer_name", ""),
            customer_email=data.get("customer_email", ""),
            total=total,
            promo_code=promo_code if promo_code else None,
            discount_amount=discount_amount
        )

        for item in items:
            OrderItem.objects.create(
                order=order,
                product_id=item.get("id"),
                title=item.get("title", ""),
                quantity=item.get("quantity", 0),
                price=item.get("price", 0)
            )

        # 3. Deduct stock inventory
        for prod, qty in products_to_update:
            prod.stock -= qty
            prod.save()

    return Response({
        "success": True,
        "order_id": order.id,
        "total": total,
        "discount_amount": discount_amount,
        "message": "Order placed successfully"
    })


@api_view(['GET'])
def get_user_orders(request):
    email = request.query_params.get("email", "").strip().lower()
    if not email:
        return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    orders = Order.objects.filter(customer_email__iexact=email).order_by('-id')
    return Response([o.to_dict() for o in orders])


# -------------------------------------------------------------
# Wishlist
# -------------------------------------------------------------
@api_view(['GET', 'POST', 'DELETE'])
def user_wishlist(request):
    if request.method == 'GET':
        email = request.query_params.get("email", "").strip().lower()
        if not email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        items = user.wishlist_items.select_related('product').all()
        return Response([item.product.to_dict() for item in items if item.product])

    elif request.method == 'POST':
        data = request.data or {}
        email = (data.get("email") or "").strip().lower()
        product_id = data.get("product_id")
        if not email or not product_id:
            return Response({"detail": "Email and product_id are required"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        WishlistItem.objects.get_or_create(user=user, product=product)
        return Response({"success": True, "message": "Product added to wishlist"})

    elif request.method == 'DELETE':
        email = request.query_params.get("email", "").strip().lower()
        product_id = request.query_params.get("product_id")
        if not email or not product_id:
            return Response({"detail": "Email and product_id are required"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        WishlistItem.objects.filter(user=user, product_id=product_id).delete()
        return Response({"success": True, "message": "Product removed from wishlist"})


# -------------------------------------------------------------
# Admin Management Endpoints
# -------------------------------------------------------------
@api_view(['GET'])
def get_admin_orders(request):
    if not require_admin(request):
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
    orders = Order.objects.all().order_by('-id')
    return Response([o.to_dict() for o in orders])


@api_view(['PUT'])
def update_admin_order_status(request, order_id):
    if not require_admin(request):
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data or {}
    new_status = data.get("status")
    if not new_status:
        return Response({"detail": "Status value is required"}, status=status.HTTP_400_BAD_REQUEST)

    valid_statuses = ["Placed", "Processing", "Shipped", "Delivered"]
    if new_status not in valid_statuses:
        return Response({"detail": f"Invalid status. Must be one of {valid_statuses}"}, status=status.HTTP_400_BAD_REQUEST)

    order.status = new_status
    order.save()
    return Response(order.to_dict())


@api_view(['POST'])
def create_admin_product(request):
    if not require_admin(request):
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
    data = request.data or {}
    title = (data.get("title") or "").strip()
    category = (data.get("category") or "").strip()
    price = data.get("price")
    description = (data.get("description") or "").strip()

    if not title or not category or price is None or not description:
        return Response({"detail": "Title, category, price, and description are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        price_val = float(price)
    except (TypeError, ValueError):
        return Response({"detail": "Price must be a valid number"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        stock_val = int(data.get("stock", 10))
    except (TypeError, ValueError):
        stock_val = 10

    product = Product.objects.create(
        title=title,
        category=category,
        price=price_val,
        description=description,
        image_url=data.get("image_url", ""),
        stock=stock_val
    )
    return Response(product.to_dict(), status=status.HTTP_200_OK)


@api_view(['PUT', 'DELETE'])
def admin_product_detail(request, product_id):
    if not require_admin(request):
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        product = None

    if request.method == 'DELETE':
        if product:
            product.delete()
        return Response({"success": True, "message": f"Product {product_id} deleted successfully"})

    elif request.method == 'PUT':
        data = request.data or {}
        title = (data.get("title") or "").strip()
        category = (data.get("category") or "").strip()
        price = data.get("price")
        description = (data.get("description") or "").strip()
        image_url = (data.get("image_url") or "").strip()

        if not title or not category or price is None or not description:
            return Response({"detail": "Title, category, price, and description are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            price_val = float(price)
            if price_val < 0:
                raise ValueError()
        except (TypeError, ValueError):
            return Response({"detail": "Price must be a non-negative number"}, status=status.HTTP_400_BAD_REQUEST)

        if not product:
            product = Product.objects.create(
                id=product_id,
                title=title,
                category=category,
                price=price_val,
                description=description,
                image_url=image_url or "/images/headphones.jpg",
                stock=int(data.get("stock", 10))
            )
        else:
            product.title = title
            product.category = category
            product.price = price_val
            product.description = description
            if image_url:
                product.image_url = image_url
            if data.get("stock") is not None:
                try:
                    product.stock = max(0, int(data.get("stock")))
                except (ValueError, TypeError):
                    pass
            product.save()

        return Response(product.to_dict())


@api_view(['PUT'])
def update_admin_product_stock(request, product_id):
    if not require_admin(request):
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    data = request.data or {}
    stock = data.get("stock")
    if stock is None:
        return Response({"detail": "Stock value is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        stock_val = int(stock)
        if stock_val < 0:
            raise ValueError()
    except (TypeError, ValueError):
        return Response({"detail": "Stock must be a non-negative integer"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        product = Product.objects.get(id=product_id)
        product.stock = stock_val
        product.save()
    except Product.DoesNotExist:
        product = Product.objects.create(
            id=product_id,
            title=data.get("title") or f"Product #{product_id}",
            category="Electronics",
            price=99.99,
            description="Catalog product",
            stock=stock_val
        )

    return Response(product.to_dict())


@api_view(['GET', 'POST'])
def admin_promos(request):
    if not require_admin(request):
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'GET':
        promos = PromoCode.objects.all()
        return Response([p.to_dict() for p in promos])

    elif request.method == 'POST':
        data = request.data or {}
        code = (data.get("code") or "").strip().upper()
        discount_type = (data.get("discount_type") or "percent").strip()
        discount_value = data.get("discount_value")

        if not code or discount_value is None:
            return Response({"detail": "Promo code and discount value are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            val = float(discount_value)
            if val < 0:
                raise ValueError()
        except (TypeError, ValueError):
            return Response({"detail": "Discount value must be a non-negative number"}, status=status.HTTP_400_BAD_REQUEST)

        if PromoCode.objects.filter(code=code).exists():
            return Response({"detail": f"Promo code '{code}' already exists"}, status=status.HTTP_400_BAD_REQUEST)

        promo = PromoCode.objects.create(code=code, discount_type=discount_type, discount_value=val, active=True)
        return Response(promo.to_dict(), status=status.HTTP_201_CREATED)


@api_view(['PUT'])
def toggle_admin_promo(request, code):
    if not require_admin(request):
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        promo = PromoCode.objects.get(code=code)
    except PromoCode.DoesNotExist:
        return Response({"detail": "Promo code not found"}, status=status.HTTP_404_NOT_FOUND)

    promo.active = not promo.active
    promo.save()
    return Response(promo.to_dict())
