import os
import hashlib
import secrets
from datetime import datetime
from dotenv import load_dotenv

from flask import Flask, jsonify, request
from flask_cors import CORS

# Load .env file
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path) if os.path.exists(env_path) else load_dotenv()

import socket

app = Flask(__name__)
CORS(app)

# Resilient Database Connection Configuration
database_url = os.getenv("DATABASE_URL")
sqlite_fallback_path = os.path.join(os.path.dirname(__file__), 'shop.db')

if database_url:
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    print(f"Connecting to production DATABASE_URL")
else:
    db_user = os.getenv("DB_USER", "root")
    db_pass = os.getenv("DB_PASSWORD", "")
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = int(os.getenv("DB_PORT", "3306"))
    db_name = os.getenv("DB_NAME", "big_deal")
    
    # Check if MySQL server is reachable
    mysql_online = False
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1.5)
        res = sock.connect_ex((db_host, db_port))
        sock.close()
        mysql_online = (res == 0)
    except Exception:
        mysql_online = False

    if mysql_online:
        print(f"MySQL reachable on {db_host}:{db_port}. Connecting to MySQL...")
        app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"
    else:
        print(f"MySQL not detected on {db_host}:{db_port}. Falling back to SQLite database ({sqlite_fallback_path})")
        app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{sqlite_fallback_path}"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

try:
    from models import db, Product, ProductImage, Order, OrderItem, User, AdminUser, Review, PromoCode, WishlistItem
except ImportError:
    from backend.models import db, Product, ProductImage, Order, OrderItem, User, AdminUser, Review, PromoCode, WishlistItem
db.init_app(app)

issued_admin_tokens = set()


