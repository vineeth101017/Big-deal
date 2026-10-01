import 'package:flutter/material.dart';

import 'api_service.dart';
import 'admin_orders_page.dart';
import 'admin_products_page.dart';
import 'admin_promos_page.dart';

enum DateFilter { allTime, today, thisWeek, thisMonth }

class AdminDashboardPage extends StatefulWidget {
  final String adminToken;

  const AdminDashboardPage({
    super.key,
    required this.adminToken,
  });

  @override
  State<AdminDashboardPage> createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage> {
  late Future<Map<String, dynamic>> dashboardDataFuture;
  DateFilter selectedDateFilter = DateFilter.allTime;

  final List<String> statuses = [
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
    dashboardDataFuture = _loadDashboardData();
  }

  Future<Map<String, dynamic>> _loadDashboardData() async {
    final results = await Future.wait([
      ApiService.getAdminOrders(widget.adminToken),
      ApiService.getProducts(),
    ]);

    return {
      'orders': results[0],
      'products': results[1],
    };
  }

  Future<void> refreshDashboard() async {
    setState(() {
      dashboardDataFuture = _loadDashboardData();
    });
  }

  List<dynamic> _filterOrdersByDate(List<dynamic> orders) {
    if (selectedDateFilter == DateFilter.allTime) return orders;

    final now = DateTime.now();
    return orders.where((item) {
      final order = Map<String, dynamic>.from(item);
      final rawDate = order['created_at']?.toString();
      if (rawDate == null || rawDate.isEmpty) return true;

      try {
        final orderDate = DateTime.parse(rawDate);
        if (selectedDateFilter == DateFilter.today) {
          return orderDate.year == now.year &&
              orderDate.month == now.month &&
              orderDate.day == now.day;
        } else if (selectedDateFilter == DateFilter.thisWeek) {
          final diff = now.difference(orderDate).inDays;
          return diff <= 7 && diff >= 0;
        } else if (selectedDateFilter == DateFilter.thisMonth) {
          final diff = now.difference(orderDate).inDays;
          return diff <= 30 && diff >= 0;
        }
      } catch (_) {
        return true;
      }
      return true;
    }).toList();
  }

  Map<String, Map<String, dynamic>> _getTopSellingProducts(List<dynamic> orders) {
    final Map<String, Map<String, dynamic>> productStats = {};

    for (final o in orders) {
      final order = Map<String, dynamic>.from(o);
      final items = order['items'] as List<dynamic>? ?? [];
      for (final it in items) {
        final item = Map<String, dynamic>.from(it);
        final title = item['title']?.toString() ?? 'Product';
        final qty = int.tryParse(item['quantity']?.toString() ?? '1') ?? 1;
        final price = double.tryParse(item['price']?.toString() ?? '0') ?? 0.0;

        if (!productStats.containsKey(title)) {
          productStats[title] = {'title': title, 'units': 0, 'revenue': 0.0};
        }
        productStats[title]!['units'] = (productStats[title]!['units'] as int) + qty;
        productStats[title]!['revenue'] = (productStats[title]!['revenue'] as double) + (qty * price);
      }
    }
    return productStats;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Admin Dashboard',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            onPressed: refreshDashboard,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: dashboardDataFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Text(
                  'Failed to load dashboard.\n\n${snapshot.error}',
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }

          final rawOrders = snapshot.data?['orders'] as List<dynamic>? ?? [];
          final rawProducts = snapshot.data?['products'] as List<dynamic>? ?? [];

          final filteredOrders = _filterOrdersByDate(rawOrders);

          // Calculate low stock / out of stock
          final lowStockProducts = rawProducts.where((p) {
            final stock = p['stock'] ?? 0;
            return stock <= 5;
          }).toList();

          return RefreshIndicator(
            onRefresh: refreshDashboard,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Inventory Stock Alert Banner if any low/out-of-stock
                if (lowStockProducts.isNotEmpty)
                  _buildStockAlertBanner(lowStockProducts),

                // Date Filter Chips
                _buildDateFilterBar(),
                const SizedBox(height: 16),

                // Summary KPI Grid
                _buildSummaryGrid(filteredOrders, rawProducts.length),
                const SizedBox(height: 16),

                // Sales Analytics & Distribution
                _buildSalesAnalytics(filteredOrders),
                const SizedBox(height: 16),

                // Top Selling Items Card
                _buildTopSellingCard(filteredOrders),
                const SizedBox(height: 24),

                // Navigation Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: SizedBox(
                        height: 50,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF6366F1),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                          ),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => AdminOrdersPage(
                                  adminToken: widget.adminToken,
                                ),
                              ),
                            ).then((_) => refreshDashboard());
                          },
                          icon: const Icon(Icons.receipt_long, size: 18),
                          label: const Text(
                            'Orders',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: SizedBox(
                        height: 50,
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Color(0xFF6366F1), width: 1.5),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                          ),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => AdminProductsPage(
                                  adminToken: widget.adminToken,
                                ),
                              ),
                            ).then((_) => refreshDashboard());
                          },
                          icon: const Icon(
                            Icons.inventory_2_outlined,
                            color: Color(0xFF6366F1),
                            size: 18,
                          ),
                          label: const Text(
                            'Inventory',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF6366F1),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: SizedBox(
                        height: 50,
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.deepPurple, width: 1.5),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                          ),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => AdminPromosPage(
                                  adminToken: widget.adminToken,
                                ),
                              ),
                            ).then((_) => refreshDashboard());
                          },
                          icon: const Icon(
                            Icons.confirmation_number_outlined,
                            color: Colors.deepPurple,
                            size: 18,
                          ),
                          label: const Text(
                            'Coupons',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Colors.deepPurple,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildStockAlertBanner(List<dynamic> lowStockItems) {
    final outOfStockCount = lowStockItems.where((p) => (p['stock'] ?? 0) == 0).length;
    final lowStockCount = lowStockItems.length - outOfStockCount;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF2F2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFECACA)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFFFEE2E2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.warning_amber_rounded, color: Color(0xFFDC2626), size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Inventory Stock Alert',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: Color(0xFF991B1B),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  outOfStockCount > 0
                      ? '$outOfStockCount out of stock, $lowStockCount low stock items'
                      : '$lowStockCount item(s) running low on stock (≤5 left)',
                  style: const TextStyle(fontSize: 12, color: Color(0xFFB91C1C)),
                ),
              ],
            ),
          ),
          TextButton(
            style: TextButton.styleFrom(
              foregroundColor: const Color(0xFFDC2626),
              padding: const EdgeInsets.symmetric(horizontal: 8),
            ),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AdminProductsPage(adminToken: widget.adminToken),
                ),
              ).then((_) => refreshDashboard());
            },
            child: const Text('Restock', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildDateFilterBar() {
    return SizedBox(
      height: 38,
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: [
          _filterChip('All Time', DateFilter.allTime),
          const SizedBox(width: 8),
          _filterChip('Today', DateFilter.today),
          const SizedBox(width: 8),
          _filterChip('This Week (7d)', DateFilter.thisWeek),
          const SizedBox(width: 8),
          _filterChip('This Month (30d)', DateFilter.thisMonth),
        ],
      ),
    );
  }

  Widget _filterChip(String label, DateFilter filter) {
    final isSelected = selectedDateFilter == filter;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      selectedColor: const Color(0xFF6366F1),
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black87,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        fontSize: 12,
      ),
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isSelected ? const Color(0xFF6366F1) : Colors.grey.shade300,
        ),
      ),
      onSelected: (_) {
        setState(() {
          selectedDateFilter = filter;
        });
      },
    );
  }

  Widget _buildSummaryGrid(List<dynamic> orders, int totalProducts) {
    double totalSales = 0;
    int deliveredOrders = 0;
    int pendingOrders = 0;

    for (final item in orders) {
      final order = Map<String, dynamic>.from(item);
      final total = double.tryParse(order['total'].toString()) ?? 0.0;
      totalSales += total;

      final status = order['status'] ?? 'Placed';
      if (status == 'Delivered') {
        deliveredOrders++;
      } else {
        pendingOrders++;
      }
    }

    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.45,
      children: [
        _summaryCard(
          title: 'Total Sales',
          value: '₹${totalSales.toStringAsFixed(2)}',
          icon: Icons.currency_rupee,
          iconColor: Colors.green,
        ),
        _summaryCard(
          title: 'Total Orders',
          value: '${orders.length}',
          icon: Icons.receipt_long,
          iconColor: Colors.indigo,
        ),
        _summaryCard(
          title: 'Delivered',
          value: '$deliveredOrders',
          icon: Icons.check_circle_outline,
          iconColor: Colors.teal,
        ),
        _summaryCard(
          title: 'Pending',
          value: '$pendingOrders',
          icon: Icons.pending_actions,
          iconColor: Colors.orange,
        ),
      ],
    );
  }

  Widget _summaryCard({
    required String title,
    required String value,
    required IconData icon,
    required Color iconColor,
  }) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: const TextStyle(color: Colors.grey, fontSize: 13, fontWeight: FontWeight.w500),
                ),
                Icon(icon, size: 22, color: iconColor),
              ],
            ),
            Text(
              value,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSalesAnalytics(List<dynamic> orders) {
    double totalSales = 0;
    final Map<String, int> statusCounts = {
      for (final status in statuses) status: 0,
    };

    for (final item in orders) {
      final order = Map<String, dynamic>.from(item);
      final total = double.tryParse(order['total'].toString()) ?? 0.0;
      totalSales += total;

      final status = order['status']?.toString() ?? 'Placed';
      if (statusCounts.containsKey(status)) {
        statusCounts[status] = statusCounts[status]! + 1;
      }
    }

    final averageOrderValue = orders.isEmpty ? 0.0 : totalSales / orders.length;
    final maxCount = statusCounts.values.fold<int>(0, (max, val) => val > max ? val : max);

    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.analytics_outlined, color: Color(0xFF6366F1), size: 24),
                SizedBox(width: 8),
                Text(
                  'Sales & Distribution',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _analyticsValue(
                    title: 'Total Revenue',
                    value: '₹${totalSales.toStringAsFixed(2)}',
                    icon: Icons.payments_outlined,
                    iconColor: Colors.green,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _analyticsValue(
                    title: 'Average Order',
                    value: '₹${averageOrderValue.toStringAsFixed(2)}',
                    icon: Icons.shopping_bag_outlined,
                    iconColor: const Color(0xFF6366F1),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            const Text(
              'Order Pipeline',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            for (final status in statuses)
              _analyticsStatusBar(
                status: status,
                count: statusCounts[status] ?? 0,
                maxCount: maxCount,
              ),
          ],
        ),
      ),
    );
  }

  Widget _analyticsValue({
    required String title,
    required String value,
    required IconData icon,
    required Color iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: iconColor.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: iconColor, size: 22),
          const SizedBox(height: 8),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 2),
          Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _analyticsStatusBar({
    required String status,
    required int count,
    required int maxCount,
  }) {
    final double progress = maxCount == 0 ? 0 : count / maxCount;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        children: [
          Row(
            children: [
              Icon(_statusIcon(status), size: 16, color: _statusColor(status)),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  status,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                ),
              ),
              Text(
                '$count',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: _statusColor(status),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 7,
              backgroundColor: Colors.grey.shade200,
              valueColor: AlwaysStoppedAnimation<Color>(_statusColor(status)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopSellingCard(List<dynamic> orders) {
    final topStatsMap = _getTopSellingProducts(orders);
    final topList = topStatsMap.values.toList()
      ..sort((a, b) => (b['units'] as int).compareTo(a['units'] as int));

    if (topList.isEmpty) return const SizedBox.shrink();

    final top3 = topList.take(3).toList();

    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.leaderboard_outlined, color: Colors.amber, size: 24),
                SizedBox(width: 8),
                Text(
                  'Top Selling Products',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 14),
            for (int i = 0; i < top3.length; i++) ...[
              Row(
                children: [
                  CircleAvatar(
                    radius: 14,
                    backgroundColor: i == 0
                        ? Colors.amber.shade100
                        : i == 1
                            ? Colors.grey.shade200
                            : Colors.orange.shade100,
                    child: Text(
                      '#${i + 1}',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: i == 0
                            ? Colors.amber.shade900
                            : i == 1
                                ? Colors.grey.shade800
                                : Colors.orange.shade900,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          top3[i]['title'] as String,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                        ),
                        Text(
                          '${top3[i]['units']} units sold',
                          style: const TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    '₹${(top3[i]['revenue'] as double).toStringAsFixed(2)}',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green),
                  ),
                ],
              ),
              if (i < top3.length - 1) const Divider(height: 18),
            ],
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
        return Colors.teal;
      default:
        return Colors.grey;
    }
  }
}