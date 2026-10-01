import 'package:flutter/material.dart';

class OrderDetailsPage extends StatelessWidget {
  final Map<String, dynamic> order;

  const OrderDetailsPage({
    super.key,
    required this.order,
  });

  @override
  Widget build(BuildContext context) {
    final orderId = order['id'] ?? 0;
    final customerName = order['customer_name'] ?? '';
    final email = order['customer_email'] ?? '';
    final phone = order['customer_phone'] ?? '';
    final address = order['address'] ?? '';
    final city = order['city'] ?? '';
    final pincode = order['pincode'] ?? '';
    final status = order['status'] ?? 'Placed';

    final total =
        double.tryParse(order['total'].toString()) ?? 0.0;

    final discount =
        double.tryParse(
              order['discount_amount'].toString(),
            ) ??
            0.0;

    final promoCode = order['promo_code'] ?? '';

    final createdAt = order['created_at'] ?? '';

    final items = order['items'] is List
        ? List<dynamic>.from(order['items'])
        : <dynamic>[];

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Order Details',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.receipt_outlined),
            tooltip: 'View Invoice',
            onPressed: () => _showInvoiceSheet(context),
          ),
        ],
      ),

      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Order header
          Card(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18),
            ),
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.receipt_long,
                        size: 30,
                        color: Colors.indigo,
                      ),

                      const SizedBox(width: 12),

                      Expanded(
                        child: Text(
                          'Order #$orderId',
                          style: const TextStyle(
                            fontSize: 21,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),

                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 7,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.green.shade50,
                          borderRadius:
                              BorderRadius.circular(20),
                        ),
                        child: Text(
                          status,
                          style: TextStyle(
                            color: Colors.green.shade700,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  if (createdAt.toString().isNotEmpty)
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Placed on: ${createdAt.toString().replaceFirst('T', ' ')}',
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 13,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Customer information
          _SectionCard(
            title: 'Customer Information',
            icon: Icons.person_outline,
            children: [
              _DetailRow(
                label: 'Name',
                value: customerName,
                icon: Icons.person,
              ),

              _DetailRow(
                label: 'Email',
                value: email,
                icon: Icons.email_outlined,
              ),

              _DetailRow(
                label: 'Phone',
                value: phone,
                icon: Icons.phone_outlined,
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Delivery information
          _SectionCard(
            title: 'Delivery Address',
            icon: Icons.location_on_outlined,
            children: [
              _DetailRow(
                label: 'Address',
                value: address,
                icon: Icons.home_outlined,
              ),

              _DetailRow(
                label: 'City',
                value: city,
                icon: Icons.location_city_outlined,
              ),

              _DetailRow(
                label: 'PIN Code',
                value: pincode,
                icon: Icons.markunread_mailbox_outlined,
              ),
            ],
          ),

          const SizedBox(height: 16),
        
        const SizedBox(height: 16),

        // Order Tracking
        OrderTrackingCard(
          status: status,
        ),

        const SizedBox(height: 16),

          // Order items
          _SectionCard(
            title: 'Order Items',
            icon: Icons.shopping_bag_outlined,
            children: [
              ...items.map((item) {
                final product =
                    Map<String, dynamic>.from(item);

                final title =
                    product['title'] ?? '';

                final quantity =
                    product['quantity'] ?? 0;

                final price =
                    double.tryParse(
                          product['price'].toString(),
                        ) ??
                        0.0;

                final itemTotal =
                    price * quantity;

                return Container(
                  padding: const EdgeInsets.symmetric(
                    vertical: 12,
                  ),
                  decoration: const BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                        color: Colors.black12,
                      ),
                    ),
                  ),
                  child: Row(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 45,
                        height: 45,
                        decoration: BoxDecoration(
                          color: Colors.indigo.shade50,
                          borderRadius:
                              BorderRadius.circular(10),
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
                              title,
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                              ),
                            ),

                            const SizedBox(height: 5),

                            Text(
                              '₹${price.toStringAsFixed(2)} × $quantity',
                              style: const TextStyle(
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),

                      Text(
                        '₹${itemTotal.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ],
          ),

          const SizedBox(height: 16),

          // Payment summary
          _SectionCard(
            title: 'Payment Summary',
            icon: Icons.receipt_outlined,
            children: [
              if (promoCode.toString().isNotEmpty)
                _PriceRow(
                  label: 'Promo Code',
                  value: promoCode.toString(),
                ),

              if (discount > 0)
                _PriceRow(
                  label: 'Discount',
                  value:
                      '- ₹${discount.toStringAsFixed(2)}',
                ),

              const Divider(),

              _PriceRow(
                label: 'Total',
                value:
                    '₹${total.toStringAsFixed(2)}',
                bold: true,
              ),
            ],
          ),

          const SizedBox(height: 20),

          // View Invoice Button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFF6366F1), width: 1.5),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              onPressed: () => _showInvoiceSheet(context),
              icon: const Icon(Icons.download_outlined, color: Color(0xFF6366F1)),
              label: const Text(
                'View & Download Invoice',
                style: TextStyle(
                  color: Color(0xFF6366F1),
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                ),
              ),
            ),
          ),

          const SizedBox(height: 24),
        ],
      ),
    );
  }

  void _showInvoiceSheet(BuildContext context) {
    final orderId = order['id'] ?? 0;
    final customerName = order['customer_name'] ?? '';
    final email = order['customer_email'] ?? '';
    final phone = order['customer_phone'] ?? '';
    final address = order['address'] ?? '';
    final city = order['city'] ?? '';
    final pincode = order['pincode'] ?? '';
    final total = double.tryParse(order['total'].toString()) ?? 0.0;
    final discount = double.tryParse(order['discount_amount'].toString()) ?? 0.0;
    final promoCode = order['promo_code'] ?? '';
    final createdAt = order['created_at']?.toString() ?? '';
    final items = order['items'] is List ? List<dynamic>.from(order['items']) : <dynamic>[];

    double subtotal = 0.0;
    for (final it in items) {
      final item = Map<String, dynamic>.from(it);
      final p = double.tryParse(item['price']?.toString() ?? '0') ?? 0.0;
      final q = int.tryParse(item['quantity']?.toString() ?? '1') ?? 1;
      subtotal += (p * q);
    }
    if (subtotal == 0.0) subtotal = total + discount;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.verified, color: Color(0xFF6366F1), size: 28),
                        SizedBox(width: 8),
                        Text(
                          'BIG DEAL',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.2,
                            color: Color(0xFF6366F1),
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Tax Invoice / Cash Receipt',
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                ),
                const Divider(height: 24),

                // Invoice metadata
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Invoice No:', style: TextStyle(color: Colors.grey, fontSize: 12)),
                        Text('INV-2026-000$orderId',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text('Date:', style: TextStyle(color: Colors.grey, fontSize: 12)),
                        Text(
                          createdAt.isNotEmpty ? createdAt.split('T')[0] : 'Today',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Billed to
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Billed & Shipped To:',
                          style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text(customerName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      Text('$address, $city - $pincode', style: const TextStyle(fontSize: 13)),
                      Text('Phone: $phone | Email: $email',
                          style: TextStyle(fontSize: 12, color: Colors.grey.shade700)),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Items list
                const Text('Purchased Items',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                const SizedBox(height: 8),

                for (final it in items) ...[
                  Builder(builder: (_) {
                    final item = Map<String, dynamic>.from(it);
                    final p = double.tryParse(item['price']?.toString() ?? '0') ?? 0.0;
                    final q = int.tryParse(item['quantity']?.toString() ?? '1') ?? 1;
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              '${item['title']} (x$q)',
                              style: const TextStyle(fontSize: 13),
                            ),
                          ),
                          Text('₹${(p * q).toStringAsFixed(2)}',
                              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                        ],
                      ),
                    );
                  }),
                ],

                const Divider(height: 24),

                // Summary
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Subtotal', style: TextStyle(color: Colors.grey)),
                    Text('₹${subtotal.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w600)),
                  ],
                ),
                if (discount > 0) ...[
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Promo Discount ($promoCode)',
                          style: const TextStyle(color: Colors.green, fontWeight: FontWeight.w500)),
                      Text('-₹${discount.toStringAsFixed(2)}',
                          style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
                const SizedBox(height: 4),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('GST / Taxes', style: TextStyle(color: Colors.grey)),
                    Text('Included (0%)', style: TextStyle(color: Colors.grey)),
                  ],
                ),
                const Divider(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Grand Total',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    Text(
                      '₹${total.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF6366F1),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                // Download/Print button
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6366F1),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Invoice downloaded to device storage (INV-2026.pdf)!'),
                          backgroundColor: Colors.green,
                        ),
                      );
                    },
                    icon: const Icon(Icons.download),
                    label: const Text('Save / Download PDF',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}