def require_admin() -> bool:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return False
    token = auth_header.split(" ", 1)[1]
    return token in issued_admin_tokens


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def init_db():
    with app.app_context():
        # Creates all MySQL tables if they do not exist
        db.create_all()
        
        # Seed products if table is empty or seed missing products
        all_initial_products = [
            (1, "Premium Wireless Headphones", "Electronics", 199.99, "Professional-grade wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality.", "/images/headphones.jpg", 15, [
                "/images/headphones.jpg", "/images/headphones.jpg", "/images/headphones.jpg"
            ]),
            (2, "Ergonomic Office Chair", "Furniture", 349.99, "High-back ergonomic chair with lumbar support, adjustable armrests, and premium mesh for all-day comfort.", "/images/chair.jpg", 3, [
                "/images/chair.jpg", "/images/chair.jpg", "/images/chair.jpg"
            ]),
            (3, "Premium Luggage Set", "Travel", 249.99, "Lightweight 3-piece luggage set with TSA locks, 360-degree spinner wheels, and durable polycarbonate shell.", "/images/luggage.jpg", 5, [
                "/images/luggage.jpg", "/images/luggage.jpg", "/images/luggage.jpg"
            ]),
            (4, "Smart Fitness Watch", "Electronics", 299.99, "Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and 7-day battery life.", "/images/watch.jpg", 2, [
                "/images/watch.jpg", "/images/watch.jpg", "/images/watch.jpg"
            ]),
            (5, "Minimalist Desk Lamp", "Furniture", 89.99, "Adjustable LED desk lamp with touch control, USB charging port, and sleek modern design.", "/images/lamp.jpg", 10, [
                "/images/lamp.jpg", "/images/lamp.jpg", "/images/lamp.jpg"
            ]),
            (6, "Travel Pillow Pro", "Travel", 45.99, "Ergonomic memory foam travel pillow with cooling gel and washable cover for comfortable journeys.", "/images/pillow.jpg", 0, [
                "/images/pillow.jpg", "/images/pillow.jpg", "/images/pillow.jpg"
            ]),
            (7, "Mechanical Gaming Keyboard", "Electronics", 149.99, "A high-performance mechanical keyboard with custom switches, hot-swappable keys, and dynamic RGB backlighting.", "/images/keyboard.jpg", 8, [
                "/images/keyboard.jpg", "/images/keyboard.jpg", "/images/keyboard.jpg"
            ]),
            (101, "AeroPulse Chrono Precision Analog Watch", "Electronics", 499.0, "Water-resistant stainless steel luxury timepiece with date window and scratch-proof sapphire crystal glass.", "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80", 12, [
                "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80"
            ]),
            (102, "Nordic Ceramic Indoor Planter & Gold Metal Stand Set", "Furniture", 799.0, "Handcrafted minimalist ceramic pots with corrosion-resistant tier metal stand. Perfect for living rooms, balconies and office desks.", "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80", 8, [
                "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
            ]),
            (103, "TurboClean Pro Handheld Cordless Vacuum Cleaner", "Electronics", 2199.0, "High-suction 12000Pa motor with HEPA filtration, multi-surface attachments, and rechargeable fast-charge battery.", "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80", 5, [
                "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80"
            ]),
            (104, "100% Egyptian Cotton Luxury King Size Bedsheet", "Furniture", 489.0, "Breathable 400 thread count ultra-soft cotton bedsheet. Fade resistant, hypoallergenic, and machine washable.", "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80", 24, [
                "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80"
            ]),
            (105, "Heavy-Duty Multi-Tool Wire Stripper & Crimper Pliers", "Electronics", 1489.0, "Precision engineered chrome vanadium steel tool with ergonomic non-slip grip for electrical repairs.", "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=600&q=80", 15, [
                "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=600&q=80"
            ]),
            (106, "Handcrafted Italian Leather Formal Derby Shoes", "Travel", 3389.0, "Premium full-grain genuine leather with cushioned insole and anti-skid rubber sole for all-day elegance.", "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80", 9, [
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
            ]),
            (107, "JBL Wireless PartyBox RGB Bluetooth Speaker", "Electronics", 3499.0, "100W massive sound with deep bass boost, dynamic light sync show, and IPX4 splashproof rating.", "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80", 6, [
                "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80"
            ]),
            (108, "Echo Dot (5th Gen) Smart Speaker with Alexa", "Electronics", 2999.0, "Deeper bass, clearer vocals, and smart home voice automation with motion detection and temperature sensor.", "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=600&q=80", 18, [
                "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=600&q=80"
            ]),
            (109, "Truly Wireless Active Noise Cancelling Earbuds", "Electronics", 1899.0, "40dB hybrid ANC, quad-mic ENC for crystal-clear calls, 36 hours total battery, and fast USB-C charge.", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80", 14, [
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"
            ]),
            (110, "3-Piece Tri-Ply Stainless Steel Cookware Set with Glass Lids", "Furniture", 1299.0, "Induction and gas compatible cookware with aluminum core for even heat distribution and stay-cool handles.", "https://images.unsplash.com/photo-1584990347449-397a6f235b2e?auto=format&fit=crop&w=600&q=80", 11, [
                "https://images.unsplash.com/photo-1584990347449-397a6f235b2e?auto=format&fit=crop&w=600&q=80"
            ]),
            (111, "Windproof Thermal Winter Puffer Jacket", "Travel", 499.0, "Ultralight water-repellent jacket with insulated fleece lining and dual zip secure pockets for extreme cold weather.", "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80", 15, [
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
            ]),
            (112, "Designer Vegan Leather Everyday Shoulder Tote Bag", "Travel", 489.0, "Spacious multi-compartment shoulder tote with gold-tone hardware and water-resistant nylon lining.", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80", 20, [
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
            ]),
            (113, "Nordic Wooden Ambient Warm Bedside Table Lamp", "Furniture", 399.0, "Minimalist solid wood base bedside desk lamp with textured fabric drum shade and 3-way touch dimmer control.", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80", 18, [
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
            ]),
            (114, "Breathable Quick-Dry Athletic Sports Jersey", "Travel", 299.0, "Athletic moisture-wicking stretch fabric shirt engineered for gym workouts, running, cycling, and sports.", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80", 35, [
                "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80"
            ]),
            (115, "Organic Vitamin C Radiant Glow Anti-Aging Face Serum", "Travel", 349.0, "20% Vitamin C concentrated serum with Hyaluronic Acid and Ferulic Acid for radiant glow, dark spot reduction, and skin hydration.", "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", 22, [
                "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
            ]),
            (116, "Fast Charging Braided 100W USB-C Cable (2m)", "Electronics", 199.0, "100W Power Delivery nylon braided fast charge & 480Mbps data transfer cable compatible with phones, laptops, and tablets.", "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80", 50, [
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80"
            ]),
            (117, "Luxury Velvet Matte Lipstick & Eye Shadow Palette Set", "Travel", 449.0, "12 vibrant blendable eye shadows with waterproof nude matte lipstick for daily elegance and glamorous evenings.", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80", 25, [
                "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80"
            ]),
        ]

        for p_id, title, category, price, desc, img_url, stock, gallery in all_initial_products:
            existing = db.session.get(Product, p_id) or Product.query.filter_by(title=title).first()
            if not existing:
                prod = Product(id=p_id, title=title, category=category, price=price, description=desc, image_url=img_url, stock=stock)
                db.session.add(prod)
                db.session.flush()
                for idx, extra_url in enumerate(gallery):
                    if extra_url:
                        img = ProductImage(product_id=prod.id, image_url=extra_url, is_primary=(idx == 0), sort_order=idx)
                        db.session.add(img)
        db.session.commit()
        print("Catalog products synchronized.")
            
        # Seed reviews if empty
        if Review.query.count() == 0:
            print("Seeding MySQL database with default reviews...")
            reviews_map = {
                "Premium Wireless Headphones": [
                    ("Sarah Jenkins", 5, "Unbelievable noise cancellation! Battery lasts all week for my commutes."),
                    ("Michael Chen", 4, "Sound quality is outstanding. The earcups get slightly warm after hours of use, but very comfortable overall.")
                ],
                "Ergonomic Office Chair": [
                    ("Emily Taylor", 5, "My back pain is completely gone! Extremely adjustable and worth every penny."),
                    ("James Wilson", 4, "Solid chair. Assembly took about 20 minutes. Material feels very premium.")
                ],
                "Premium Luggage Set": [
                    ("David K.", 5, "Survived three international flights already without a scratch. Spinners are butter-smooth.")
                ],
                "Smart Fitness Watch": [
                    ("Amanda R.", 4, "Great fitness tracking and sleep analysis. Battery lasts almost 8 days! Heart rate monitoring is spot on.")
                ],
                "Minimalist Desk Lamp": [
                    ("Robert L.", 5, "Minimalist design looks perfect on my oak desk. The touch dimming is super responsive.")
                ],
                "Travel Pillow Pro": [
                    ("Jessica M.", 3, "Decent support, but a bit too bulky for my travel bag. Gel feels nice and cool though.")
                ],
                "Mechanical Gaming Keyboard": [
                    ("Alex Rivera", 5, "Tactile feedback is perfect. RGB effects are highly customizable and look amazing!"),
                    ("Liam P.", 4, "Great build quality. Keycaps feel very premium. Highly recommend.")
                ]
            }
            
            for prod in Product.query.all():
                if prod.title in reviews_map:
                    for username, rating, comment in reviews_map[prod.title]:
                        rev = Review(product_id=prod.id, username=username, rating=rating, comment=comment)
                        db.session.add(rev)
            db.session.commit()
            print("Review seeding complete.")

        # Seed promo codes if empty
        if PromoCode.query.count() == 0:
            print("Seeding MySQL database with promo codes...")
            promos = [
                PromoCode(code="WELCOME10", discount_type="percent", discount_value=10.0, active=True),
                PromoCode(code="BIGDEAL50", discount_type="fixed", discount_value=50.0, active=True)
            ]
            for p in promos:
                db.session.add(p)
            db.session.commit()
            print("Promo codes seeding complete.")
            
        if AdminUser.query.count() == 0:
            print("Seeding admin account credentials...")
            admin = AdminUser(username="admin", password_hash=hash_password("admin123"))
            db.session.add(admin)
            db.session.commit()
            print("Admin credentials seeded.")


