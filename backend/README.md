# Big Deal Backend

This folder contains the Flask-based API for the Big Deal e-commerce experience.

## Run locally

1. Install Python 3.10+
2. Create and activate a virtual environment
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start the API:

```bash
python app.py
```

The backend will run at:
- http://127.0.0.1:8000/api/health

## Main routes
- GET /api/health
- GET /api/products
- POST /api/auth/register
- POST /api/auth/login
- POST /api/checkout
- POST /api/admin/login
- POST /api/admin/products
