import 'package:flutter/material.dart';
import 'api_service.dart';
import 'cart_service.dart';
import 'order_history_page.dart';
import 'auth_service.dart';
import 'saved_addresses_page.dart';

class CheckoutPage extends StatefulWidget {
  const CheckoutPage({super.key});

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  final _formKey = GlobalKey<FormState>();

  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController();
  final addressController = TextEditingController();
  final cityController = TextEditingController();
  final pincodeController = TextEditingController();
  final promoController = TextEditingController();

  bool isPlacingOrder = false;
  bool isValidatingPromo = false;
  String? appliedPromoCode;
  double discountAmount = 0.0;
  String? promoSuccessMessage;
  String? promoErrorMessage;
  String? _selectedAddressId;

  @override
  void initState() {
    super.initState();
    final auth = AuthService.instance;
    if (auth.isLoggedIn) {
      nameController.text = auth.userName;
      emailController.text = auth.userEmail;
    }
    final def = auth.defaultAddress;
    if (def != null) {
      _applyAddress(def);
    }
  }

  void _applyAddress(AddressModel addr) {
    setState(() {
      _selectedAddressId = addr.id;
      if (addr.fullName.isNotEmpty) nameController.text = addr.fullName;
      if (addr.phone.isNotEmpty) phoneController.text = addr.phone;
      addressController.text = addr.address;
      cityController.text = addr.city;
      pincodeController.text = addr.pincode;
    });
  }

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    addressController.dispose();
    cityController.dispose();
    pincodeController.dispose();
    promoController.dispose();
    super.dispose();
  }

  Future<void> applyPromoCode() async {
    final code = promoController.text.trim().toUpperCase();
    if (code.isEmpty) return;

    final cart = CartService.instance;
    setState(() {
      isValidatingPromo = true;
      promoErrorMessage = null;
      promoSuccessMessage = null;
    });

    try {
      final res = await ApiService.validatePromoCode(
        code: code,
        subtotal: cart.total,
      );

      setState(() {
        isValidatingPromo = false;
        appliedPromoCode = res['code'];
        discountAmount = double.tryParse(res['discount_amount'].toString()) ?? 0.0;
        promoSuccessMessage =
            'Coupon "$appliedPromoCode" applied! You save ₹${discountAmount.toStringAsFixed(2)}';
        promoErrorMessage = null;
      });
    } catch (e) {
      setState(() {
        isValidatingPromo = false;
        appliedPromoCode = null;
        discountAmount = 0.0;
        promoErrorMessage = e.toString().replaceFirst('Exception: ', '');
        promoSuccessMessage = null;
      });
    }
  }

  void removePromoCode() {
    setState(() {
      appliedPromoCode = null;
      discountAmount = 0.0;
      promoSuccessMessage = null;
      promoErrorMessage = null;
      promoController.clear();
    });
  }

  Future<void> placeOrder() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final cart = CartService.instance;

    if (cart.items.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Your cart is empty'),
        ),
      );
      return;
    }

    setState(() {
      isPlacingOrder = true;
    });

    try {
      final items = cart.items.map((item) {
        return {
          'id': item.product.id,
          'title': item.product.title,
          'quantity': item.quantity,
          'price': item.product.price,
        };
      }).toList();

      final result = await ApiService.checkout(
        items: items,
        customerName: nameController.text.trim(),
        customerEmail: emailController.text.trim(),
        customerPhone: phoneController.text.trim(),
        address: addressController.text.trim(),
        city: cityController.text.trim(),
        pincode: pincodeController.text.trim(),
        promoCode: appliedPromoCode ?? '',
      );

      if (!mounted) return;

      final orderId = result['order_id'];
      final total = result['total'];

      cart.clearCart();

      setState(() {
        isPlacingOrder = false;
      });

      bool goToOrders = false;

      await showDialog(
        context: context,
        barrierDismissible: false,
        builder: (dialogContext) {
          return AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: const Row(
              children: [
                Icon(
                  Icons.check_circle,
                  color: Colors.green,
                  size: 28,
                ),
                SizedBox(width: 10),
                Text('Order Placed!'),
              ],
            ),
            content: Text(
              'Your order has been placed successfully.\n\n'
              'Order ID: #$orderId\n'
              'Total: ₹${double.parse(total.toString()).toStringAsFixed(2)}',
              style: const TextStyle(fontSize: 15),
            ),
            actions: [
              TextButton(
                onPressed: () {
                  goToOrders = false;
                  Navigator.pop(dialogContext);
                },
                child: const Text('Continue Shopping'),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo,
                  foregroundColor: Colors.white,
                ),
                onPressed: () {
                  goToOrders = true;
                  Navigator.pop(dialogContext);
                },
                child: const Text('Track Order'),
              ),
            ],
          );
        },
      );

      if (!mounted) return;

      if (goToOrders) {
        Navigator.pop(context);
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const OrderHistoryPage(),
          ),
        );
      } else {
        Navigator.popUntil(
          context,
          (route) => route.isFirst,
        );
      }
    } catch (e) {
      if (!mounted) return;

      setState(() {
        isPlacingOrder = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Order failed: ${e.toString().replaceFirst('Exception: ', '')}',
          ),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = CartService.instance;
    final subtotal = cart.total;
    final finalTotal = (subtotal - discountAmount) > 0 ? (subtotal - discountAmount) : 0.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Checkout',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Delivery Details',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton.icon(
                  onPressed: () async {
                    final selected = await Navigator.push<AddressModel>(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const SavedAddressesPage(selectMode: true),
                      ),
                    );
                    if (selected != null) {
                      _applyAddress(selected);
                    }
                  },
                  icon: const Icon(Icons.bookmarks_outlined, size: 16),
                  label: const Text('Address Book', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Quick Saved Addresses Chips
            if (AuthService.instance.addresses.isNotEmpty) ...[
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: AuthService.instance.addresses.map((addr) {
                    final isSelected = _selectedAddressId == addr.id;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        avatar: Icon(
                          addr.label == 'Office'
                              ? Icons.business
                              : addr.label == 'Home'
                                  ? Icons.home
                                  : Icons.location_on,
                          size: 16,
                          color: isSelected ? Colors.white : const Color(0xFF4F46E5),
                        ),
                        label: Text('${addr.label}: ${addr.city}'),
                        selected: isSelected,
                        selectedColor: const Color(0xFF4F46E5),
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : const Color(0xFF1E293B),
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                        ),
                        onSelected: (val) {
                          if (val) _applyAddress(addr);
                        },
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 14),
            ],

            // NAME
            TextFormField(
              controller: nameController,
              decoration: const InputDecoration(
                labelText: 'Full Name',
                prefixIcon: Icon(Icons.person_outline),
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter your name';
                }
                return null;
              },
            ),
            const SizedBox(height: 14),

            // EMAIL
            TextFormField(
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Email',
                prefixIcon: Icon(Icons.email_outlined),
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter your email';
                }
                if (!value.contains('@')) {
                  return 'Enter a valid email';
                }
                return null;
              },
            ),
            const SizedBox(height: 14),

            // PHONE
            TextFormField(
              controller: phoneController,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: 'Phone Number',
                prefixIcon: Icon(Icons.phone_outlined),
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter your phone number';
                }
                if (value.trim().length < 10) {
                  return 'Enter a valid phone number';
                }
                return null;
              },
            ),
            const SizedBox(height: 14),

            // ADDRESS
            TextFormField(
              controller: addressController,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Address',
                prefixIcon: Icon(Icons.home_outlined),
                border: OutlineInputBorder(),
                alignLabelWithHint: true,
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter your address';
                }
                return null;
              },
            ),
            const SizedBox(height: 14),

            // CITY
            TextFormField(
              controller: cityController,
              decoration: const InputDecoration(
                labelText: 'City',
                prefixIcon: Icon(Icons.location_city_outlined),
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter your city';
                }
                return null;
              },
            ),
            const SizedBox(height: 14),

            // PIN CODE
            TextFormField(
              controller: pincodeController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'PIN Code',
                prefixIcon: Icon(Icons.pin_drop_outlined),
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter your PIN code';
                }
                if (value.trim().length != 6) {
                  return 'Enter a valid 6-digit PIN code';
                }
                return null;
              },
            ),

            const SizedBox(height: 24),

            // PROMO CODE SECTION
            const Text(
              'Coupons & Discounts',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),

            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: promoController,
                    textCapitalization: TextCapitalization.characters,
                    enabled: appliedPromoCode == null,
                    decoration: InputDecoration(
                      hintText: 'e.g. WELCOME10, BIGDEAL50',
                      prefixIcon: const Icon(Icons.local_offer_outlined),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                if (appliedPromoCode == null)
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6366F1),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                    ),
                    onPressed: isValidatingPromo ? null : applyPromoCode,
                    child: isValidatingPromo
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : const Text('Apply'),
                  )
                else
                  IconButton(
                    icon: const Icon(Icons.cancel, color: Colors.redAccent, size: 28),
                    onPressed: removePromoCode,
                  ),
              ],
            ),

            if (promoSuccessMessage != null) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.green.shade200),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle, color: Colors.green, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        promoSuccessMessage!,
                        style: TextStyle(color: Colors.green.shade800, fontWeight: FontWeight.w600, fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            if (promoErrorMessage != null) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline, color: Colors.redAccent, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        promoErrorMessage!,
                        style: const TextStyle(color: Colors.redAccent, fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 28),

            // ORDER SUMMARY
            const Text(
              'Order Summary',
              style: TextStyle(
                fontSize: 21,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),

            ...cart.items.map(
              (item) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          '${item.product.title} × ${item.quantity}',
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        '₹${item.total.toStringAsFixed(2)}',
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                );
              },
            ),

            const Divider(height: 30),

            // SUBTOTAL
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Subtotal', style: TextStyle(fontSize: 16, color: Colors.grey)),
                Text('₹${subtotal.toStringAsFixed(2)}',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              ],
            ),

            if (discountAmount > 0) ...[
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Discount ($appliedPromoCode)',
                      style: const TextStyle(fontSize: 15, color: Colors.green, fontWeight: FontWeight.w600)),
                  Text('-₹${discountAmount.toStringAsFixed(2)}',
                      style: const TextStyle(fontSize: 15, color: Colors.green, fontWeight: FontWeight.bold)),
                ],
              ),
            ],

            const SizedBox(height: 10),

            // TOTAL
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Total',
                  style: TextStyle(
                    fontSize: 21,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  '₹${finalTotal.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 25),

            // PLACE ORDER
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: isPlacingOrder ? null : placeOrder,
                icon: isPlacingOrder
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Icon(Icons.shopping_bag_outlined),
                label: Text(
                  isPlacingOrder ? 'Placing Order...' : 'Place Order',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}