# Run database setup initially
try:
    init_db()
except Exception as e:
    print(f"Initial database setup warning: {e}. Tables might need drop/recreate.")


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "message": "Big Deal e-commerce API is running"})


@app.post("/api/auth/register")
def register_user():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    password = (payload.get("password") or "").strip()

    if not name or not email or not password:
        return jsonify({"detail": "Name, email, and password are required"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"detail": "User already exists"}), 400

    user = User(name=name, email=email, password_hash=hash_password(password))
    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True, "user": user.to_dict()})


@app.post("/api/auth/login")
def login_user():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = (payload.get("password") or "").strip()

    if not email or not password:
        return jsonify({"detail": "Email and password are required"}), 400

    user = User.query.filter_by(email=email, password_hash=hash_password(password)).first()
    if not user:
        return jsonify({"detail": "Invalid credentials"}), 401

    token = secrets.token_urlsafe(16)
    return jsonify({"success": True, "token": token, "user": user.to_dict()})


@app.post("/api/admin/login")
def admin_login():
    payload = request.get_json(silent=True) or {}
    username = (payload.get("username") or "").strip()
    password = (payload.get("password") or "").strip()

    if not username or not password:
        return jsonify({"detail": "Username and password are required"}), 400

    admin = AdminUser.query.filter_by(username=username).first()
    is_valid = False

    if admin:
        hashed = hash_password(password)
        if admin.password_hash == hashed or admin.password_hash == password:
            is_valid = True
    elif username.lower() == "admin" and password == "admin123":
        # Auto seed default admin credentials into MySQL if not present
        try:
            admin = AdminUser(username="admin", password_hash=hash_password("admin123"))
            db.session.add(admin)
            db.session.commit()
        except Exception:
            db.session.rollback()
        is_valid = True

    if not is_valid:
        return jsonify({"detail": "Invalid admin credentials"}), 401

    token = secrets.token_urlsafe(16)
    issued_admin_tokens.add(token)
    return jsonify({"success": True, "token": token})



