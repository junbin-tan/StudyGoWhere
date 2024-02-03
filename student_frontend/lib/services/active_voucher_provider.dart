import 'dart:async';

import 'package:flutter/material.dart';

class ActiveVoucher {
  final String voucherCode;
  final DateTime expiryTime;

  ActiveVoucher({required this.voucherCode, required this.expiryTime});
}

class ActiveVoucherProvider with ChangeNotifier {
  ActiveVoucher? _activeVoucher;
  ActiveVoucher? get activeVoucher => _activeVoucher;
  Timer? _expiryTimer;

  void startExpiryTimer() {
    _expiryTimer?.cancel();
    final duration = _activeVoucher!.expiryTime.difference(DateTime.now());
    _expiryTimer = Timer(duration, () {
      clearActiveVoucher();
    });
  }

  void setActiveVoucher(ActiveVoucher voucher) {
    _activeVoucher = voucher;
    notifyListeners();
  }

  void clearActiveVoucher() {
    _activeVoucher = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _expiryTimer?.cancel();
    super.dispose();
  }
}
