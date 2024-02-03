import 'package:flutter/material.dart';
import 'package:student_frontend/model/profile_manager.dart';
import 'package:student_frontend/model/transaction.dart';
import 'package:student_frontend/services/api.dart';
import 'package:flutter_stripe/flutter_stripe.dart' as Stripe;
import 'package:student_frontend/model/student.dart';
import 'package:provider/provider.dart';
import 'package:student_frontend/services/user_preferences.dart';
import 'package:slider_button/slider_button.dart';
import 'package:get/get.dart';
import 'package:student_frontend/widgets/buy_credits_widget.dart';

class TopUpPageNew extends StatefulWidget {
  final VoidCallback onBack;
  final VoidCallback onSuccessfulTopUp;

  const TopUpPageNew({
    Key? key,
    required this.onBack,
    required this.onSuccessfulTopUp,
  }) : super(key: key);

  @override
  _TopUpPageState createState() => _TopUpPageState();
}

class _TopUpPageState extends State<TopUpPageNew> {
  API api = API();
  Map<String, dynamic>? paymentIntent;
  List<int> topUpOptions = [10, 20, 30, 50, 100, 200, 500];
  int amountToppedUp = 0;
  List<String> topUpPrice = [
    '\$10',
    '\$20',
    '\$30',
    '\$50',
    '\$100',
    '\$200',
    '\$500'
  ];
  Student? currentStudent;
  ProfileManager? profileManager;
  TextEditingController customAmountController = TextEditingController();
  bool showSlider = true;

  @override
  void initState() {
    super.initState();
  }

  Future<void> makePayment(String amount) async {
    try {
      paymentIntent = await createPaymentIntent(amount, 'SGD');
      print(paymentIntent);
      print(Stripe.Stripe.publishableKey);

      // STEP 2: Initialize Payment Sheet
      await Stripe.Stripe.instance.initPaymentSheet(
        paymentSheetParameters: Stripe.SetupPaymentSheetParameters(
          paymentIntentClientSecret: paymentIntent!['client_secret'],
          merchantDisplayName: 'StudyGoWhere',
          style: ThemeMode.dark,
        ),
      );
      // STEP 3: Display Payment sheet
      print("HERE");
      amountToppedUp = int.parse(amount) * 100; // convert to cents
      displayPaymentSheet();
    } catch (err) {
      print('Error in makePayment: $err');
      _showDialog('Error', 'Failed to initialize payment sheet: $err');
    }
  }

  displayPaymentSheet() async {
    try {
      await Stripe.Stripe.instance.presentPaymentSheet().then((value) async {
        // Create a Transaction object after successful payment
        if (amountToppedUp != 0 && currentStudent != null) {
          Transaction transaction = Transaction(
              createdAt: DateTime.now(),
              totalAmount: amountToppedUp,
              payer: currentStudent!.username,
              receiver: null,
              transactionStatusEnum: 'COMPLETED');
          // Store in local storage
          UserPreferences.addTransaction(
              currentStudent!.id.toString(), transaction);
          print("transaction created and stored");

          // Update student's wallet page balance
          widget.onSuccessfulTopUp();
        } else {
          print(
              "Error: Invalid paymentIntent amount or currentStudent is null");
        }
        _showDialog('Success', 'Payment Successful!');
        paymentIntent = null;
        await profileManager?.fetchProfile();
      }).onError((error, stackTrace) {
        print('Error in presentPaymentSheet: $error');
        _showDialog('Error', _parseError(error));
      });
    } on Stripe.StripeException catch (e) {
      print('StripeException in presentPaymentSheet: $e');
      _showDialog(
          'Stripe Error', e.error.localizedMessage ?? 'An error occurred');
    } catch (e) {
      print('Error in presentPaymentSheet: $e');
      _showDialog('Error', 'An unexpected error occurred: $e');
    }
  }

  String _parseError(error) {
    if (error is Stripe.StripeException) {
      return error.error.localizedMessage ?? 'An error occurred';
    }
    return 'An error occurred: $error';
  }

