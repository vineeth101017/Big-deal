# 🛒 Big Deal — Full-Stack E-Commerce Platform

**Big Deal** is a full-stack e-commerce platform designed to provide a complete online shopping experience. Users can browse products, search and filter products, manage their cart and wishlist, place orders, write reviews, and track their purchases.

The project includes a **web application and Flutter mobile application**, connected to a Python-based backend and MySQL database.

---

## ✨ Features

* 🛍️ **Product browsing** — Browse products with images, prices, descriptions, ratings, and stock information
* 🔎 **Product search** — Search products quickly and easily
* 🗂️ **Product categories** — Browse products by category
* 🛒 **Shopping cart** — Add, remove, and update product quantities
* ❤️ **Wishlist** — Save products for later
* ⭐ **Reviews & ratings** — Customers can review and rate products
* 📦 **Order management** — Place and manage customer orders
* 🚚 **Order tracking** — Track order and delivery status
* 📊 **Stock management** — Automatically manage product stock and availability
* 👤 **User authentication** — Registration and login system
* 🛠️ **Admin dashboard** — Manage products, users, orders, and other store data
* 📱 **Mobile application** — Flutter-based Android application
* 💰 **Google AdMob** — Advertisement integration in the mobile application
* 🔐 **Environment configuration** — Sensitive configuration managed using environment variables

---

## 🛠️ Tech Stack

| **Layer**       | **Technology**          |
| --------------- | ----------------------- |
| Backend         | Python + Flask          |
| Database        | MySQL                   |
| ORM             | SQLAlchemy              |
| API             | REST API                |
| Web Frontend    | HTML / CSS / JavaScript |
| Mobile App      | Flutter + Dart          |
| Authentication  | User authentication     |
| Advertisements  | Google AdMob            |
| API Testing     | Postman                 |
| Version Control | Git + GitHub            |
| Development     | Visual Studio Code      |

---

## 📂 Project Structure

```text
Big-deal/
├── backend/              ← Python backend and REST API
│   ├── bigdeal_backend/
│   ├── store/
│   ├── tests/
│   ├── app.py
│   ├── models.py
│   ├── main.py
│   └── manage.py
│
├── frontend/             ← Web application
│
├── mobile/               ← Flutter mobile application
│   ├── android/
│   ├── lib/
│   ├── test/
│   └── pubspec.yaml
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Python 3.10+
* Flutter
* Dart
* MySQL
* Git
* VS Code
* Android Studio / Android SDK (for mobile development)

---

## 📥 Clone the Repository

```bash
git clone https://github.com/vineeth101017/Big-deal.git
cd Big-deal
```

---

## ⚙️ Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Configure your `.env` file with the required database and application settings.

Start the backend server:

```bash
python manage.py runserver
```

The API can then be accessed through the configured local server.

---

## 📱 Mobile App Setup

Open a new terminal and go to the mobile application:

```bash
cd mobile
```

Install Flutter dependencies:

```bash
flutter pub get
```

Check connected devices:

```bash
flutter devices
```

Run the application:

```bash
flutter run
```

---

## 🔄 Application Flow

```text
User
  ↓
Login / Register
  ↓
Browse Products
  ↓
Search / Categories
  ↓
View Product
  ↓
Add to Cart / Wishlist
  ↓
Checkout
  ↓
Order Created
  ↓
Order Processing
  ↓
Delivery
  ↓
Order Delivered
```

---

## 🗺️ Future Improvements

* 🔔 Push notifications
* 💳 Online payment integration
* 📍 Live delivery tracking
* 🤖 AI-based product recommendations
* 📊 Advanced sales analytics
* 🎁 Discount and coupon system
* 🌐 Deployment to production
* 📱 Google Play Store release

---

## 👨‍💻 Developer

**Vineeth M**

GitHub: https://github.com/vineeth101017

Big Deal Repository: https://github.com/vineeth101017/Big-deal

---

## 📄 License

This project is developed for learning and portfolio purposes.

---

⭐ **If you find this project useful, consider giving it a star!**
