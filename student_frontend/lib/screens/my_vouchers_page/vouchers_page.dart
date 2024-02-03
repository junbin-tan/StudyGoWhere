import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:student_frontend/model/voucher.dart';
import 'package:student_frontend/screens/home_page.dart';
import 'package:student_frontend/services/api.dart';
import 'package:student_frontend/services/colors_list.dart';
import 'package:student_frontend/widgets/coupon_cards/expired_coupon_card.dart';
import 'package:student_frontend/widgets/coupon_cards/activated_coupon_card.dart';
import 'package:student_frontend/widgets/coupon_cards/redeemed_coupon_card.dart';
import 'package:student_frontend/widgets/coupon_cards/unredeemed_coupon_card.dart';
import 'package:collection/collection.dart';

class VouchersPage extends StatefulWidget {
  final int studentId;

  const VouchersPage({Key? key, required this.studentId}) : super(key: key);

  @override
  _VouchersPageState createState() => _VouchersPageState();
}

class _VouchersPageState extends State<VouchersPage> {
  late Future<List<Voucher>> futureVouchers;
  API api = API();
  Timer? fetchTimer;
  List<Voucher>? _currentVouchers;

  Map<String, bool> filter = {
    'activated': false,
    'unredeemed': false,
    'expired': false,
  };

  @override
  void initState() {
    super.initState();
    futureVouchers = api.getAllStudentVouchers(widget.studentId);
    fetchTimer = Timer.periodic(const Duration(minutes: 5), (Timer timer) {
      fetchVouchers();
    });
    filter['activated'] = true;
    filter['unredeemed'] = true;
  }

  @override
  void dispose() {
    fetchTimer?.cancel();
    super.dispose();
  }

  void fetchVouchers() async {
    List<Voucher> newVouchers =
        await api.getAllStudentVouchers(widget.studentId);

    bool isEqual = const DeepCollectionEquality.unordered()
        .equals(_currentVouchers, newVouchers);

    if (!isEqual && mounted) {
      setState(() {
        _currentVouchers = newVouchers;
        futureVouchers = Future.value(newVouchers);
      });
    }
  }

  void updateFilter(String key, bool value) {
    setState(() {
      filter[key] = value;
    });
  }

