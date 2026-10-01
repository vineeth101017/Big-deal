import 'dart:convert';
import 'package:http/http.dart' as http;

import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb, kReleaseMode;

class ApiService {
  // SMART SWITCH:
  // - Debug Mode (when testing on your PC): Uses Local PC (Your 9 MySQL orders)
  // - Release Mode (when installed on mobile phone): Uses Live Render Cloud (Works 24/7 anywhere)
  static String get baseUrl {
    if (kReleaseMode) {
      return 'https://big-deal-gslk.onrender.com'; // Live Render Cloud
    }
    
    // Local Development
    if (kIsWeb) return 'http://127.0.0.1:8000';
    if (Platform.isAndroid) return 'http://10.0.2.2:8000'; // PC Android Emulator
    return 'http://192.168.1.13:8000'; // Local Wi-Fi
  }

  // =========================
  // GET PRODUCTS
  // =========================

  static Future<List<dynamic>> getProducts() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/products'),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception(
        'Failed to load products: ${response.statusCode}',
      );
    }
  }

  // =========================
  // PRODUCT IMAGE URL
  // =========================

  // Mapping for seeded product images to reliable CDN URLs
  static const Map<String, String> _seededImageMap = {
    'headphones.jpg': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    'chair.jpg': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80',
    'chair': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80',
    'luggage.jpg': 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=600&q=80',
    'watch.jpg': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    'lamp.jpg': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    'pillow.jpg': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    'keyboard.jpg': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    'boot': 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c1cd2adb939240108c3dba9f5dbbed02_9366/Predator_Club_Firm_Ground-Multi_Ground_Football_Boots_Blue_JS0348_22_model.jpg',
    'addidas boot': 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c1cd2adb939240108c3dba9f5dbbed02_9366/Predator_Club_Firm_Ground-Multi_Ground_Football_Boots_Blue_JS0348_22_model.jpg',
  };

  static String getImageUrl(String imagePath) {
    if (imagePath.isEmpty) {
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
    }

    // If given a Nykaa Man webpage link, resolve to direct football boots image
    if (imagePath.contains('nykaaman.com') || imagePath.contains('20883793') || imagePath.toLowerCase().contains('predator-elite')) {
      return 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Check if filename matches one of our standard seeded product photos
    final filename = imagePath.split('/').last.toLowerCase();
    if (_seededImageMap.containsKey(filename)) {
      return _seededImageMap[filename]!;
    }

    return '$baseUrl$imagePath';
  }

  // =========================
  // CHECKOUT
  // =========================

  static Future<Map<String, dynamic>> checkout({
    required List<Map<String, dynamic>> items,
    required String customerName,
    required String customerEmail,
    required String customerPhone,
    required String address,
    required String city,
    required String pincode,
    String promoCode = '',
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/checkout'),

      headers: {
        'Content-Type': 'application/json',
      },

      body: jsonEncode({
        'items': items,
        'customer_name': customerName,
        'customer_email': customerEmail,
        'customer_phone': customerPhone,
        'address': address,
        'city': city,
        'pincode': pincode,
        'promo_code': promoCode,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return Map<String, dynamic>.from(data);
    }

    throw Exception(
      data['detail'] ?? 'Checkout failed',
    );
  }

  // =========================
  // GET ORDERS
  // =========================

  static Future<List<dynamic>> getOrders([String? email]) async {
    final targetEmail = email?.trim() ?? '';

    // 1. Try user orders endpoint if email is present
    if (targetEmail.isNotEmpty) {
      try {
        final response = await http.get(
          Uri.parse('$baseUrl/api/users/orders?email=${Uri.encodeComponent(targetEmail)}'),
        );
        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          return List<dynamic>.from(data);
        }
      } catch (_) {}
    }

    // 2. Try general /api/orders
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/orders'),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<dynamic>.from(data);
      }
    } catch (_) {}

    // 3. Fallback to /api/users/orders or return empty list
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/users/orders'),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<dynamic>.from(data);
      }
    } catch (_) {}

    return [];
  }

  // =========================
  // ADMIN ORDERS
  // =========================

  static Future<List<dynamic>> getAdminOrders(
    String adminToken,
  ) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/admin/orders'),
      headers: {
        'Authorization': 'Bearer $adminToken',
      },
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return List<dynamic>.from(data);
    }

    throw Exception(
      data['detail'] ?? 'Failed to load admin orders',
    );
  }

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  static Future<Map<String, dynamic>> updateOrderStatus({
    required int orderId,
    required String status,
    required String adminToken,
  }) async {
    final response = await http.put(
      Uri.parse(
        '$baseUrl/api/admin/orders/$orderId/status',
      ),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $adminToken',
      },
      body: jsonEncode({
        'status': status,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return Map<String, dynamic>.from(data);
    }

    throw Exception(
      data['detail'] ?? 'Failed to update order status',
    );
  }

  // =========================
  // GET CATEGORIES
  // =========================

  static Future<List<String>> getCategories() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/categories'),
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((e) => e.toString()).toList();
    }
    return ['Electronics', 'Furniture', 'Travel'];
  }

  // =========================
  // CREATE PRODUCT
  // =========================

  static Future<Map<String, dynamic>> createProduct({
    required String title,
    required String category,
    required double price,
    required int stock,
    required String description,
    required String imageUrl,
    required String adminToken,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/admin/products'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $adminToken',
      },
      body: jsonEncode({
        'title': title,
        'category': category,
        'price': price,
        'stock': stock,
        'description': description,
        'image_url': imageUrl,
      }),
    );

    try {
      final data = jsonDecode(response.body);
      if (response.statusCode == 201 || response.statusCode == 200) {
        return Map<String, dynamic>.from(data);
      }
      throw Exception(data['detail'] ?? data['message'] ?? 'Failed to create product (${response.statusCode})');
    } catch (e) {
      if (e is Exception && !e.toString().contains('FormatException')) rethrow;
      throw Exception('Server returned ${response.statusCode}: ${response.body}');
    }
  }

  // =========================
  // UPDATE PRODUCT
  // =========================

  static Future<Map<String, dynamic>> updateProduct({
    required int productId,
    required String title,
    required String category,
    required double price,
    required int stock,
    required String description,
    required String imageUrl,
    required String adminToken,
  }) async {
    final response = await http.put(
      Uri.parse('$baseUrl/api/admin/products/$productId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $adminToken',
      },
      body: jsonEncode({
        'title': title,
        'category': category,
        'price': price,
        'stock': stock,
        'description': description,
        'image_url': imageUrl,
      }),
    );

    try {
      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return Map<String, dynamic>.from(data);
      }
      throw Exception(data['detail'] ?? data['message'] ?? 'Failed to update product (${response.statusCode})');
    } catch (e) {
      if (e is Exception && !e.toString().contains('FormatException')) rethrow;
      throw Exception('Server returned ${response.statusCode}: ${response.body}');
    }
  }

  // =========================
  // DELETE PRODUCT
  // =========================

  static Future<void> deleteProduct({
    required int productId,
    required String adminToken,
  }) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/api/admin/products/$productId'),
      headers: {
        'Authorization': 'Bearer $adminToken',
      },
    );

    if (response.statusCode != 200) {
      final data = jsonDecode(response.body);
      throw Exception(data['detail'] ?? 'Failed to delete product');
    }
  }

  // =========================
  // PROMO CODES
  // =========================

  static Future<Map<String, dynamic>> validatePromoCode({
    required String code,
    required double subtotal,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/promos/validate'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'code': code,
        'subtotal': subtotal,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return Map<String, dynamic>.from(data);
    }
    throw Exception(data['detail'] ?? 'Invalid promo code');
  }

  static Future<List<dynamic>> getAdminPromos(String adminToken) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/admin/promos'),
      headers: {'Authorization': 'Bearer $adminToken'},
    );

    if (response.statusCode == 200) {
      return List<dynamic>.from(jsonDecode(response.body));
    }
    throw Exception('Failed to load promo codes');
  }

  static Future<Map<String, dynamic>> createAdminPromo({
    required String code,
    required String discountType,
    required double discountValue,
    required bool active,
    required String adminToken,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/admin/promos'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $adminToken',
      },
      body: jsonEncode({
        'code': code,
        'discount_type': discountType,
        'discount_value': discountValue,
        'active': active,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 201 || response.statusCode == 200) {
      return Map<String, dynamic>.from(data);
    }
    throw Exception(data['detail'] ?? 'Failed to save promo code');
  }

  static Future<void> deleteAdminPromo({
    required String code,
    required String adminToken,
  }) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/api/admin/promos/$code'),
      headers: {'Authorization': 'Bearer $adminToken'},
    );

    if (response.statusCode != 200) {
      final data = jsonDecode(response.body);
      throw Exception(data['detail'] ?? 'Failed to delete promo code');
    }
  }

  // =========================
  // REVIEWS & RATINGS
  // =========================

  static Future<List<dynamic>> getProductReviews(int productId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/products/$productId/reviews'),
    );

    if (response.statusCode == 200) {
      return List<dynamic>.from(jsonDecode(response.body));
    }
    return [];
  }

  static Future<Map<String, dynamic>> submitProductReview({
    required int productId,
    required String username,
    required int rating,
    required String comment,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/products/$productId/reviews'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'rating': rating,
        'comment': comment,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 || response.statusCode == 201) {
      return Map<String, dynamic>.from(data);
    }
    throw Exception(data['detail'] ?? 'Failed to submit review');
  }

  // =========================
  // USER AUTHENTICATION
  // =========================

  static Future<Map<String, dynamic>> loginUser({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return Map<String, dynamic>.from(data);
    }
    throw Exception(data['detail'] ?? 'Login failed. Check email or password.');
  }

  static Future<Map<String, dynamic>> registerUser({
    required String name,
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 || response.statusCode == 201) {
      return Map<String, dynamic>.from(data);
    }
    throw Exception(data['detail'] ?? 'Registration failed. Try again.');
  }

  // =========================
  // USER ORDERS
  // =========================

  static Future<List<dynamic>> getUserOrders(String email) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/users/orders?email=${Uri.encodeComponent(email)}'),
    );

    if (response.statusCode == 200) {
      return List<dynamic>.from(jsonDecode(response.body));
    }
    throw Exception('Failed to load user orders');
  }
}