@app.get("/api/admin/verify")
def verify_admin():
    if require_admin():
        return jsonify({"valid": True})
    return jsonify({"valid": False, "detail": "Unauthorized"}), 401


@app.post("/api/admin/products")
@app.post("/api/products")
def create_admin_product():
    if not require_admin():
        return jsonify({"detail": "Admin authorization required to add products. Please log in as Admin."}), 401
    return handle_create_product()


def handle_create_product():
    payload = request.get_json(silent=True) or {}
    title = (payload.get("title") or "").strip()
    category = (payload.get("category") or "").strip()
    price = payload.get("price")
    description = (payload.get("description") or "").strip()

    if not title or not category or price is None or not description:
        return jsonify({"detail": "Title, category, price, and description are required"}), 400

    try:
        price_val = float(price)
    except (ValueError, TypeError):
        return jsonify({"detail": "Price must be a valid number"}), 400

    img_url = (payload.get("image_url") or "").strip()
    if not img_url:
        img_url = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"

    stock_val = 10
    if payload.get("stock") is not None:
        try:
            stock_val = max(0, int(payload.get("stock")))
        except (ValueError, TypeError):
            stock_val = 10

    product = Product(
        title=title,
        category=category,
        price=price_val,
        description=description,
        image_url=img_url,
        stock=stock_val
    )
    db.session.add(product)
    db.session.flush()

    # Support extra images gallery
    extra_images = payload.get("images") or [img_url]
    if isinstance(extra_images, list):
        for idx, extra_url in enumerate(extra_images):
            if extra_url and isinstance(extra_url, str) and extra_url.strip():
                p_img = ProductImage(product_id=product.id, image_url=extra_url.strip(), is_primary=(idx == 0), sort_order=idx)
                db.session.add(p_img)

    db.session.commit()
    return jsonify(product.to_dict()), 201


@app.delete("/api/admin/products/<int:product_id>")
@app.delete("/api/products/<int:product_id>")
def delete_admin_product(product_id):
    if not require_admin():
        return jsonify({"detail": "Admin authorization required to delete products."}), 401
    product = db.session.get(Product, product_id)
    if product:
        db.session.delete(product)
        db.session.commit()
    return jsonify({"success": True, "message": f"Product {product_id} deleted successfully"})


@app.get("/api/products/<int:product_id>")
def get_single_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"detail": "Product not found"}), 404
    return jsonify(product.to_dict())




@app.get("/api/products")
def get_products():
    products = Product.query.order_by(Product.id).all()
    return jsonify([p.to_dict() for p in products])


@app.get("/api/products/search")
def search_products():
    query = (request.args.get("q") or "").strip().lower()
    category = (request.args.get("category") or "").strip().lower()
    min_price = request.args.get("min_price", type=float, default=0)
    max_price = request.args.get("max_price", type=float, default=float('inf'))

    all_products = Product.query.order_by(Product.price).all()
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
            
    return jsonify(results)


@app.get("/api/categories")
def get_categories():
    categories_rows = db.session.query(Product.category).distinct().order_by(Product.category).all()
    categories = [row[0] for row in categories_rows]
    return jsonify(categories)


@app.get("/api/price-range")
def get_price_range():
    from sqlalchemy import func
    min_price = db.session.query(func.min(Product.price)).scalar() or 0
    max_price = db.session.query(func.max(Product.price)).scalar() or 999
    return jsonify({
        "min_price": min_price,
        "max_price": max_price
    })