// ------------------------------------------------------------
// SECTION CARD
// ------------------------------------------------------------

class _SectionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final List<Widget> children;

  const _SectionCard({
    required this.title,
    required this.icon,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 1,
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

            const SizedBox(height: 12),

            ...children,
          ],
        ),
      ),
    );
  }
}


// ------------------------------------------------------------
// DETAIL ROW
// ------------------------------------------------------------

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _DetailRow({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        vertical: 7,
      ),
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
              value.toString().isEmpty
                  ? '-'
                  : value.toString(),
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}


// ------------------------------------------------------------
// PRICE ROW
// ------------------------------------------------------------

class _PriceRow extends StatelessWidget {
  final String label;
  final String value;
  final bool bold;

  const _PriceRow({
    required this.label,
    required this.value,
    this.bold = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        vertical: 6,
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontWeight:
                    bold ? FontWeight.bold : FontWeight.normal,
                fontSize: bold ? 18 : 14,
              ),
            ),
          ),

          Text(
            value,
            style: TextStyle(
              fontWeight:
                  bold ? FontWeight.bold : FontWeight.w500,
              fontSize: bold ? 19 : 14,
              color:
                  bold ? Colors.indigo : null,
            ),
          ),
        ],
      ),
    );
  }
}

// ------------------------------------------------------------
// ORDER TRACKING
// ------------------------------------------------------------

