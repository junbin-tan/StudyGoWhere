import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:student_frontend/model/profile_manager.dart';
import 'package:student_frontend/model/student.dart';
import 'package:student_frontend/model/transaction.dart';
import 'package:student_frontend/screens/wallet_page/top_up_page.dart';
import 'package:student_frontend/screens/wallet_page/transactions_page.dart';
import 'package:student_frontend/services/sgw_colors.dart';
import 'package:student_frontend/services/user_preferences.dart';
import 'package:student_frontend/widgets/white_styled_button.dart';

import '../../services/api.dart';

class WalletPage extends StatefulWidget {
  // Whether to initialize topup page or regular wallet page with transactions
  final bool initialTopUp;

  const WalletPage({super.key, this.initialTopUp = false});

  @override
  State<WalletPage> createState() => _WalletPageState();
}

class _WalletPageState extends State<WalletPage> {
  API api = API();
  Student? currentStudent;
  List<Transaction> transactions = [];
  bool showTopUp = false;
  bool isProfileFetched = false;

  @override
  void initState() {
    super.initState();
    showTopUp = widget.initialTopUp;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!isProfileFetched) {
      _fetchAndSetProfile().then((_) {
        _loadTransactions();
      });
      isProfileFetched = true;
    }
  }

  // DRY PRINCIPLE ????
  Future<void> _fetchAndSetProfile() async {
    final profileManager = context.read<ProfileManager>();
    try {
      await profileManager.fetchProfile();
      if (mounted) {
        setState(() {
          currentStudent = profileManager.loggedInStudent;
        });
      }
      print("fetched student profile: ID = ${currentStudent!.id}");
    } catch (error) {
      print("Error fetching profile: $error");
    }
  }

  /*
  BUG WHERE TRANSACTIONS ARE NOT LOADED ON FIRST RUN
  BECAUSE PROFILE IS NOT FETCHED BEFORE WIDGET FINISHES
  BUILDING

  SHOULDNT BE AN ISSUE AFTER BACKEND IS DONE I HOPE
  */
  _loadTransactions() async {
    List<Transaction>? loadedTransactions =
        UserPreferences.getTransactions(currentStudent!.id.toString());
    if (loadedTransactions != null && loadedTransactions != transactions) {
      setState(() {
        transactions = loadedTransactions;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: IconThemeData(color: SGWColors.themeColor),
        title: Text('Wallet', style: TextStyle(color: SGWColors.themeColor)),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(30.0),
        child: Column(
          children: [
            Container(
              padding: EdgeInsets.symmetric(vertical: 20, horizontal: 40),
              decoration: BoxDecoration(
                  color: SGWColors.themeColor,
                  borderRadius: BorderRadius.circular(10)),
              child: Column(
                children: <Widget>[
                  Text(
                    currentStudent?.balance.toStringAsFixed(2) ?? "0",
                    style: const TextStyle(
                        fontSize: 51,
                        fontWeight: FontWeight.w500,
                        color: Colors.white),
                  ),
                  Text(
                    'dollars',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: Colors.white,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 16),
                  WhiteStyledButton(
                    text: "Top Up",
                    onPressed: () {
                      setState(() {
                        showTopUp = !showTopUp;
                      });
                    },
                  ),
                ],
              ),
            ),
            const Divider(),
            Expanded(
              child: showTopUp
                  ? TopUpPageNew(
                      onBack: () {
                        setState(() {
                          showTopUp = false;
                        });
                      },
                      onSuccessfulTopUp: () {
                        _fetchAndSetProfile();
                        _loadTransactions();
                      },
                    )
                  : TransactionsPage(),
            ),
          ],
        ),
      ),
    );
  }
}
