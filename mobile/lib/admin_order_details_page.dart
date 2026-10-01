import 'package:flutter/material.dart';

import 'api_service.dart';

class AdminOrderDetailsPage extends StatefulWidget {
  final Map<String, dynamic> order;
  final String adminToken;

  const AdminOrderDetailsPage({
    super.key,
    required this.order,
    required this.adminToken,
  });

  @override
  State<AdminOrderDetailsPage> createState() =>
      _AdminOrderDetailsPageState();
}

class _AdminOrderDetailsPageState
    extends State<AdminOrderDetailsPage> {
  final List<String> statuses = [
    'Placed',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  late String currentStatus;
  late Map<String, dynamic> order;

  bool isUpdating = false;

  @override
  void initState() {
    super.initState();

    order = Map<String, dynamic>.from(widget.order);

    currentStatus = order['status'] ?? 'Placed';

    if (!statuses.contains(currentStatus)) {
      currentStatus = 'Placed';
    }
  }

  Future<void> updateStatus(String newStatus) async {
    if (newStatus == currentStatus) {
      return;
    }

    setState(() {
      isUpdating = true;
    });

    try {
      final orderId = int.parse(
        order['id'].toString(),
      );

      final result =
          await ApiService.updateOrderStatus(
        orderId: orderId,
        status: newStatus,
        adminToken: widget.adminToken,
      );

      final updatedOrder =
          result['order'];

      if (updatedOrder != null) {
        order = Map<String, dynamic>.from(
          updatedOrder,
        );
      }

      setState(() {
        currentStatus = newStatus;
      });

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Order #${order['id']} updated to $newStatus',
          ),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Failed to update status: '
            '${e.toString().replaceFirst('Exception: ', '')}',
          ),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          isUpdating = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final orderId = order['id'] ?? 0;

    final customerName =
        order['customer_name'] ?? '-';

    final email =
        order['customer_email'] ?? '-';

    final phone =
        order['customer_phone'] ?? '-';

    final address =
        order['address'] ?? '-';

    final city =
        order['city'] ?? '-';

    final pincode =
        order['pincode'] ?? '-';

    final total =
        double.tryParse(
              order['total'].toString(),
            ) ??
            0.0;

    final discount =
        double.tryParse(
              order['discount_amount']
                  .toString(),
            ) ??
            0.0;

    final promoCode =
        order['promo_code'] ?? '';

    final createdAt =
        order['created_at'] ?? '';

    final items =
        (order['items'] as List?) ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Order #$orderId',
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildStatusCard(),

          const SizedBox(height: 16),

          _buildCustomerCard(
            customerName: customerName,
            email: email,
            phone: phone,
          ),

          const SizedBox(height: 16),

          _buildAddressCard(
            address: address,
            city: city,
            pincode: pincode,
          ),

          const SizedBox(height: 16),

          _buildItemsCard(items),

          const SizedBox(height: 16),

          _buildPaymentCard(
            total: total,
            discount: discount,
            promoCode: promoCode,
          ),

          if (createdAt.toString().isNotEmpty) ...[
            const SizedBox(height: 16),
            _buildDateCard(createdAt),
          ],

          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Widget _buildStatusCard() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment:
              CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.local_shipping_outlined,
                  color: _statusColor(currentStatus),
                  size: 28,
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    'Order Status',
                    style: TextStyle(
                      fontSize: 19,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            Container(
              padding:
                  const EdgeInsets.symmetric(
                horizontal: 12,
              ),
              decoration: BoxDecoration(
                border: Border.all(
                  color: Colors.grey.shade300,
                ),
                borderRadius:
                    BorderRadius.circular(12),
              ),
              child:
                  DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: currentStatus,
                  isExpanded: true,
                  items: statuses.map(
                    (status) {
                      return DropdownMenuItem<String>(
                        value: status,
                        child: Row(
                          children: [
                            Icon(
                              _statusIcon(status),
                              size: 20,
                              color:
                                  _statusColor(status),
                            ),
                            const SizedBox(
                              width: 10,
                            ),
                            Text(status),
                          ],
                        ),
                      );
                    },
                  ).toList(),
                  onChanged: isUpdating
                      ? null
                      : (newStatus) {
                          if (newStatus != null) {
                            updateStatus(
                              newStatus,
                            );
                          }
                        },
                ),
              ),
            ),

            if (isUpdating) ...[
              const SizedBox(height: 12),
              const LinearProgressIndicator(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildCustomerCard({
    required String customerName,
    required String email,
    required String phone,
  }) {
    return _sectionCard(
      title: 'Customer Information',
      icon: Icons.person_outline,
      children: [
        _infoRow(
          Icons.person_outline,
          'Name',
          customerName,
        ),
        _infoRow(
          Icons.email_outlined,
          'Email',
          email,
        ),
        _infoRow(
          Icons.phone_outlined,
          'Phone',
          phone,
        ),
      ],
    );
  }

  Widget _buildAddressCard({
    required String address,
    required String city,
    required String pincode,
  }) {
    return _sectionCard(
      title: 'Delivery Address',
      icon: Icons.location_on_outlined,
      children: [
        _infoRow(
          Icons.home_outlined,
          'Address',
          address,
        ),
        _infoRow(
          Icons.location_city_outlined,
          'City',
          city,
        ),
        _infoRow(
          Icons.pin_drop_outlined,
          'PIN Code',
          pincode,
        ),
      ],
    );
  }

  Widget _buildItemsCard(
    List<dynamic> items,
  ) {
    return _sectionCard(
      title: 'Order Items',
      icon: Icons.shopping_bag_outlined,
      children: [
        if (items.isEmpty)
          const Padding(
            padding:
                EdgeInsets.symmetric(vertical: 10),
            child: Text(
              'No item information available',
              style: TextStyle(
                color: Colors.grey,
              ),
            ),
          ),

        for (final itemData in items)
          _buildItem(itemData),
      ],
    );
  }

  Widget _buildItem(
    dynamic itemData,
  ) {
    final item =
        Map<String, dynamic>.from(itemData);

    final productName =
        item['product_name'] ??
        item['name'] ??
        'Product';

    final quantity =
        int.tryParse(
              item['quantity'].toString(),
            ) ??
            0;

    final price =
        double.tryParse(
              item['price'].toString(),
            ) ??
            0.0;

    final itemTotal =
        double.tryParse(
              item['total'].toString(),
            ) ??
            (price * quantity);

    return Container(
      margin:
          const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius:
            BorderRadius.circular(12),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: Colors.indigo
                  .withValues(alpha: 0.1),
              borderRadius:
                  BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.shopping_bag_outlined,
              color: Colors.indigo,
            ),
          ),

          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Text(
                  productName.toString(),
                  maxLines: 2,
                  overflow:
                      TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 5),

                Text(
                  'Qty: $quantity × '
                  '₹${price.toStringAsFixed(2)}',
                  style: const TextStyle(
                    color: Colors.grey,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 10),

          Text(
            '₹${itemTotal.toStringAsFixed(2)}',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.indigo,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentCard({
    required double total,
    required double discount,
    required dynamic promoCode,
  }) {
    return _sectionCard(
      title: 'Payment Summary',
      icon: Icons.receipt_long_outlined,
      children: [
        _priceRow(
          'Discount',
          '-₹${discount.toStringAsFixed(2)}',
        ),

        if (promoCode.toString().isNotEmpty)
          _priceRow(
            'Promo Code',
            promoCode.toString(),
          ),

        const Divider(),

        _priceRow(
          'Total',
          '₹${total.toStringAsFixed(2)}',
          bold: true,
        ),
      ],
    );
  }

  Widget _buildDateCard(
    String createdAt,
  ) {
    return _sectionCard(
      title: 'Order Information',
      icon: Icons.calendar_today_outlined,
      children: [
        _infoRow(
          Icons.access_time,
          'Created',
          _formatDate(createdAt),
        ),
      ],
    );
  }

  Widget _sectionCard({
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment:
              CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  icon,
                  color: Colors.indigo,
                ),
                const SizedBox(width: 10),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            ...children,
          ],
        ),
      ),
    );
  }

  Widget _infoRow(
    IconData icon,
    String label,
    String value,
  ) {
    return Padding(
      padding:
          const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            size: 20,
            color: Colors.indigo,
          ),

          const SizedBox(width: 10),

          SizedBox(
            width: 75,
            child: Text(
              label,
              style: const TextStyle(
                color: Colors.grey,
              ),
            ),
          ),

          Expanded(
            child: Text(
              value.isEmpty ? '-' : value,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _priceRow(
    String label,
    String value, {
    bool bold = false,
  }) {
    return Padding(
      padding:
          const EdgeInsets.symmetric(
        vertical: 7,
      ),
      child: Row(
        mainAxisAlignment:
            MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: bold
                  ? FontWeight.bold
                  : FontWeight.normal,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontWeight: bold
                  ? FontWeight.bold
                  : FontWeight.w500,
              fontSize: bold ? 18 : 14,
              color: bold
                  ? Colors.indigo
                  : null,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String value) {
    try {
      final date =
          DateTime.parse(value).toLocal();

      return '${date.day.toString().padLeft(2, '0')}/'
          '${date.month.toString().padLeft(2, '0')}/'
          '${date.year} '
          '${date.hour.toString().padLeft(2, '0')}:'
          '${date.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return value;
    }
  }

  IconData _statusIcon(String status) {
    switch (status) {
      case 'Placed':
        return Icons.receipt_long;
      case 'Confirmed':
        return Icons.check_circle_outline;
      case 'Packed':
        return Icons.inventory_2_outlined;
      case 'Shipped':
        return Icons.local_shipping_outlined;
      case 'Out for Delivery':
        return Icons.delivery_dining;
      case 'Delivered':
        return Icons.check_circle;
      default:
        return Icons.info_outline;
    }
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'Placed':
        return Colors.orange;
      case 'Confirmed':
        return Colors.blue;
      case 'Packed':
        return Colors.purple;
      case 'Shipped':
        return Colors.indigo;
      case 'Out for Delivery':
        return Colors.deepOrange;
      case 'Delivered':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}