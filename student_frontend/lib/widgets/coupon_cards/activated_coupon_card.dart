import 'package:coupon_uikit/coupon_uikit.dart';
import 'package:flutter/material.dart';
import 'package:student_frontend/model/voucher.dart';
import 'package:intl/intl.dart';
import 'package:student_frontend/services/colors_list.dart';

class ActivatedCouponCard extends StatelessWidget {
  final Voucher voucher;
  final VoidCallback onPressed;

  const ActivatedCouponCard({
    Key? key,
    required this.voucher,
    required this.onPressed,
  }) : super(key: key);

  String _formatActivationTime(String? activationTimeString) {
    if (activationTimeString == null || activationTimeString.isEmpty) {
      return 'N/A';
    }

    DateTime activationTime = DateTime.parse(activationTimeString);
    DateTime validTill = activationTime.add(const Duration(minutes: 15));
    final dateFormat = DateFormat('HH:mm:ss');

    return dateFormat.format(validTill);
  }

  @override
  Widget build(BuildContext context) {
    final voucher = this.voucher;
    ColorsList colorslist = ColorsList();

    return Column(
      children: [
        Container(
          decoration: BoxDecoration(
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.6),
                offset: const Offset(0, 0),
                blurRadius: 10,
              ),
            ],
          ),
          child: CouponCard(
            height: 90,
            backgroundColor: Colors.white,
            curveAxis: Axis.vertical,
            firstChild: Container(
              decoration: BoxDecoration(
                color: colorslist.activatedCouponLeft,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Expanded(
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            '\$${(voucher.voucherValue / 100).toStringAsFixed(0)}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const Text(
                            'OFF',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            secondChild: Container(
              width: double.maxFinite,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: colorslist.activatedCouponRight,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Flexible(
                    flex: 2,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Voucher Code',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Colors.black54,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          voucher.voucherCode.toUpperCase(),
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 24,
                            color: colorslist.activatedCouponLeft,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          'Valid Till - ${_formatActivationTime(voucher.activationTime)}',
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Colors.black45,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Flexible(
                    flex: 1,
                    child: OutlinedButton(
                      onPressed: () {
                        onPressed();
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: colorslist.activatedCouponLeft,
                        backgroundColor: Colors.white,
                        side: BorderSide(
                          color: colorslist.activatedCouponLeft,
                          width: 1.0,
                        ),
                        splashFactory: NoSplash.splashFactory,
                      ),
                      child: Text(
                        'Use',
                        style: TextStyle(
                          color: colorslist.activatedCouponLeft,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
