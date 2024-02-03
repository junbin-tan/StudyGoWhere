import 'package:student_frontend/model/transaction_details.dart';

class TransactionDTO {
  final int transactionId;
  final int payerWalletId;
  final int receiverWalletId;
  final String createdTime;
  final String transactionStatus;
  final double totalPrice;
  final List<TransactionDetail> transactionDetails;

  TransactionDTO({
    required this.transactionId,
    required this.payerWalletId,
    required this.receiverWalletId,
    required this.createdTime,
    required this.transactionStatus,
    required this.totalPrice,
    required this.transactionDetails,
  });

  factory TransactionDTO.fromJson(Map<String, dynamic> json) {
    return TransactionDTO(
      transactionId: json['transactionId'],
      payerWalletId: json['payerWalletId'],
      receiverWalletId: json['receiverWalletId'],
      createdTime: json['createdTime'],
      transactionStatus: json['transactionStatus'],
      totalPrice: json['totalPrice'].toDouble(),
      transactionDetails: List<TransactionDetail>.from(
          json['transactionDetails'].map((x) => TransactionDetail.fromJson(x))),
    );
  }
}
