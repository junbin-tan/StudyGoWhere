import 'package:coupon_uikit/coupon_uikit.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:student_frontend/model/profile_manager.dart';
import 'package:student_frontend/model/voucher_listing.dart';
import 'package:student_frontend/services/colors_list.dart';

class CustomCouponCard extends StatelessWidget {
  final VoucherListing voucherListing;
  final Function(int, int, VoucherListing) onPressed;

  const CustomCouponCard({
    Key? key,
    required this.voucherListing,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final profileManager = Provider.of<ProfileManager>(context);
    final studentId = profileManager.currentStudentId;
    final studentBalance = profileManager.currentStudentBalance;
    final voucherListing = this.voucherListing;

    ColorsList colorslist = ColorsList();

    return Column(
      children: [
        Container(
          decoration: BoxDecoration(
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.6),
                offset: Offset(0, 0),
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
                            '\$${voucherListing.voucherValue.toStringAsFixed(0)}',
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
                          'Coupon Voucher',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Colors.black54,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          voucherListing.voucherName.toUpperCase(),
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 24,
                            color: colorslist.blueHomePage,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          'Valid Till - ${voucherListing.voucherListingDelistDate}',
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
                        onPressed(
                          studentId!,
                          studentBalance!,
                          voucherListing,
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: colorslist.blueHomePage,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding:
                            EdgeInsets.symmetric(horizontal: 5, vertical: 5),
                      ),
                      child: Text(
                        '\$${voucherListing.voucherCost.toString()}',
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
