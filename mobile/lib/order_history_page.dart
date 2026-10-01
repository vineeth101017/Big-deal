import 'package:flutter/material.dart';
import 'api_service.dart';
import 'auth_service.dart';
import 'order_details_page.dart';

class OrderHistoryPage extends StatelessWidget {
  const OrderHistoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'My Orders',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: FutureBuilder<List<dynamic>>(
        future: ApiService.getOrders(AuthService.instance.userEmail),

        builder: (context, snapshot) {
          // Loading
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          // Error
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 60,
                      color: Colors.red,
                    ),

                    const SizedBox(height: 15),

                    const Text(
                      'Failed to load orders',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 8),

                    Text(
                      '${snapshot.error}',
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 20),

                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (_) =>
                                const OrderHistoryPage(),
                          ),
                        );
                      },
                      child: const Text('Try Again'),
                    ),
                  ],
                ),
              ),
            );
          }

          // No orders
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.receipt_long_outlined,
                    size: 80,
                    color: Colors.grey.shade400,
                  ),

                  const SizedBox(height: 20),

                  const Text(
                    'No orders yet',
                    style: TextStyle(
                      fontSize: 21,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 8),

                  const Text(
                    'Your orders will appear here.',
                  ),
                ],
              ),
            );
          }

          final orders = snapshot.data!;

          return RefreshIndicator(
            onRefresh: () async {
              // FutureBuilder will refresh when page is reopened.
            },

            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: orders.length,

              itemBuilder: (context, index) {
                final order =
                    Map<String, dynamic>.from(orders[index]);

                return OrderCard(
                  order: order,
                );
              },
            ),
          );
        },
      ),
    );
  }
}

class OrderCard extends StatelessWidget {
  final Map<String, dynamic> order;

  const OrderCard({
    super.key,
    required this.order,
  });

  @override
  Widget build(BuildContext context) {
    final orderId = order['id'] ?? 0;
    final customerName =
        order['customer_name'] ?? '';

    final phone =
        order['customer_phone'] ?? '';

    final address =
        order['address'] ?? '';

    final city =
        order['city'] ?? '';

    final pincode =
        order['pincode'] ?? '';

    final status =
        order['status'] ?? 'Placed';

    final total =
        double.tryParse(
              order['total'].toString(),
            ) ??
            0.0;

    final createdAt =
        order['created_at'] ?? '';

    final items =
        order['items'] is List
            ? List<dynamic>.from(order['items'])
            : <dynamic>[];

    return InkWell(
      borderRadius: BorderRadius.circular(18),

      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                OrderDetailsPage(
              order: order,
            ),
          ),
        );
      },

      child: Card(
        margin: const EdgeInsets.only(bottom: 16),
        elevation: 2,

        shape: RoundedRectangleBorder(
          borderRadius:
              BorderRadius.circular(18),
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
                    Icons.receipt_long,
                    color: Colors.indigo,
                  ),

                  const SizedBox(width: 10),

                  Expanded(
                    child: Text(
                      'Order #$orderId',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),
                  ),

                  Container(
                    padding:
                        const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),

                    decoration:
                        BoxDecoration(
                      color:
                          Colors.green.shade50,
                      borderRadius:
                          BorderRadius.circular(20),
                    ),

                    child: Text(
                      status,
                      style: TextStyle(
                        color:
                            Colors.green.shade700,
                        fontWeight:
                            FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),

              const Divider(height: 25),

              _InfoRow(
                icon: Icons.person_outline,
                title: 'Customer',
                value: customerName,
              ),

              const SizedBox(height: 8),

              _InfoRow(
                icon: Icons.phone_outlined,
                title: 'Phone',
                value: phone,
              ),

              const SizedBox(height: 8),

              _InfoRow(
                icon: Icons.location_on_outlined,
                title: 'Address',
                value: address,
              ),

              const SizedBox(height: 8),

              _InfoRow(
                icon: Icons.location_city_outlined,
                title: 'City',
                value: city,
              ),

              const SizedBox(height: 8),

              _InfoRow(
                icon:
                    Icons.markunread_mailbox_outlined,
                title: 'PIN Code',
                value: pincode,
              ),

              const SizedBox(height: 15),

              const Text(
                'Items',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 8),

              ...items.map((item) {
                final product =
                    Map<String, dynamic>.from(item);

                final title =
                    product['title'] ?? '';

                final quantity =
                    product['quantity'] ?? 0;

                final price =
                    double.tryParse(
                          product['price']
                              .toString(),
                        ) ??
                        0.0;

                return Padding(
                  padding:
                      const EdgeInsets.symmetric(
                    vertical: 5,
                  ),

                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          maxLines: 2,
                          overflow:
                              TextOverflow.ellipsis,
                        ),
                      ),

                      const SizedBox(width: 8),

                      Text(
                        '× $quantity',
                        style:
                            const TextStyle(
                          fontWeight:
                              FontWeight.w600,
                        ),
                      ),

                      const SizedBox(width: 12),

                      Text(
                        '₹${price.toStringAsFixed(2)}',
                        style:
                            const TextStyle(
                          fontWeight:
                              FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                );
              }),

              const Divider(height: 25),

              Row(
                children: [
                  const Expanded(
                    child: Text(
                      'Total',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),
                  ),

                  Text(
                    '₹${total.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 19,
                      fontWeight:
                          FontWeight.bold,
                      color: Colors.indigo,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 10),

              if (createdAt
                  .toString()
                  .isNotEmpty)
                Row(
                  children: [
                    const Icon(
                      Icons.calendar_today_outlined,
                      size: 16,
                      color: Colors.grey,
                    ),

                    const SizedBox(width: 7),

                    Text(
                      createdAt
                          .toString()
                          .replaceFirst(
                            'T',
                            ' ',
                          ),
                      style:
                          const TextStyle(
                        color: Colors.grey,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),

              const SizedBox(height: 8),

              const Align(
                alignment: Alignment.centerRight,
                child: Text(
                  'Tap to view details →',
                  style: TextStyle(
                    color: Colors.indigo,
                    fontSize: 12,
                    fontWeight:
                        FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;

  const _InfoRow({
    required this.icon,
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
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
            title,
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
    );
  }
}