@app.post("/api/checkout")
def checkout():
    payload = request.get_json(silent=True) or {}
    items = payload.get("items", [])
    if not items:
        return jsonify({"detail": "Cart is empty"}), 400

    # 1. Enforce stock validation first
    products_to_update = []
    for item in items:
        pid = item.get("id")
        qty = item.get("quantity", 0)
        if qty <= 0:
            return jsonify({"detail": f"Invalid quantity for item ID {pid}"}), 400
            
        prod = db.session.get(Product, pid)
        if not prod:
            return jsonify({"detail": f"Product with ID {pid} not found"}), 404
            
        if prod.stock < qty:
            return jsonify({"detail": f"Not enough stock for '{prod.title}'. Only {prod.stock} units left."}), 400
            
        products_to_update.append((prod, qty))

    # Calculate initial subtotal
    subtotal = sum(item.get("quantity", 0) * item.get("price", 0) for item in items)
    
    # 2. Server-side Promo validation
    promo_code = (payload.get("promo_code") or "").strip().upper()
    discount_amount = 0.0
    if promo_code:
        promo = PromoCode.query.filter_by(code=promo_code, active=True).first()
        if promo:
            if promo.discount_type == "percent":
                discount_amount = round(subtotal * (promo.discount_value / 100.0), 2)
            else:
                discount_amount = round(min(promo.discount_value, subtotal), 2)
        else:
            return jsonify({"detail": f"Promo code '{promo_code}' is invalid or expired."}), 400

    total = round(max(0.0, subtotal - discount_amount), 2)

    order = Order(
        customer_name=payload.get("customer_name", ""),
        customer_email=payload.get("customer_email", ""),
        total=total,
        promo_code=promo_code if promo_code else None,
        discount_amount=discount_amount
    )
    db.session.add(order)
    db.session.flush()  # Populate order.id

    for item in items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.get("id"),
            title=item.get("title"),
            quantity=item.get("quantity", 0),
            price=item.get("price", 0)
        )
        db.session.add(order_item)

    # 3. Deduct stock inventory
    for prod, qty in products_to_update:
        prod.stock -= qty
    
    db.session.commit()
    return jsonify({
        "success": True, 
        "order_id": order.id, 
        "total": total, 
        "discount_amount": discount_amount,
        "message": "Order placed successfully"
    })


@app.get("/api/users/orders")
def get_user_orders():
    email = request.args.get("email", "").strip().lower()
    if not email:
        return jsonify({"detail": "Email is required"}), 400
        
    orders = Order.query.filter(Order.customer_email.ilike(email)).order_by(Order.id.desc()).all()
    return jsonify([o.to_dict() for o in orders])


@app.get("/api/admin/orders")
def get_admin_orders():
    if not require_admin():
        return jsonify({"detail": "Unauthorized"}), 401
    orders = Order.query.order_by(Order.id.desc()).all()
    return jsonify([o.to_dict() for o in orders])


@app.put("/api/admin/orders/<int:order_id>")
def update_admin_order_status(order_id):
    if not require_admin():
        return jsonify({"detail": "Unauthorized"}), 401
    order = db.session.get(Order, order_id)
    if not order:
        return jsonify({"detail": "Order not found"}), 404
    payload = request.get_json(silent=True) or {}
    status = (payload.get("status") or "").strip()
    if not status:
        return jsonify({"detail": "Status is required"}), 400
    order.status = status
    db.session.commit()
    return jsonify({"success": True, "order": order.to_dict()})


@app.get("/api/admin/users")
def get_admin_users():
    if not require_admin():
        return jsonify({"detail": "Unauthorized"}), 401
    users = User.query.order_by(User.id.desc()).all()
    return jsonify([u.to_dict() for u in users])


@app.get("/api/admin/promos")
def get_admin_promos():
    if not require_admin():
        return jsonify({"detail": "Unauthorized"}), 401
    promos = PromoCode.query.all()
    return jsonify([p.to_dict() for p in promos])


@app.post("/api/admin/promos")
def create_admin_promo():
    if not require_admin():
        return jsonify({"detail": "Unauthorized"}), 401
    payload = request.get_json(silent=True) or {}
    code = (payload.get("code") or "").strip().upper()
    discount_type = (payload.get("discount_type") or "percent").strip().lower()
    discount_value = payload.get("discount_value")
    active = payload.get("active", True)

    if not code or discount_value is None:
        return jsonify({"detail": "Promo code and discount value are required"}), 400

    try:
        val = float(discount_value)
    except (ValueError, TypeError):
        return jsonify({"detail": "Discount value must be a valid number"}), 400

    existing = PromoCode.query.filter_by(code=code).first()
    if existing:
        existing.discount_type = discount_type
        existing.discount_value = val
        existing.active = active
        db.session.commit()
        return jsonify({"success": True, "promo": existing.to_dict()})

    new_promo = PromoCode(code=code, discount_type=discount_type, discount_value=val, active=active)
    db.session.add(new_promo)
    db.session.commit()
    return jsonify({"success": True, "promo": new_promo.to_dict()}), 201


@app.delete("/api/admin/promos/<code>")
def delete_admin_promo(code):
    if not require_admin():
        return jsonify({"detail": "Unauthorized"}), 401
    promo = PromoCode.query.filter_by(code=code.upper()).first()
    if not promo:
        return jsonify({"detail": "Promo code not found"}), 404
    db.session.delete(promo)
    db.session.commit()
    return jsonify({"success": True, "message": f"Promo code {code} deleted"})


