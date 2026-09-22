import os
import secrets
import sqlite3
from typing import List, Set

from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DB_PATH = os.path.join(os.path.dirname(__file__), "shop.db")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

app = FastAPI(title="Big Deal API", version="1.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

issued_admin_tokens: Set[str] = set()


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    with get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                description TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT NOT NULL,
                customer_email TEXT NOT NULL,
                total REAL NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL
            );
            """
        )

        existing_count = conn.execute("SELECT COUNT(*) FROM products").fetchone()[0]
        if existing_count == 0:
            conn.executemany(
                "INSERT INTO products (title, category, price, description) VALUES (?, ?, ?, ?)",
                [
                    (
                        "Summer Tech Bundle",
                        "Electronics",
                        249.0,
                        "A curated bundle of wireless headphones, earbuds, and a power bank for everyday shopping.",
                    ),
                    (
                        "Home Office Refresh",
                        "Furniture",
                        399.0,
                        "Upgrade your workspace with a compact desk, ergonomic chair, and smart lamp for modern living.",
                    ),
                    (
                        "Weekend Getaway Pack",
                        "Travel",
                        179.0,
                        "Pack light with a luggage set, travel pillow, and waterproof organizer for your next trip.",
                    ),
                    (
                        "Wellness Starter Kit",
                        "Health",
                        129.0,
                        "A calm, restorative bundle with aromatherapy, a journal, and a soft blanket.",
                    ),
                ],
            )


@app.on_event("startup")
def startup_event():
    init_db()


class CheckoutItem(BaseModel):
    id: int
    title: str
    quantity: int
    price: float


class CheckoutRequest(BaseModel):
    customer_name: str
    customer_email: str
    items: List[CheckoutItem]


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminProductCreateRequest(BaseModel):
    title: str
    category: str
    price: float
    description: str


def require_admin(authorization: str | None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")

    token = authorization.split(" ", 1)[1]
    if token not in issued_admin_tokens:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return token


@app.get("/api/health")
def health():
    return {"status": "ok", "message": "Big Deal e-commerce API is running"}


@app.get("/api/products")
def get_products():
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, title, category, price, description FROM products ORDER BY id"
        ).fetchall()
        return [dict(row) for row in rows]


@app.get("/api/products/{product_id}")
def get_product(product_id: int):
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, title, category, price, description FROM products WHERE id = ?",
            (product_id,),
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Product not found")
        return dict(row)


@app.post("/api/checkout")
def create_checkout(payload: CheckoutRequest):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = round(sum(item.quantity * item.price for item in payload.items), 2)

    with get_connection() as conn:
        order_cursor = conn.execute(
            "INSERT INTO orders (customer_name, customer_email, total) VALUES (?, ?, ?)",
            (payload.customer_name, payload.customer_email, total),
        )
        order_id = order_cursor.lastrowid
        conn.executemany(
            "INSERT INTO order_items (order_id, product_id, title, quantity, price) VALUES (?, ?, ?, ?, ?)",
            [
                (order_id, item.id, item.title, item.quantity, item.price)
                for item in payload.items
            ],
        )

    return {
        "success": True,
        "order_id": order_id,
        "total": total,
        "message": "Order placed successfully",
    }


@app.post("/api/admin/login")
def admin_login(payload: AdminLoginRequest):
    if payload.username != ADMIN_USERNAME or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    token = secrets.token_urlsafe(16)
    issued_admin_tokens.add(token)
    return {"token": token}


@app.get("/api/admin/products")
def admin_list_products(authorization: str | None = Header(default=None)):
    require_admin(authorization)

    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, title, category, price, description FROM products ORDER BY id"
        ).fetchall()
        return [dict(row) for row in rows]


@app.post("/api/admin/products")
def admin_create_product(payload: AdminProductCreateRequest, authorization: str | None = Header(default=None)):
    require_admin(authorization)

    with get_connection() as conn:
        cursor = conn.execute(
            "INSERT INTO products (title, category, price, description) VALUES (?, ?, ?, ?)",
            (payload.title, payload.category, payload.price, payload.description),
        )
        product_id = cursor.lastrowid
        row = conn.execute(
            "SELECT id, title, category, price, description FROM products WHERE id = ?",
            (product_id,),
        ).fetchone()
        return dict(row)
