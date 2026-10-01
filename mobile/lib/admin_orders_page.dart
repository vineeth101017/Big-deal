import 'package:flutter/material.dart';
import 'admin_dashboard_page.dart';
import 'api_service.dart';
import 'admin_order_details_page.dart';

class AdminOrdersPage extends StatefulWidget {
  final String adminToken;

  const AdminOrdersPage({
    super.key,
    required this.adminToken,
  });

  @override
  State<AdminOrdersPage> createState() => _AdminOrdersPageState();
}
class _AdminOrdersPageState extends State<AdminOrdersPage> {
  late Future<List<dynamic>> ordersFuture;

  final List<String> statuses = [
    'Placed',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  final TextEditingController searchController =
      TextEditingController();

  String selectedStatus = 'All';

  final List<String> filterStatuses = [
    'All',
    'Placed',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  @override
  void initState() {
    super.initState();
    ordersFuture =
        ApiService.getAdminOrders(widget.adminToken);
  }

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  List<dynamic> filterOrders(List<dynamic> orders) {
    final searchText =
        searchController.text.trim().toLowerCase();

    return orders.where((item) {
      final order =
          Map<String, dynamic>.from(item);

      final orderId =
          order['id']?.toString().toLowerCase() ?? '';

      final customerName =
          order['customer_name']
                  ?.toString()
                  .toLowerCase() ??
              '';

      final email =
          order['customer_email']
                  ?.toString()
                  .toLowerCase() ??
              '';

      final phone =
          order['customer_phone']
                  ?.toString()
                  .toLowerCase() ??
              '';

      final status =
          order['status']?.toString() ?? 'Placed';

      final matchesSearch =
          searchText.isEmpty ||
          orderId.contains(searchText) ||
          customerName.contains(searchText) ||
          email.contains(searchText) ||
          phone.contains(searchText);

      final matchesStatus =
          selectedStatus == 'All' ||
          status == selectedStatus;

      return matchesSearch && matchesStatus;
    }).toList();
  }

  Future<void> refreshOrders() async {
    setState(() {
      ordersFuture = ApiService.getAdminOrders(widget.adminToken);
    });
  }

  Future<void> changeStatus(
    int orderId,
    String status,
  ) async {
    try {
      await ApiService.updateOrderStatus(
        orderId: orderId,
        status: status,
        adminToken: widget.adminToken,
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Order #$orderId updated to $status',
          ),
          backgroundColor: Colors.green,
        ),
      );

      await refreshOrders();
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Failed to update order: '
            '${e.toString().replaceFirst('Exception: ', '')}',
          ),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Admin Orders',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AdminDashboardPage(
                    adminToken: widget.adminToken,
                  ),
                ),
              );
            },
            icon: const Icon(Icons.dashboard_outlined),
            tooltip: 'Dashboard',
          ),
          IconButton(
            onPressed: refreshOrders,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      
      body: FutureBuilder<List<dynamic>>(
      future: ordersFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState ==
            ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        if (snapshot.hasError) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Text(
                'Failed to load orders.\n\n'
                '${snapshot.error}',
                textAlign: TextAlign.center,
              ),
            ),
          );
        }

        final orders = snapshot.data ?? [];

        final filteredOrders =
            filterOrders(orders);

        return RefreshIndicator(
          onRefresh: refreshOrders,
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Search
              TextField(
                controller: searchController,
                onChanged: (_) {
                  setState(() {});
                },
                decoration: InputDecoration(
                  hintText:
                      'Search order, customer, email...',
                  prefixIcon:
                      const Icon(Icons.search),
                  suffixIcon:
                      searchController.text.isNotEmpty
                          ? IconButton(
                              onPressed: () {
                                searchController.clear();
                                setState(() {});
                              },
                              icon: const Icon(
                                Icons.clear,
                              ),
                            )
                          : null,
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(14),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),

              const SizedBox(height: 14),

              // Status filter
              SizedBox(
                height: 45,
                child: ListView.separated(
                  scrollDirection:
                      Axis.horizontal,
                  itemCount:
                      filterStatuses.length,
                  separatorBuilder:
                      (context, index) =>
                          const SizedBox(width: 8),
                  itemBuilder:
                      (context, index) {
                    final status =
                        filterStatuses[index];

                    final isSelected =
                        selectedStatus == status;

                    return ChoiceChip(
                      label: Text(status),
                      selected: isSelected,
                      onSelected: (_) {
                        setState(() {
                          selectedStatus = status;
                        });
                      },
                    );
                  },
                ),
              ),

              const SizedBox(height: 16),

              // Result count
              Row(
                children: [
                  const Icon(
                    Icons.receipt_long_outlined,
                    size: 20,
                    color: Colors.indigo,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${filteredOrders.length} '
                    'order${filteredOrders.length == 1 ? '' : 's'} found',
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              if (filteredOrders.isEmpty)
                const Padding(
                  padding: EdgeInsets.all(40),
                  child: Column(
                    children: [
                      Icon(
                        Icons.search_off,
                        size: 60,
                        color: Colors.grey,
                      ),
                      SizedBox(height: 12),
                      Text(
                        'No matching orders',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight:
                          FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 5),
                      Text(
                        'Try another search or status filter.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),

              ...filteredOrders.map((item) {
                final order =
                    Map<String, dynamic>.from(item);

                return Padding(
                  padding:
                      const EdgeInsets.only(
                    bottom: 16,
                  ),
                  child: InkWell(
                    borderRadius:
                        BorderRadius.circular(18),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              AdminOrderDetailsPage(
                            order: order,
                            adminToken:
                                widget.adminToken,
                          ),
                        ),
                      );
                    },
                    child: AdminOrderCard(
                      order: order,
                      statuses: statuses,
                      onStatusChanged:
                          changeStatus,
                    ),
                  ),
                );
              }),
            ],
          ),
        );
      },
    ),
    );
  }
}

