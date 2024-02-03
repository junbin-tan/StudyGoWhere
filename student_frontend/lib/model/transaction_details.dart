import 'package:student_frontend/model/billable.dart';

class TransactionDetail {
  final int transactionDetailId;
  final List<Billable> billables;
  final double subtotal;

  TransactionDetail({
    required this.transactionDetailId,
    required this.billables,
    required this.subtotal,
  });

  factory TransactionDetail.fromJson(Map<String, dynamic> json) {
    return TransactionDetail(
      transactionDetailId: json['transactionDetailId'],
      billables: List<Billable>.from(
          json['billables'].map((x) => Billable.fromJson(x))),
      subtotal: json['subtotal'].toDouble(),
    );
  }
}
