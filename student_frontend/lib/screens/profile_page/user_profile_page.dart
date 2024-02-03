import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:student_frontend/model/profile_manager.dart';
import 'package:student_frontend/model/student.dart';
import 'package:student_frontend/screens/my_reviews_page/my_reviews_page.dart';
import 'package:student_frontend/screens/my_vouchers_page/vouchers_page.dart';
import 'package:student_frontend/screens/profile_page/update_profile_page.dart';
import 'package:student_frontend/screens/wallet_page/wallet_page.dart';
import 'package:student_frontend/services/sgw_colors.dart';
import 'package:student_frontend/services/user_preferences.dart';
import 'package:student_frontend/widgets/profile_menu_widget.dart';
import 'package:student_frontend/widgets/sens_red_styled_buttons.dart';

class UserProfilePage extends StatefulWidget {
  const UserProfilePage({Key? key}) : super(key: key);

  @override
  State<UserProfilePage> createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  Student? currentStudent;
  final ProfileManager profileManager = ProfileManager();

  @override
  void initState() {
    super.initState();
    _fetchAndSetProfile();
  }

  // DRY PRINCIPLE ????
  Future<void> _fetchAndSetProfile() async {
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: IconThemeData(color: SGWColors.themeColor),
        title: Text('Profile', style: TextStyle(color: SGWColors.themeColor)),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: _fetchAndSetProfile,
        child: SingleChildScrollView(
          child: Container(
            padding: const EdgeInsets.all(28.0),
            child: Column(
              children: [
                // Profile Image
                Stack(
                  children: [
                    SizedBox(
                      width: 120,
                      height: 120,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(100),
                        child: profileManager.pp,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(currentStudent?.name ?? "Loading...",
                    style: Theme.of(context).textTheme.headlineMedium),
                Text(currentStudent?.email ?? "Loading...",
                    style: Theme.of(context).textTheme.bodyMedium),
                const SizedBox(height: 20),

                // Edit Profile button
                SensRedStyledButton(
                  text: "Edit Profile",
                  onPressed: () => Get.to(() => UpdateProfilePage(userData: {
                        "name": currentStudent?.name,
                        "email": currentStudent?.email
                      })),
                ),
                const SizedBox(height: 30),
                const Divider(),
                const SizedBox(height: 10),
                // MENU
                ProfileMenuWidget(
                    title: "Bookings",
                    icon: Icons.calendar_today_outlined,
                    onPress: () {}),
                ProfileMenuWidget(
                    title: "Wallet",
                    icon: Icons.account_balance_wallet_outlined,
                    onPress: () {
                      Get.to(const WalletPage(
                        initialTopUp: true,
                      ));
                    }),
                ProfileMenuWidget(
                    title: "Vouchers",
                    icon: Icons.local_offer_outlined,
                    onPress: () {
                      Get.to(VouchersPage(
                        studentId: currentStudent!.id,
                      ));
                    }),
                ProfileMenuWidget(
                    title: "My Reviews",
                    icon: Icons.reviews,
                    onPress: () {
                      Get.to(MyReviewsPage());
                    }),
                const Divider(),
                const SizedBox(height: 10),
                ProfileMenuWidget(
                    title: "Information", icon: Icons.info, onPress: () {}),
                ProfileMenuWidget(
                    title: "Logout",
                    icon: Icons.logout,
                    textColor: Colors.red,
                    endIcon: false,
                    onPress: () {
                      Get.defaultDialog(
                        title: "LOGOUT",
                        titleStyle: const TextStyle(fontSize: 20),
                        content: const Padding(
                          padding: EdgeInsets.symmetric(vertical: 15.0),
                          child: Text("Are you sure, you want to Logout?"),
                        ),
                        confirm: Expanded(
                          child: ElevatedButton(
                            onPressed: () {
                              // Logout: clear user pref, log user out, redirect to login page
                              UserPreferences.setToken("");
                              UserPreferences.setUsername("");
                              profileManager.logout();
                              Get.offAllNamed("/login");
                            },
                            style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.redAccent,
                                side: BorderSide.none),
                            child: const Text("Yes"),
                          ),
                        ),
                        cancel: OutlinedButton(
                          onPressed: () => Get.back(),
                          child: const Text(
                            "No",
                            style: TextStyle(color: Colors.brown),
                          ),
                        ),
                      );
                    }),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
