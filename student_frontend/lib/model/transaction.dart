import 'dart:convert';

import 'package:student_frontend/services/user_preferences.dart';

class Transaction {
  final int? transactionId;
  final DateTime createdAt;
  final int totalAmount; // in cents
  final String? payer;
  final String? receiver;
  final String transactionStatusEnum;

  Transaction({
    required this.createdAt,
    required this.totalAmount,
    this.payer,
    this.receiver,
    this.transactionId,
    required this.transactionStatusEnum,
  });

  bool toOthers() {
    return UserPreferences.getUsername() == payer;
  }

  bool toMe() {
    return UserPreferences.getUsername() == receiver;
  }

  Map<String, dynamic> toMap() {
    return {
      'createdAt': createdAt.toIso8601String(),
      'totalAmount': totalAmount,
      'payer': payer,
      'receiver': receiver,
      'transactionId': transactionId,
      'transactionStatusEnum': transactionStatusEnum,
    };
  }

  factory Transaction.fromMap(Map<String, dynamic> map) {
    return Transaction(
      createdAt: DateTime.parse(map['createdAt']),
      totalAmount: map['totalAmount'].toInt(),
      payer: map['payer'],
      receiver: map['receiver'],
      transactionId: map['transactionId'],
      transactionStatusEnum: map['transactionStatusEnum'],
    );
  }

  String toJson() => json.encode(toMap());

  factory Transaction.fromJson(String source) =>
      Transaction.fromMap(json.decode(source));
}
