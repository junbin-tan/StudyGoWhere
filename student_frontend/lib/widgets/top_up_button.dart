import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';
import 'package:student_frontend/screens/wallet_page/wallet_page.dart';
import 'package:provider/provider.dart';
import '../model/profile_manager.dart';

class TopUpButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<ProfileManager>(
      builder: (context, profileManager, child) {
        double money =
            (profileManager.loggedInStudent?.balance ?? 0.00).toDouble();
        return ElevatedButton(
          onPressed: () => {
            Get.to(const WalletPage(
              initialTopUp: true,
            )),
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            shadowColor: Colors.transparent,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              SvgPicture.asset('assets/credit-icon.svg', width: 20, height: 20),
              const SizedBox(width: 5),
              Text('\$${money.toStringAsFixed(0)}'),
            ],
          ),
        );
      },
    );
  }
}
