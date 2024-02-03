import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:student_frontend/model/voucher.dart';
import 'package:student_frontend/screens/search_page/search_page.dart';
import 'package:student_frontend/screens/home_page_widgets/home_page_clickable_coupon.dart';
import 'package:student_frontend/services/colors_list.dart';

class ActivatedVoucherListSection extends StatelessWidget {
  final List<Voucher> vouchers;
  final Function(Voucher) onVoucherPressed;

  const ActivatedVoucherListSection({
    Key? key,
    required this.vouchers,
    required this.onVoucherPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Filter out unredeemed vouchers (2 limit)
    final unredeemedVouchers = vouchers
        .where((voucher) => voucher.voucherStatusEnum == "UNREDEEMED")
        .take(2)
        .toList();

    ColorsList colorsList = ColorsList();

    return Container(
      color: Color.fromARGB(255, 252, 233, 209),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Transform.translate(
            offset: const Offset(0, -10),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 65),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: colorsList.blueHomePage,
                borderRadius: BorderRadius.circular(5),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.4),
                    spreadRadius: 1,
                    blurRadius: 10,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: const Text(
                'Available Vouchers',
                style: TextStyle(
                  fontFamily: 'Montserrat',
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                  fontSize: 20,
                ),
              ),
            ),
          ),
          Column(
            children: unredeemedVouchers.map((voucher) {
              return Padding(
                padding: const EdgeInsets.fromLTRB(8.0, 4.0, 8.0, 4.0),
                child: HomePageCouponCard(
                  voucher: voucher,
                  onPressed: () {
                    onVoucherPressed(voucher);
                    Get.to(() => SearchPage(
                          initialQuery: voucher.voucherApplicableVenue,
                        ));
                  },
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 10),
        ],
      ),
    );
  }
}