  createPaymentIntent(String amount, String currency) async {
    try {
      return await api.stripePayment(currentStudent!.id, int.parse(amount));
    } catch (e) {
      print('Error in createPaymentIntent: $e');
      _showDialog('Error', 'Failed to create payment intent: $e');
      throw e;
    }
  }

  void _showDialog(String title, String message, [String? localizedMessage]) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: localizedMessage != null
            ? Text('$message\n\nDetails: $localizedMessage')
            : Text(message),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Consumer<ProfileManager>(
            builder: (context, profileManager, child) {
              profileManager = profileManager;
              currentStudent = profileManager.loggedInStudent;
              return Column(
                children: [
                  Stack(
                    children: [
                      TextField(
                        controller: customAmountController,
                        keyboardType: TextInputType.number,
                        onChanged: (_) {
                          setState(() {});
                        },
                        decoration: const InputDecoration(
                          labelText: 'Custom Amount',
                          labelStyle: TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.w300,
                          ),
                          hintText: 'Enter amount in SGD',
                          hintStyle: TextStyle(
                            color: Colors.grey,
                            fontWeight: FontWeight.w300,
                          ),
                          focusedBorder: UnderlineInputBorder(
                            borderSide: BorderSide(
                              color: Colors.black,
                            ),
                          ),
                          enabledBorder: UnderlineInputBorder(
                            borderSide: BorderSide(
                              color: Colors.grey,
                            ),
                          ),
                        ),
                        style: const TextStyle(
                          fontSize: 16.0,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 25),
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      "Instant",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18.0,
                      ),
                    ),
                  ),
                  Column(
                    children: [
                      Row(
                        children: List.generate(4, (index) {
                          return Expanded(
                            child: Padding(
                              padding: const EdgeInsets.all(4.0),
                              child: ElevatedButton(
                                onPressed: () async {
                                  await makePayment(
                                      topUpOptions[index].toString());
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.grey[300],
                                  side: BorderSide(
                                    color: Colors.grey[800]!,
                                    width: 0.4,
                                  ),
                                ),
                                child: Text(
                                  topUpPrice[index],
                                  style: TextStyle(
                                    color: Colors.grey[600]!,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ),
                          );
                        }),
                      ),
                      Row(
                        children: List.generate(3, (index) {
                          return Expanded(
                            child: Padding(
                              padding: const EdgeInsets.all(4.0),
                              child: ElevatedButton(
                                onPressed: () async {
                                  await makePayment(
                                      topUpOptions[index + 4].toString());
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.grey[300],
                                  side: BorderSide(
                                    color: Colors.grey[800]!,
                                    width: 0.3,
                                  ),
                                ),
                                child: Text(
                                  topUpPrice[index + 4],
                                  style: TextStyle(
                                    color: Colors.grey[600]!,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ),
                          );
                        }),
                      ),
                    ],
                  ),
                  const SizedBox(height: 100),
                  if (showSlider)
                    SliderButton(
                      action: () {
                        final customAmount = customAmountController.text.trim();
                        if (customAmount.isNotEmpty) {
                          makePayment(customAmount);
                          customAmountController.clear();
                        } else {
                          _showDialog('Error', 'Please enter an amount');
                        }
                        setState(() {
                          showSlider = false;
                        });
                        Future.delayed(const Duration(milliseconds: 100), () {
                          setState(() {
                            showSlider = true;
                          });
                        });
                      },
                      label: const Text(
                        "Slide to Pay",
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w300,
                            fontSize: 17),
                      ),
                      alignLabel: const Alignment(0.1, 0.0),
                      icon: const Center(
                        child: Icon(
                          Icons.attach_money_outlined,
                          color: Colors.black,
                          size: 30.0,
                          semanticLabel: 'Slide to make a payment',
                        ),
                      ),
                      boxShadow: const BoxShadow(
                        color: Colors.black,
                        blurRadius: 4,
                      ),
                      shimmer: true,
                      width: 285,
                      height: 60,
                      radius: 100,
                      dismissThresholds: 0.95,
                      baseColor: Colors.black,
                      highlightedColor: Colors.white,
                      buttonColor: Colors.white,
                      // backgroundColor: Colors.black,
                    ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}
