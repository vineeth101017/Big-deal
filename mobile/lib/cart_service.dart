import 'package:flutter/foundation.dart';
import 'product.dart';

class CartItem {
  final Product product;
  int quantity;

  CartItem({
    required this.product,
    this.quantity = 1,
  });

  double get total {
    return product.price * quantity;
  }
}

class CartService extends ChangeNotifier {
  CartService._privateConstructor();

  static final CartService instance =
      CartService._privateConstructor();

  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);

  int get itemCount {
    int count = 0;

    for (final item in _items) {
      count += item.quantity;
    }

    return count;
  }

  double get total {
    double amount = 0;

    for (final item in _items) {
      amount += item.total;
    }

    return amount;
  }

  void addToCart(Product product) {
    final index = _items.indexWhere(
      (item) => item.product.id == product.id,
    );

    if (index >= 0) {
      _items[index].quantity++;
    } else {
      _items.add(
        CartItem(product: product),
      );
    }

    notifyListeners();
  }

  void increaseQuantity(Product product) {
    final index = _items.indexWhere(
      (item) => item.product.id == product.id,
    );

    if (index >= 0) {
      _items[index].quantity++;
      notifyListeners();
    }
  }

  void decreaseQuantity(Product product) {
    final index = _items.indexWhere(
      (item) => item.product.id == product.id,
    );

    if (index >= 0) {
      if (_items[index].quantity > 1) {
        _items[index].quantity--;
      } else {
        _items.removeAt(index);
      }

      notifyListeners();
    }
  }

  void removeFromCart(Product product) {
    _items.removeWhere(
      (item) => item.product.id == product.id,
    );

    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
  }

  void clear() => clearCart();

  // Helper aliases
  void addItem(Product product) => addToCart(product);

  void incrementQuantity(dynamic productOrId) {
    if (productOrId is Product) {
      increaseQuantity(productOrId);
    } else if (productOrId is int) {
      final item = _items.firstWhere((i) => i.product.id == productOrId);
      increaseQuantity(item.product);
    }
  }

  void decrementQuantity(dynamic productOrId) {
    if (productOrId is Product) {
      decreaseQuantity(productOrId);
    } else if (productOrId is int) {
      final item = _items.firstWhere((i) => i.product.id == productOrId);
      decreaseQuantity(item.product);
    }
  }

  void removeItem(dynamic productOrId) {
    if (productOrId is Product) {
      removeFromCart(productOrId);
    } else if (productOrId is int) {
      _items.removeWhere((i) => i.product.id == productOrId);
      notifyListeners();
    }
  }
}