import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:student_frontend/model/transaction.dart';

class TransactionCard extends StatelessWidget {
  final Transaction transaction;

  TransactionCard({required this.transaction});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(4.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                transaction.toOthers()
                    ? transaction.receiver!
                    : transaction.payer!,
                style: TextStyle(
                  fontSize: 16.0,
                  color:
                      transaction.toOthers() ? Colors.grey[500] : Colors.green,
                ),
              ),
              if (transaction.transactionStatusEnum == "PENDING")
                Text(
                  'Pending',
                  style: TextStyle(
                    color: Colors.grey[500],
                  ),
                ),
              if (transaction.transactionStatusEnum == "CANCELLED")
                Text(
                  'Cancelled',
                  style: TextStyle(
                    color: Colors.grey[500],
                  ),
                )
            ],
          ),
          const SizedBox(height: 4.0),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${(transaction.totalAmount / 100).toStringAsFixed(2)} dollars',
                style: TextStyle(
                  fontSize: 24.0,
                  fontWeight: FontWeight.bold,
                  color:
                      transaction.toOthers() ? Colors.grey[500] : Colors.green,
                ),
              ),
              Text(
                '#${(transaction.transactionId)}',
                style: TextStyle(
                  fontSize: 14.0,
                  color:
                      transaction.toOthers() ? Colors.grey[500] : Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8.0),
          Text(DateFormat('yyyy-MM-dd HH:mm')
              .format(transaction.createdAt.toLocal())), // remove this later
        ],
      ),
    );
  }
}