// ============================================================
// ADMIN ORDER CARD
// ============================================================

class AdminOrderCard extends StatelessWidget {
  final Map<String, dynamic> order;
  final List<String> statuses;
  final Future<void> Function(
    int orderId,
    String status,
  ) onStatusChanged;

  const AdminOrderCard({
    super.key,
    required this.order,
    required this.statuses,
    required this.onStatusChanged,
  });

  @override
  Widget build(BuildContext context) {
    final orderId = order['id'] ?? 0;

    final customerName =
        order['customer_name'] ?? '';

    final email =
        order['customer_email'] ?? '';

    final phone =
        order['customer_phone'] ?? '';

    final address =
        order['address'] ?? '';

    final city =
        order['city'] ?? '';

    final pincode =
        order['pincode'] ?? '';

    final total =
        double.tryParse(
              order['total'].toString(),
            ) ??
            0.0;

    String currentStatus =
        order['status'] ?? 'Placed';

    if (!statuses.contains(currentStatus)) {
      currentStatus = 'Placed';
    }

    return Card(
      margin: const EdgeInsets.only(
        bottom: 16,
      ),

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
            // Header
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
                      fontSize: 19,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),

                Text(
                  '₹${total.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                ),
              ],
            ),

            const Divider(height: 25),

            // Customer
            _AdminInfoRow(
              icon: Icons.person_outline,
              label: 'Customer',
              value: customerName,
            ),

            const SizedBox(height: 8),

            _AdminInfoRow(
              icon: Icons.email_outlined,
              label: 'Email',
              value: email,
            ),

            const SizedBox(height: 8),

            _AdminInfoRow(
              icon: Icons.phone_outlined,
              label: 'Phone',
              value: phone,
            ),

            const SizedBox(height: 8),

            _AdminInfoRow(
              icon: Icons.location_on_outlined,
              label: 'Address',
              value: '$address, $city - $pincode',
            ),

            const SizedBox(height: 18),

            const Text(
              'Order Status',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 8),

            // Status dropdown
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 12,
              ),

              decoration: BoxDecoration(
                border: Border.all(
                  color: Colors.grey.shade300,
                ),

                borderRadius:
                    BorderRadius.circular(12),
              ),

              child: DropdownButtonHideUnderline(
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

                            const SizedBox(width: 10),

                            Text(status),
                          ],
                        ),
                      );
                    },
                  ).toList(),

                  onChanged: (newStatus) {
                    if (newStatus == null ||
                        newStatus ==
                            currentStatus) {
                      return;
                    }

                    onStatusChanged(
                      orderId,
                      newStatus,
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
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


// ============================================================
// INFO ROW
// ============================================================

class _AdminInfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _AdminInfoRow({
    required this.icon,
    required this.label,
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
    );
  }
}