@app.get("/api/admin/stats")
def get_admin_stats():
    if not require_admin():
        return jsonify({"detail": "Unauthorized"}), 401
    
    total_products = Product.query.count()
    low_stock_count = Product.query.filter(Product.stock <= 3).count()
    total_orders = Order.query.count()
    from sqlalchemy import func
    gross_revenue = db.session.query(func.sum(Order.total)).scalar() or 0.0
    total_users = User.query.count()
    active_promos = PromoCode.query.filter_by(active=True).count()

    return jsonify({
        "total_products": total_products,
        "low_stock_count": low_stock_count,
        "total_orders": total_orders,
        "gross_revenue": round(gross_revenue, 2),
        "total_users": total_users,
        "active_promos": active_promos
    })


@app.post("/api/admin/resolve-image")
def resolve_image_url():
    payload = request.get_json(silent=True) or {}
    url = (payload.get("url") or "").strip()
    if not url:
        return jsonify({"detail": "URL is required"}), 400

    import re, urllib.request

    # 1. Amazon ASIN matching
    asin_match = re.search(r'/(?:dp|gp/product|ASIN)/([A-Z0-9]{10})', url, re.IGNORECASE)
    if asin_match:
        asin = asin_match.group(1).upper()
        return jsonify({
            "success": True,
            "image_url": f"https://m.media-amazon.com/images/P/{asin}.01._SCLZZZZZZZ_SX500_.jpg",
            "type": "amazon_asin",
            "asin": asin
        })

    # 2. General Webpage OpenGraph Scraping
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        )
        with urllib.request.urlopen(req, timeout=4) as response:
            html = response.read().decode("utf-8", errors="ignore")
            og_match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE) or \
                       re.search(r'<meta\s+content=["\']([^"\']+)["\']\s+property=["\']og:image["\']', html, re.IGNORECASE)
            if og_match:
                return jsonify({"success": True, "image_url": og_match.group(1), "type": "opengraph"})
                
            tw_match = re.search(r'<meta\s+name=["\']twitter:image["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE) or \
                       re.search(r'<meta\s+content=["\']([^"\']+)["\']\s+name=["\']twitter:image["\']', html, re.IGNORECASE)
            if tw_match:
                return jsonify({"success": True, "image_url": tw_match.group(1), "type": "twitter"})
    except Exception:
        pass

    return jsonify({"success": False, "detail": "Could not auto-extract image from link"}), 404


@app.post("/api/promo/apply")


def apply_promo():
    payload = request.get_json(silent=True) or {}
    code = (payload.get("code") or "").strip().upper()
    cart_total = payload.get("cart_total", 0.0)
    
    promo = PromoCode.query.filter_by(code=code, active=True).first()
    if not promo:
        return jsonify({"detail": "Invalid or expired promo code"}), 400
        
    if promo.discount_type == "percent":
        discount = round(cart_total * (promo.discount_value / 100.0), 2)
    else:
        discount = round(min(promo.discount_value, cart_total), 2)
        
    new_total = round(max(0.0, cart_total - discount), 2)
    return jsonify({
        "success": True,
        "code": promo.code,
        "discount_type": promo.discount_type,
        "discount_value": promo.discount_value,
        "discount_amount": discount,
        "new_total": new_total
    })


@app.get("/api/products/<int:product_id>/reviews")
def get_product_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).order_by(Review.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviews])


@app.post("/api/products/<int:product_id>/reviews")
def create_product_review(product_id):
    payload = request.get_json(silent=True) or {}
    username = (payload.get("username") or "").strip()
    rating = payload.get("rating")
    comment = (payload.get("comment") or "").strip()
    
    if not username:
        username = "Anonymous"
        
    if rating is None:
        return jsonify({"detail": "Rating is required"}), 400
        
    try:
        rating_val = int(rating)
        if rating_val < 1 or rating_val > 5:
            raise ValueError()
    except ValueError:
        return jsonify({"detail": "Rating must be an integer between 1 and 5"}), 400
        
    if not comment:
        return jsonify({"detail": "Comment is required"}), 400
        
    product = db.session.get(Product, product_id)
    if not product:
        product = Product(
            id=product_id,
            title=f"Product #{product_id}",
            category="Electronics",
            price=99.99,
            description="Catalog product",
            image_url="/images/headphones.jpg",
            stock=10
        )
        db.session.add(product)
        db.session.flush()

    review = Review(
        product_id=product.id,
        username=username,
        rating=rating_val,
        comment=comment
    )
    db.session.add(review)
    db.session.commit()
    
    return jsonify(review.to_dict()), 201


