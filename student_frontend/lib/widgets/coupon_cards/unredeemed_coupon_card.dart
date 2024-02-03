import 'package:coupon_uikit/coupon_uikit.dart';
import 'package:flutter/material.dart';
import 'package:student_frontend/model/voucher.dart';
import 'package:student_frontend/services/colors_list.dart';

class UnredeemedCouponCard extends StatelessWidget {
  final Voucher voucher;
  final VoidCallback onPressed;

  const UnredeemedCouponCard({
    Key? key,
    required this.voucher,
    required this.onPressed,
  }) : super(key: key);

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
                color: colorslist.blueHomePage,
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
              decoration: const BoxDecoration(
                color: Colors.white,
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
                          'Unredeemed Voucher',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Colors.black54,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          voucher.voucherName.toUpperCase(),
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 24,
                            color: colorslist.blueHomePage,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          'Valid Till - ${voucher.voucherExpiryDate}',
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
                    child: ElevatedButton(
                      onPressed: () {
                        onPressed();
                      },
                      style: ElevatedButton.styleFrom(
                        foregroundColor: colorslist.blueHomePage,
                        backgroundColor: Colors.white,
                        side: BorderSide(
                          color: colorslist.blueHomePage,
                          width: 1,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(5),
                        ),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 5, vertical: 5),
                      ),
                      child: Text(
                        'Activate',
                        style: TextStyle(
                          color: colorslist.blueHomePage,
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
