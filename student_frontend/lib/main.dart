import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_login/flutter_login.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:get/get.dart';
import 'package:student_frontend/model/profile_manager.dart';
import 'package:student_frontend/screens/login_signup_page.dart';
import 'package:student_frontend/services/active_voucher_provider.dart';
import 'package:student_frontend/services/navigation_provider.dart';
import 'package:student_frontend/services/user_preferences.dart';
import 'screens/landing_page.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load();
  await UserPreferences.init();
  await Firebase.initializeApp();
  Stripe.publishableKey =
      "pk_test_51Nsz95JJ61IRw6sW11FmDaXXtjXuc6zwi1awwoG2ol4ejNfdKSB8HX7nxksLeTxrZ19wKDvjcE8laJn75TCwioBo00waZaeIaI";
  runApp(MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (context) => ProfileManager()),
      ChangeNotifierProvider(create: (context) => NavigationProvider()),
      ChangeNotifierProvider(create: (context) => ActiveVoucherProvider()),
    ],
    child: MyApp(),
  ));
}

class MyApp extends StatelessWidget {
  //final bool isAuthenticated = UserPreferences.getUsername() != "username";
  @override
  Widget build(BuildContext context) {
    bool isFirstTime = UserPreferences.getFirstTimeLaunch() ?? true;

    return GetMaterialApp(
      title: 'Landing Page Demo',
      theme: ThemeData(
        primaryColor: Colors.black,
      ),
      home:
          // VerificationPage(email: "test@email.com"),
          isFirstTime
              ? LandingPage()
              : LoginSignupPage(initialAuthMode: AuthMode.login),
      getPages: [
        GetPage(name: '/landing', page: () => LandingPage()),
        GetPage(
          name: '/signup',
          page: () => LoginSignupPage(
            initialAuthMode: AuthMode.signup,
          ),
        ),
        GetPage(
          name: '/login',
          page: () => LoginSignupPage(
            initialAuthMode: AuthMode.login,
          ),
        ),
      ],
    );
  }
}
