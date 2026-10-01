class Product {
  final int id;
  final String title;
  final String category;
  final double price;
  final String description;
  final String imageUrl;
  final int stock;
  final double averageRating;
  final int reviewsCount;

  Product({
    required this.id,
    required this.title,
    required this.category,
    required this.price,
    required this.description,
    required this.imageUrl,
    required this.stock,
    required this.averageRating,
    required this.reviewsCount,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    String image = '';

    final imageValue = json['image_url'];

    if (imageValue != null) {
      image = imageValue.toString();
    }

    // If image_url is empty, try the images field
    if (image.isEmpty && json['images'] != null) {
      final images = json['images'];

      if (images is List && images.isNotEmpty) {
        image = images.first.toString();
      } else if (images is String) {
        image = images;
      }
    }

    return Product(
      id: json['id'] ?? 0,
      title: json['title']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      price: double.tryParse(
            json['price']?.toString() ?? '0',
          ) ??
          0,
      description: json['description']?.toString() ?? '',
      imageUrl: image,
      stock: int.tryParse(
            json['stock']?.toString() ?? '0',
          ) ??
          0,
      averageRating: double.tryParse(
            json['average_rating']?.toString() ?? '0',
          ) ??
          0,
      reviewsCount: int.tryParse(
            json['reviews_count']?.toString() ?? '0',
          ) ??
          0,
    );
  }
}