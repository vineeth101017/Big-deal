import 'package:flutter/foundation.dart';
import 'product.dart';
import 'cart_service.dart';

class WishlistService extends ChangeNotifier {
  WishlistService._privateConstructor();

  static final WishlistService instance =
      WishlistService._privateConstructor();

  final List<Product> _items = [];

  List<Product> get items => List.unmodifiable(_items);

  int get itemCount => _items.length;

  bool isWishlisted(int productId) {
    return _items.any((item) => item.id == productId);
  }

  bool isFavorite(int productId) => isWishlisted(productId);

  void toggleWishlist(Product product) {
    final index = _items.indexWhere((item) => item.id == product.id);
    if (index >= 0) {
      _items.removeAt(index);
    } else {
      _items.add(product);
    }
    notifyListeners();
  }

  void toggleFavorite(Product product) => toggleWishlist(product);

  void addToWishlist(Product product) {
    if (!isWishlisted(product.id)) {
      _items.add(product);
      notifyListeners();
    }
  }

  void removeFromWishlist(int productId) {
    _items.removeWhere((item) => item.id == productId);
    notifyListeners();
  }

  void moveToCart(Product product) {
    CartService.instance.addToCart(product);
    removeFromWishlist(product.id);
  }

  void clearWishlist() {
    _items.clear();
    notifyListeners();
  }
}