@app.put("/api/admin/products/<int:product_id>/stock")
def update_admin_product_stock(product_id):
    if not require_admin():
        return jsonify({"detail": "Unauthorized"}), 401
        
    payload = request.get_json(silent=True) or {}
    stock = payload.get("stock")
    if stock is None:
        return jsonify({"detail": "Stock value is required"}), 400
        
    try:
        stock_val = int(stock)
        if stock_val < 0:
            raise ValueError()
    except ValueError:
        return jsonify({"detail": "Stock must be a non-negative integer"}), 400

    product = db.session.get(Product, product_id)
    if not product:
        product = Product(
            id=product_id,
            title=payload.get("title") or f"Product #{product_id}",
            category="Electronics",
            price=99.99,
            description="Catalog product",
            image_url="/images/headphones.jpg",
            stock=stock_val
        )
        db.session.add(product)
    else:
        product.stock = stock_val

    db.session.commit()
    return jsonify(product.to_dict())


@app.get("/api/users/wishlist")
def get_user_wishlist():
    email = request.args.get("email", "").strip().lower()
    if not email:
        return jsonify({"detail": "Email is required"}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"detail": "User not found"}), 404
    items = WishlistItem.query.filter_by(user_id=user.id).all()
    return jsonify([item.product.to_dict() for item in items if item.product])


@app.post("/api/users/wishlist")
def add_to_user_wishlist():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    product_id = payload.get("product_id")
    if not email or not product_id:
        return jsonify({"detail": "Email and product_id are required"}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"detail": "User not found"}), 404
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"detail": "Product not found"}), 404
    
    existing = WishlistItem.query.filter_by(user_id=user.id, product_id=product_id).first()
    if existing:
        return jsonify({"success": True, "message": "Product already in wishlist"})
        
    item = WishlistItem(user_id=user.id, product_id=product_id)
    db.session.add(item)
    db.session.commit()
    return jsonify({"success": True, "message": "Product added to wishlist"})


@app.delete("/api/users/wishlist")
def remove_from_user_wishlist():
    email = request.args.get("email", "").strip().lower()
    product_id = request.args.get("product_id", type=int)
    if not email or not product_id:
        return jsonify({"detail": "Email and product_id are required"}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"detail": "User not found"}), 404
    
    item = WishlistItem.query.filter_by(user_id=user.id, product_id=product_id).first()
    if item:
        db.session.delete(item)
        db.session.commit()
        
    return jsonify({"success": True, "message": "Product removed from wishlist"})


@app.put("/api/admin/products/<int:product_id>")
@app.put("/api/products/<int:product_id>")
def edit_admin_product(product_id):
    if not require_admin():
        return jsonify({"detail": "Admin authorization required to modify products."}), 401
        
    payload = request.get_json(silent=True) or {}
    title = (payload.get("title") or "").strip()
    category = (payload.get("category") or "").strip()
    price = payload.get("price")
    description = (payload.get("description") or "").strip()
    image_url = (payload.get("image_url") or "").strip()
    
    if not title or not category or price is None or not description:
        return jsonify({"detail": "Title, category, price, and description are required"}), 400
        
    try:
        price_val = float(price)
        if price_val < 0:
            raise ValueError()
    except (ValueError, TypeError):
        return jsonify({"detail": "Price must be a non-negative number"}), 400

    stock_val = 10
    if payload.get("stock") is not None:
        try:
            stock_val = max(0, int(payload.get("stock")))
        except (ValueError, TypeError):
            stock_val = 10
        
    product = db.session.get(Product, product_id)
    if not product:
        # Upsert: Create product if it doesn't exist yet in the database
        product = Product(
            id=product_id,
            title=title,
            category=category,
            price=price_val,
            description=description,
            image_url=image_url or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
            stock=stock_val
        )
        db.session.add(product)
        db.session.flush()
    else:
        product.title = title
        product.category = category
        product.price = price_val
        product.description = description
        if image_url:
            product.image_url = image_url
        product.stock = stock_val

    if "images" in payload and isinstance(payload.get("images"), list):
        ProductImage.query.filter_by(product_id=product.id).delete()
        for idx, extra_url in enumerate(payload.get("images")):
            if extra_url and isinstance(extra_url, str) and extra_url.strip():
                p_img = ProductImage(product_id=product.id, image_url=extra_url.strip(), is_primary=(idx == 0), sort_order=idx)
                db.session.add(p_img)
        
    db.session.commit()
    return jsonify(product.to_dict())




