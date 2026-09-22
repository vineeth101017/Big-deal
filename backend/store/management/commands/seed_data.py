import hashlib
from django.core.management.base import BaseCommand
from store.models import Product, ProductImage, Review, PromoCode, AdminUser

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

class Command(BaseCommand):
    help = 'Seed database with default catalog products, images, reviews, promo codes, and admin user'

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")

        # 1. Products
        if Product.objects.count() == 0:
            products_data = [
                ("Premium Wireless Headphones", "Electronics", 199.99, "Professional-grade wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality.", "/images/headphones.jpg", 15),
                ("Ergonomic Office Chair", "Furniture", 349.99, "High-back ergonomic chair with lumbar support, adjustable armrests, and premium mesh for all-day comfort.", "/images/chair.jpg", 3),
                ("Premium Luggage Set", "Travel", 249.99, "Lightweight 3-piece luggage set with TSA locks, 360-degree spinner wheels, and durable polycarbonate shell.", "/images/luggage.jpg", 5),
                ("Smart Fitness Watch", "Electronics", 299.99, "Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and 7-day battery life.", "/images/watch.jpg", 2),
                ("Minimalist Desk Lamp", "Furniture", 89.99, "Adjustable LED desk lamp with touch control, USB charging port, and sleek modern design.", "/images/lamp.jpg", 10),
                ("Travel Pillow Pro", "Travel", 45.99, "Ergonomic memory foam travel pillow with cooling gel and washable cover for comfortable journeys.", "/images/pillow.jpg", 0),
                ("Mechanical Gaming Keyboard", "Electronics", 149.99, "A high-performance mechanical keyboard with custom switches, hot-swappable keys, and dynamic RGB backlighting.", "/images/keyboard.jpg", 8),
            ]

            images_map = {
                "Premium Wireless Headphones": [
                    "/images/headphones.jpg",
                    "/images/headphones.jpg",
                    "/images/headphones.jpg",
                ],
                "Ergonomic Office Chair": [
                    "/images/chair.jpg",
                    "/images/chair.jpg",
                    "/images/chair.jpg",
                ],
                "Premium Luggage Set": [
                    "/images/luggage.jpg",
                    "/images/luggage.jpg",
                    "/images/luggage.jpg",
                ],
                "Smart Fitness Watch": [
                    "/images/watch.jpg",
                    "/images/watch.jpg",
                    "/images/watch.jpg",
                ],
                "Minimalist Desk Lamp": [
                    "/images/lamp.jpg",
                    "/images/lamp.jpg",
                    "/images/lamp.jpg",
                ],
                "Travel Pillow Pro": [
                    "/images/pillow.jpg",
                    "/images/pillow.jpg",
                    "/images/pillow.jpg",
                ],
                "Mechanical Gaming Keyboard": [
                    "/images/keyboard.jpg",
                    "/images/keyboard.jpg",
                    "/images/keyboard.jpg",
                ],
            }

            for title, category, price, desc, img_url, stock in products_data:
                prod = Product.objects.create(
                    title=title,
                    category=category,
                    price=price,
                    description=desc,
                    image_url=img_url,
                    stock=stock
                )
                if title in images_map:
                    for idx, img_path in enumerate(images_map[title]):
                        ProductImage.objects.create(
                            product=prod,
                            image_url=img_path,
                            is_primary=(idx == 0),
                            sort_order=idx
                        )
            self.stdout.write(self.style.SUCCESS("Products seeded successfully."))
        else:
            self.stdout.write("Products table already has data.")

        # 2. Reviews
        if Review.objects.count() == 0:
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

            for prod in Product.objects.all():
                if prod.title in reviews_map:
                    for username, rating, comment in reviews_map[prod.title]:
                        Review.objects.create(
                            product=prod,
                            username=username,
                            rating=rating,
                            comment=comment
                        )
            self.stdout.write(self.style.SUCCESS("Reviews seeded successfully."))
        else:
            self.stdout.write("Reviews table already has data.")

        # 3. Promo Codes
        if PromoCode.objects.count() == 0:
            PromoCode.objects.create(code="WELCOME10", discount_type="percent", discount_value=10.0, active=True)
            PromoCode.objects.create(code="BIGDEAL50", discount_type="fixed", discount_value=50.0, active=True)
            self.stdout.write(self.style.SUCCESS("Promo codes seeded successfully."))
        else:
            self.stdout.write("Promo codes already exist.")

        # 4. Admin User
        if AdminUser.objects.count() == 0:
            AdminUser.objects.create(username="admin", password_hash=hash_password("admin123"))
            self.stdout.write(self.style.SUCCESS("Admin account (admin / admin123) seeded."))
        else:
            self.stdout.write("Admin account already exists.")

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
