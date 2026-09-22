import os
import sys

# Add the current directory to python path to allow importing app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app import app, db, init_db
except ImportError as e:
    print(f"Error: Could not import app modules. Details: {e}")
    sys.exit(1)

if __name__ == "__main__":
    print("Initializing MySQL Database for Big Deal...")
    
    with app.app_context():
        try:
            # Drop all tables first for a clean recreate
            db.drop_all()
            print("Dropped all existing tables in MySQL big_deal schema.")
        except Exception as e:
            print(f"Warning: Could not drop tables ({e}). Database will be initialized on top.")
            
    try:
        init_db()
        print("Database tables successfully created and seeded with products in MySQL Workbench!")
    except Exception as e:
        print(f"Error initializing database: {e}")
        sys.exit(1)
