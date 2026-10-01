import 'package:flutter/foundation.dart';
import 'api_service.dart';

class AddressModel {
  final String id;
  final String label; // Home, Office, Other
  final String fullName;
  final String phone;
  final String address;
  final String city;
  final String pincode;
  final bool isDefault;

  AddressModel({
    required this.id,
    required this.label,
    required this.fullName,
    required this.phone,
    required this.address,
    required this.city,
    required this.pincode,
    this.isDefault = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'label': label,
      'full_name': fullName,
      'phone': phone,
      'address': address,
      'city': city,
      'pincode': pincode,
      'is_default': isDefault,
    };
  }

  factory AddressModel.fromMap(Map<String, dynamic> map) {
    return AddressModel(
      id: map['id'] ?? '',
      label: map['label'] ?? 'Home',
      fullName: map['full_name'] ?? '',
      phone: map['phone'] ?? '',
      address: map['address'] ?? '',
      city: map['city'] ?? '',
      pincode: map['pincode'] ?? '',
      isDefault: map['is_default'] ?? false,
    );
  }
}

class AuthService extends ChangeNotifier {
  AuthService._privateConstructor() {
    // Initial sample addresses
    _addresses.add(
      AddressModel(
        id: '1',
        label: 'Home',
        fullName: 'Bernal S.',
        phone: '8546589658',
        address: '42 Beach Road, Poothurai',
        city: 'Marthandam',
        pincode: '629176',
        isDefault: true,
      ),
    );
  }

  static final AuthService instance = AuthService._privateConstructor();

  Map<String, dynamic>? _currentUser;
  String? _token;
  final List<AddressModel> _addresses = [];

  bool get isLoggedIn => _currentUser != null;
  Map<String, dynamic>? get currentUser => _currentUser;
  String? get token => _token;
  String get userName => _currentUser?['name'] ?? 'Guest Shopper';
  String get userEmail => _currentUser?['email'] ?? '';
  List<AddressModel> get addresses => List.unmodifiable(_addresses);

  AddressModel? get defaultAddress {
    try {
      return _addresses.firstWhere((a) => a.isDefault);
    } catch (_) {
      return _addresses.isNotEmpty ? _addresses.first : null;
    }
  }

  Future<void> login({
    required String email,
    required String password,
  }) async {
    final res = await ApiService.loginUser(email: email, password: password);
    _token = res['token'];
    _currentUser = res['user'];
    notifyListeners();
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    await ApiService.registerUser(name: name, email: email, password: password);
    await login(email: email, password: password);
  }

  void logout() {
    _currentUser = null;
    _token = null;
    notifyListeners();
  }

  void updateProfileName(String newName) {
    if (_currentUser != null) {
      _currentUser!['name'] = newName;
      notifyListeners();
    }
  }

  void addAddress(AddressModel address) {
    if (address.isDefault) {
      for (int i = 0; i < _addresses.length; i++) {
        _addresses[i] = AddressModel(
          id: _addresses[i].id,
          label: _addresses[i].label,
          fullName: _addresses[i].fullName,
          phone: _addresses[i].phone,
          address: _addresses[i].address,
          city: _addresses[i].city,
          pincode: _addresses[i].pincode,
          isDefault: false,
        );
      }
    }
    _addresses.add(address);
    notifyListeners();
  }

  void deleteAddress(String id) {
    _addresses.removeWhere((a) => a.id == id);
    if (_addresses.isNotEmpty && !_addresses.any((a) => a.isDefault)) {
      _addresses[0] = AddressModel(
        id: _addresses[0].id,
        label: _addresses[0].label,
        fullName: _addresses[0].fullName,
        phone: _addresses[0].phone,
        address: _addresses[0].address,
        city: _addresses[0].city,
        pincode: _addresses[0].pincode,
        isDefault: true,
      );
    }
    notifyListeners();
  }

  void setDefaultAddress(String id) {
    for (int i = 0; i < _addresses.length; i++) {
      _addresses[i] = AddressModel(
        id: _addresses[i].id,
        label: _addresses[i].label,
        fullName: _addresses[i].fullName,
        phone: _addresses[i].phone,
        address: _addresses[i].address,
        city: _addresses[i].city,
        pincode: _addresses[i].pincode,
        isDefault: _addresses[i].id == id,
      );
    }
    notifyListeners();
  }
}
