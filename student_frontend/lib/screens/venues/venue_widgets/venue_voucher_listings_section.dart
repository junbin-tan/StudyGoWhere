import 'package:flutter/material.dart';
import 'package:coupon_uikit/coupon_uikit.dart';
import 'package:student_frontend/model/voucher_listing.dart';
import 'package:student_frontend/screens/venues/venue_widgets/custom_coupon_card.dart';
import 'package:student_frontend/services/colors_list.dart';

class VoucherListSection extends StatelessWidget {
  final List<VoucherListing> voucherListings;
  final Function(int, int, VoucherListing) onVoucherPressed;

  const VoucherListSection(
      {Key? key, required this.voucherListings, required this.onVoucherPressed})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    ColorsList colorslist = ColorsList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          'Voucher Listings',
          style: TextStyle(
            fontSize: 24,
            fontFamily: 'Montserrat',
            fontWeight: FontWeight.w800,
            color: colorslist.blueHomePage,
          ),
        ),
        const SizedBox(height: 16),
        Column(
          children: voucherListings.map((voucherListing) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: CustomCouponCard(
                voucherListing: voucherListing,
                onPressed: (studentId, studentBalance, voucherListing) =>
                    onVoucherPressed(studentId, studentBalance, voucherListing),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 20),
      ],
    );
  }
}
