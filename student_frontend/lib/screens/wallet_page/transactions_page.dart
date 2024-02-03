import 'package:flutter/material.dart';
import 'package:student_frontend/model/transaction.dart';
import 'package:student_frontend/services/api.dart';
import 'package:student_frontend/widgets/transaction_card.dart';

class TransactionsPage extends StatefulWidget {
  TransactionsPage();

  @override
  _TransactionsPageState createState() => _TransactionsPageState();
}

class _TransactionsPageState extends State<TransactionsPage> {
  List<Transaction> filteredTransactions = [];
  List<Transaction> transactions = [];
  String filterValue = '30 Days';
  final API api = API();

  @override
  void initState() {
    super.initState();
    _fetchTransactions();
  }

  Future<void> _fetchTransactions() async {
    List<Transaction> ownTransactions = await api.retrieveOwnTransactions();
    setState(() {
      transactions = ownTransactions;
    });
    _filterTransactions(ownTransactions);
  }

  _filterTransactions(List<Transaction> transactions) {
    DateTime now = DateTime.now();

    if (filterValue == '30 Days') {
      DateTime startDate = now.subtract(const Duration(days: 30));
      filteredTransactions =
          transactions.where((tx) => tx.createdAt.isAfter(startDate)).toList();
    } else if (filterValue == '6 Months') {
      DateTime startDate = now.subtract(const Duration(days: 180));
      filteredTransactions =
          transactions.where((tx) => tx.createdAt.isAfter(startDate)).toList();
    } else {
      filteredTransactions = transactions;
    }
    filteredTransactions.sort((x, y) => y.createdAt.compareTo(x.createdAt));

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Align(
          alignment: Alignment.center,
          child: DropdownButton<String>(
            value: filterValue,
            isDense: true,
            items: const [
              DropdownMenuItem(value: '30 Days', child: Text("30 Days")),
              DropdownMenuItem(value: '6 Months', child: Text("6 Months")),
              DropdownMenuItem(value: 'All', child: Text("All")),
            ],
            onChanged: (value) {
              setState(() {
                filterValue = value!;
                _filterTransactions(transactions);
              });
            },
          ),
        ),
        const SizedBox(
          height: 10,
        ),
        Expanded(
          child: ListView.builder(
            itemCount: filteredTransactions.length,
            itemBuilder: (context, index) {
              Transaction tx = filteredTransactions[index];
              return TransactionCard(transaction: tx);
            },
          ),
        ),
      ],
    );
  }
}