@app.get("/api/pincode/check/<pincode>")
def check_pincode_serviceability(pincode):
    pin = (pincode or "").strip()
    if not pin.isdigit() or len(pin) != 6:
        return jsonify({
            "serviceable": False,
            "detail": "Please enter a valid 6-digit Indian postal PIN code."
        }), 400

    known_cities = {
        "600053": {"city": "Chennai", "state": "Tamil Nadu", "tier": 1, "same_day": True, "hub": "Amazon Chennai South FC"},
        "600001": {"city": "Chennai", "state": "Tamil Nadu", "tier": 1, "same_day": True, "hub": "Amazon Chennai Central FC"},
        "110001": {"city": "New Delhi", "state": "Delhi", "tier": 1, "same_day": True, "hub": "Delhi Okhla Prime Hub"},
        "110020": {"city": "New Delhi", "state": "Delhi", "tier": 1, "same_day": True, "hub": "Delhi Okhla Prime Hub"},
        "400001": {"city": "Mumbai", "state": "Maharashtra", "tier": 1, "same_day": True, "hub": "Bhiwandi Mega Logistics FC"},
        "400050": {"city": "Mumbai Bandra", "state": "Maharashtra", "tier": 1, "same_day": True, "hub": "Bhiwandi Mega Logistics FC"},
        "560001": {"city": "Bengaluru", "state": "Karnataka", "tier": 1, "same_day": True, "hub": "Hosur Road Tech Fulfillment"},
        "560034": {"city": "Bengaluru Koramangala", "state": "Karnataka", "tier": 1, "same_day": True, "hub": "Hosur Road Tech Fulfillment"},
        "500081": {"city": "Hyderabad HITEC City", "state": "Telangana", "tier": 1, "same_day": True, "hub": "Shamshabad Air Cargo FC"},
        "700001": {"city": "Kolkata", "state": "West Bengal", "tier": 1, "same_day": True, "hub": "Dankuni Logistics Center"},
        "411001": {"city": "Pune", "state": "Maharashtra", "tier": 1, "same_day": True, "hub": "Chakan Industrial Logistics Hub"},
        "380001": {"city": "Ahmedabad", "state": "Gujarat", "tier": 2, "same_day": False, "hub": "Sanand Hub"},
        "682001": {"city": "Kochi", "state": "Kerala", "tier": 2, "same_day": False, "hub": "Kalamassery Regional Hub"},
        "302001": {"city": "Jaipur", "state": "Rajasthan", "tier": 2, "same_day": False, "hub": "Jaipur Express FC"},
    }

    info = known_cities.get(pin, {
        "city": f"Region {pin[:3]}xxx",
        "state": "India",
        "tier": 2,
        "same_day": False,
        "hub": "Regional E-Commerce Express FC"
    })

    return jsonify({
        "serviceable": True,
        "pincode": pin,
        "city": info["city"],
        "state": info["state"],
        "tier": info["tier"],
        "cod_available": True,
        "same_day_eligible": info["same_day"],
        "estimated_days": 1 if info["same_day"] else 2,
        "courier_partner": "BlueDart Express Prime" if info["same_day"] else "Delhivery Surface Express",
        "fulfillment_hub": info["hub"],
        "free_delivery_threshold": 499,
        "message": f"Serviceable at {info['city']}, {info['state']}"
    })


@app.get("/api/products/<int:product_id>/price-history")
def get_product_price_history(product_id):
    product = db.session.get(Product, product_id)
    base_price = product.price if product else 499.0

    # Deterministic price curve generation for 90 days
    import time
    now_ts = int(time.time())
    day_sec = 86400

    history_points = []
    multipliers = [1.25, 1.20, 1.22, 1.15, 1.18, 1.10, 1.12, 1.05, 1.08, 0.95, 1.00, 1.02, 0.98, 1.00]
    
    for i, mult in enumerate(multipliers):
        days_ago = (len(multipliers) - 1 - i) * 7
        point_time = now_ts - (days_ago * day_sec)
        date_str = datetime.fromtimestamp(point_time).strftime("%b %d")
        pt_price = round(base_price * mult, 2)
        history_points.append({
            "date": date_str,
            "days_ago": days_ago,
            "price": pt_price,
            "mrp": round(pt_price * 1.35, 2)
        })

    prices = [p["price"] for p in history_points]
    all_time_low = min(prices)
    all_time_high = max(prices)
    avg_price = round(sum(prices) / len(prices), 2)
    current_price = base_price
    discount_from_high = round(((all_time_high - current_price) / all_time_high) * 100, 1)

    return jsonify({
        "product_id": product_id,
        "current_price": current_price,
        "all_time_low": all_time_low,
        "all_time_high": all_time_high,
        "average_price": avg_price,
        "discount_from_high_pct": max(0.0, discount_from_high),
        "is_at_lowest": current_price <= all_time_low * 1.05,
        "price_history": history_points
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

