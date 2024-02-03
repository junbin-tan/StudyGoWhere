import 'package:flutter/material.dart';
import 'package:flutter_login/flutter_login.dart';
import 'package:get/get.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:student_frontend/screens/verification_page.dart';
import 'package:student_frontend/services/api.dart';
import 'package:student_frontend/services/colors_list.dart';
import 'package:student_frontend/services/user_preferences.dart';
import '../model/profile_manager.dart';
import './home_page.dart';
import 'package:provider/provider.dart';

class LoginSignupPage extends StatefulWidget {
  final AuthMode initialAuthMode;
  LoginSignupPage({Key? key, required this.initialAuthMode}) : super(key: key);

  @override
  State<LoginSignupPage> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginSignupPage> {
  _LoginViewState();

  // Currently login just takes 2.25 seconds and it auto logs u in
  Duration get loginTime => const Duration(milliseconds: 2250);

  var accesscode = '';

  Future<String?> _authUser(LoginData data) async {
    debugPrint('Name: ${data.name}, Password: ${data.password}');
    Map<String, dynamic> requestData = {
      "password": data.password,
      "username": data.name
    };
    // Add try catch authentication block
    // Return string if fail authentication
    // Return null if successfully authenticated
    try {
      var response = await API().login(requestData);
      if (response.containsKey('email')) {
        setState(() {
          email = response['email'];
        });
        return response['error'];
      } else if (response.containsKey('error')) {
        return response['error'];
      } else {
        var token = response['token'];
        UserPreferences.setToken(token);
        UserPreferences.setUsername(JwtDecoder.decode(token)['sub']);
        UserPreferences.setFirstTimeLaunch(false);
        return null;
      }
    } catch (e) {
      return e.toString();
    }
  }

  Future<String?> _signupUser(SignupData data) async {
    // Check for whether phone number has been registered
    debugPrint('Name: ${data.name}, Password: ${data.password}');
    Map<String, dynamic> requestData = {
      "password": data.password,
      "username": data.name,
      "name": data.additionalSignupData?['name'],
      "email": data.additionalSignupData?['email']
    };

    try {
      var response = await API().register(requestData);
      // var token = response['token'];
      if (response.containsKey('error') && response['error'] == 403) {
        return 'User has been registered but not verified. To verify please login.';
      } else if (response.containsKey('error')) {
        return 'Username already exists';
      } else {
        // UserPreferences.setToken(token);
        // UserPreferences.setUsername(JwtDecoder.decode(token)['sub']);
        // UserPreferences.setFirstTimeLaunch(false);
        return null;
      }
    } catch (e) {
      return e.toString();
    }
  }

  Future<String?> _recoverPassword(String name) async {
    // Check if phone number has account and email valid
    // Add try catch recover password block
    // Return string if fail recover password
    // Return null if successfully signed up
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    accesscode = '';
  }

  FormFieldValidator<String> usernameValidator = (value) {
    return UsernameValidator.validate(value);
  };
  AuthMode? authMode;
  String? username;
  String? email;

  @override
  Widget build(BuildContext context) {
    ColorsList colorsList = ColorsList();

    return Scaffold(
        body: FlutterLogin(
      userType: LoginUserType.name,
      userValidator: (username) {
        return UsernameValidator.validate(username);
      },
      initialAuthMode: widget.initialAuthMode,
      theme: LoginTheme(
        primaryColor: colorsList.orangeLoginPage,
        accentColor: colorsList.orangeLoginPage,
        errorColor: Colors.red,
        cardTheme: CardTheme(
          color: Colors.white,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
          elevation: 5.0,
        ),
        inputTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: Colors.black54, width: 1),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: Colors.black54, width: 1),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: Colors.black54, width: 1),
          ),
          labelStyle: const TextStyle(color: Colors.black),
          hintStyle: TextStyle(color: Colors.orange.shade200),
        ),
        buttonTheme: LoginButtonTheme(
          splashColor: colorsList.orangeLoginPage,
          backgroundColor: colorsList.orangeLoginPage,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: const BorderSide(color: Colors.black, width: 0.5),
          ),
          elevation: 5.0,
        ),
        textFieldStyle: const TextStyle(color: Colors.black54),
        titleStyle: const TextStyle(
            fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black),
        bodyStyle: const TextStyle(fontSize: 14, color: Colors.black),
      ),
      logo: const AssetImage('assets/sgw-icon-white.png'),
      onLogin: (LoginData loginData) async {
        String? message = await _authUser(loginData);

        if (message == null) {
          setState(() {
            authMode = AuthMode.login;
          });
          Provider.of<ProfileManager>(context, listen: false).fetchProfile();
        } else if (email != null) {
          setState(() {
            username = loginData.name;
            authMode = AuthMode.signup;
          });
        } else {
          return message;
        }
      },
      onSignup: (SignupData signupData) async {
        String? message = await _signupUser(signupData);

        if (message == null) {
          setState(() {
            username = signupData.name;
            email = signupData.additionalSignupData!["email"];
            authMode = AuthMode.signup;
          });
          // Provider.of<ProfileManager>(context, listen: false).fetchProfile();
        } else {
          return message;
        }
      },
      additionalSignupFields: [
        const UserFormField(userType: LoginUserType.firstName, keyName: "name"),
        UserFormField(
            userType: LoginUserType.email,
            keyName: "email",
            fieldValidator: (email) {
              return EmailValidator.validate(email);
            })
      ],
      onRecoverPassword: _recoverPassword,
      messages: LoginMessages(
          forgotPasswordButton: '',
          userHint: 'Username',
          recoverPasswordIntro: 'Enter your recovery email here',
          recoverPasswordDescription:
              'An email will be sent to your email address for password reset.'),
      onSubmitAnimationCompleted: () async {
        if (authMode == AuthMode.login) {
          Get.off(MyHomePage());
        } else {
          Get.to(() => VerificationPage(username: username, email: email));
        }
        ;
      },
    ));
  }
}

class UsernameValidator {
  static String? validate(String? username) {
    if (username == null || username.isEmpty) {
      return 'Username is required';
    }

    // Define the regular expression pattern for a valid username
    final RegExp usernameRegExp = RegExp(r'^[a-zA-Z0-9_]{3,20}$');

    if (!usernameRegExp.hasMatch(username)) {
      return 'Invalid username format';
    }

    return null; // Return null to indicate a valid username
  }
}

class EmailValidator {
  static String? validate(String? email) {
    if (email == null || email.isEmpty) {
      return 'Email is required';
    }

    // Define a regular expression pattern for a valid email address
    final RegExp emailRegExp = RegExp(
      r'^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$',
    );

    if (!emailRegExp.hasMatch(email)) {
      return 'Invalid email format';
    }

    return null; // Return null to indicate a valid email
  }
}