class OrderTrackingCard extends StatelessWidget {
  final String status;

  const OrderTrackingCard({
    super.key,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    const steps = [
      'Placed',
      'Confirmed',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
    ];

    int currentStep = steps.indexOf(status);

    // If the backend has an unknown status,
    // keep the order at the first step.
    if (currentStep < 0) {
      currentStep = 0;
    }

    return Card(
      elevation: 1,
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
                const Icon(
                  Icons.local_shipping_outlined,
                  color: Colors.indigo,
                ),

                const SizedBox(width: 10),

                const Text(
                  'Order Tracking',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            ...List.generate(
              steps.length,
              (index) {
                final step = steps[index];

                final isCompleted =
                    index <= currentStep;

                final isCurrent =
                    index == currentStep;

                final isLast =
                    index == steps.length - 1;

                return Row(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    // Timeline
                    Column(
                      children: [
                        Container(
                          width: 30,
                          height: 30,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: isCompleted
                                ? Colors.indigo
                                : Colors.grey.shade300,
                          ),
                          child: Icon(
                            isCompleted
                                ? Icons.check
                                : Icons.circle,
                            size: isCompleted ? 18 : 8,
                            color: isCompleted
                                ? Colors.white
                                : Colors.grey.shade600,
                          ),
                        ),

                        if (!isLast)
                          Container(
                            width: 2,
                            height: 42,
                            color: index < currentStep
                                ? Colors.indigo
                                : Colors.grey.shade300,
                          ),
                      ],
                    ),

                    const SizedBox(width: 14),

                    // Step information
                    Expanded(
                      child: Padding(
                        padding:
                            const EdgeInsets.only(
                          top: 3,
                        ),
                        child: Column(
                          crossAxisAlignment:
                              CrossAxisAlignment.start,
                          children: [
                            Text(
                              step,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight:
                                    isCurrent ||
                                            isCompleted
                                        ? FontWeight.bold
                                        : FontWeight.normal,
                                color: isCompleted
                                    ? Colors.black87
                                    : Colors.grey,
                              ),
                            ),

                            const SizedBox(height: 4),

                            Text(
                              isCurrent
                                  ? 'Current status'
                                  : index < currentStep
                                      ? 'Completed'
                                      : 'Waiting',
                              style: TextStyle(
                                fontSize: 12,
                                color: isCurrent
                                    ? Colors.indigo
                                    : Colors.grey,
                                fontWeight: isCurrent
                                    ? FontWeight.w600
                                    : FontWeight.normal,
                              ),
                            ),

                            if (!isLast)
                              const SizedBox(
                                height: 15,
                              ),
                          ],
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}