  Future<void> _activateVoucherDialog(
      BuildContext context, Voucher voucher) async {
    bool confirmActivation = false;
    ColorsList colorsList = ColorsList();

    await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Activate Voucher'),
          content: const Text(
              'Do you want to activate this voucher? Once activated, the voucher will be valid for 15 minutes.'),
          actions: <Widget>[
            TextButton(
              child: Text(
                'Cancel',
                style: TextStyle(
                  color: colorsList.orangeLoginPage,
                ),
              ),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text(
                'Activate',
                style: TextStyle(
                  color: colorsList.orangeLoginPage,
                ),
              ),
              onPressed: () {
                confirmActivation = true;
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );

    if (confirmActivation) {
      try {
        Voucher activatedVoucher =
            await api.activateVoucher(voucher.billableId);
        DateTime expiryTime = DateTime.now().add(const Duration(minutes: 15));

        // ignore: use_build_context_synchronously
        await showDialog(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) {
            return StatefulBuilder(
              builder: (context, setState) {
                Timer timer;
                timer = Timer.periodic(const Duration(seconds: 1), (timer) {
                  if (!mounted) {
                    timer.cancel();
                    return;
                  } else {
                    int remainingSeconds =
                        expiryTime.difference(DateTime.now()).inSeconds;
                    if (remainingSeconds <= 0) {
                      timer.cancel();
                      Navigator.of(context).pop();
                      fetchVouchers();
                      return;
                    }

                    if (mounted) {
                      setState(() {});
                    }
                  }
                });

                return AlertDialog(
                  title: const Text('Voucher Activated',
                      textAlign: TextAlign.center),
                  content: LayoutBuilder(
                    builder:
                        (BuildContext context, BoxConstraints constraints) {
                      int remainingSeconds =
                          expiryTime.difference(DateTime.now()).inSeconds;
                      String time =
                          '${(remainingSeconds ~/ 60).toString().padLeft(2, '0')}:${(remainingSeconds % 60).toString().padLeft(2, '0')}';
                      int percentage = (remainingSeconds / 900 * 100).round();

                      return Column(
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          const Text('Voucher code:',
                              textAlign: TextAlign.center),
                          Text(activatedVoucher.voucherCode,
                              style: const TextStyle(
                                  fontSize: 30, fontWeight: FontWeight.bold),
                              textAlign: TextAlign.center),
                          const SizedBox(height: 8),
                          const Text('This voucher expires in:',
                              textAlign: TextAlign.center),
                          Text(time,
                              style: const TextStyle(fontSize: 30),
                              textAlign: TextAlign.center),
                          const SizedBox(height: 16),
                          LinearProgressIndicator(
                            value: percentage / 100,
                            backgroundColor: Colors.grey[300],
                            valueColor: const AlwaysStoppedAnimation<Color>(
                                Color.fromARGB(255, 255, 102, 0)),
                          ),
                        ],
                      );
                    },
                  ),
                  actions: <Widget>[
                    TextButton(
                      child: Text(
                        'Close',
                        style: TextStyle(
                          color: colorsList.orangeLoginPage,
                        ),
                      ),
                      onPressed: () {
                        timer.cancel();
                        Navigator.of(context).pop();
                        return;
                      },
                    ),
                  ],
                );
              },
            );
          },
        );
        fetchVouchers();
      } catch (error) {
        // ignore: use_build_context_synchronously
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Activation Failed'),
              content: Text('Failed to activate the voucher: $error'),
              actions: <Widget>[
                TextButton(
                  child: const Text('Close'),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
              ],
            );
          },
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          iconTheme: IconThemeData(color: Colors.blueGrey[800]!),
          title: Text('My Vouchers',
              style: TextStyle(color: Colors.blueGrey[800]!)),
          centerTitle: true,
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () {
              Get.offAll(MyHomePage());
            },
          )),
      body: Column(
        children: [
          Container(
            margin: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                FilterChip(
                  label: const Text('Activated'),
                  selected: filter['activated']!,
                  onSelected: (bool selected) {
                    updateFilter('activated', selected);
                  },
                ),
                FilterChip(
                  label: const Text('Unredeemed'),
                  selected: filter['unredeemed']!,
                  onSelected: (bool selected) {
                    updateFilter('unredeemed', selected);
                  },
                ),
                FilterChip(
                  label: const Text('Expired'),
                  selected: filter['expired']!,
                  onSelected: (bool selected) {
                    updateFilter('expired', selected);
                  },
                ),
              ],
            ),
          ),
          Expanded(
            child: FutureBuilder<List<Voucher>>(
              future: futureVouchers,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('No vouchers available.'));
                } else {
                  List<Voucher> vouchers = snapshot.data!;

                  vouchers.sort((a, b) {
                    const order = {
                      'ACTIVATED': 1,
                      'UNREDEEMED': 2,
                      'REDEEMED': 3,
                      'EXPIRED': 4,
                    };

                    int aValue = order[a.voucherStatusEnum.toUpperCase()] ?? 5;
                    int bValue = order[b.voucherStatusEnum.toUpperCase()] ?? 5;

                    return aValue.compareTo(bValue);
                  });

                  bool isFilterSelected = filter.values.any((v) => v);
                  if (isFilterSelected) {
                    vouchers = vouchers.where((voucher) {
                      bool matchesExpired = filter['expired']! &&
                          (voucher.voucherStatusEnum.toLowerCase() ==
                                  'expired' ||
                              voucher.voucherStatusEnum.toLowerCase() ==
                                  'redeemed');
                      bool matchesOtherFilters =
                          filter[voucher.voucherStatusEnum.toLowerCase()] ??
                              false;
                      return matchesExpired || matchesOtherFilters;
                    }).toList();
                  }

                  return ListView.builder(
                    itemCount: vouchers.length,
                    itemBuilder: (context, index) {
                      Voucher voucher = vouchers[index];
                      Widget card;
                      if (voucher.voucherStatusEnum == 'UNREDEEMED') {
                        card = UnredeemedCouponCard(
                          voucher: voucher,
                          onPressed: () {
                            _activateVoucherDialog(context, voucher);
                          },
                        );
                      } else if (voucher.voucherStatusEnum == 'REDEEMED') {
                        card = RedeemedCouponCard(
                          voucher: voucher,
                        );
                      } else if (voucher.voucherStatusEnum == 'ACTIVATED') {
                        card = ActivatedCouponCard(
                          voucher: voucher,
                          onPressed: () {},
                        );
                      } else {
                        card = ExpiredCouponCard(
                          voucher: voucher,
                        );
                      }

                      return Padding(
                        padding: const EdgeInsets.only(
                            top: 4.0, left: 8.0, bottom: 4.0, right: 8.0),
                        child: card,
                      );
                    },
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
