import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:student_frontend/screens/home_page.dart';
import 'package:student_frontend/services/api.dart';
import 'package:student_frontend/widgets/brown_styled_button.dart';
import 'package:student_frontend/widgets/white_styled_button.dart';

import '../services/user_preferences.dart';

class VerificationCodeInput extends StatefulWidget {
  const VerificationCodeInput({super.key, this.username, this.email});
  final String? username;
  final String? email;
  @override
  State<VerificationCodeInput> createState() => _VerificationCodeInputState();
}

class _VerificationCodeInputState extends State<VerificationCodeInput> {
  TextEditingController pin1 = TextEditingController();
  TextEditingController pin2 = TextEditingController();
  TextEditingController pin3 = TextEditingController();
  TextEditingController pin4 = TextEditingController();
  TextEditingController pin5 = TextEditingController();
  TextEditingController pin6 = TextEditingController();

  void verify() {
    String pin = pin1.toString() +
        pin2.toString() +
        pin3.toString() +
        pin4.toString() +
        pin5.toString() +
        pin6.toString();
    print(pin);
  }

  @override
  Widget build(BuildContext context) {
    return Form(
        child: Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            SizedBox(
              height: 58,
              width: 43,
              child: TextFormField(
                onChanged: (value) {
                  pin1.text = value;
                  if (value.length == 1) {
                    FocusScope.of(context).nextFocus();
                  }
                },
                onSaved: (pin1) {
                  print(pin1);
                },
                style: Theme.of(context).textTheme.headlineSmall,
                keyboardType: TextInputType.text,
                textAlign: TextAlign.center,
                inputFormatters: [
                  LengthLimitingTextInputFormatter(1),
                ],
              ),
            ),
            SizedBox(
              height: 58,
              width: 43,
              child: TextFormField(
                onChanged: (value) {
                  pin2.text = value;
                  if (value.length == 1) {
                    FocusScope.of(context).nextFocus();
                  }
                },
                onSaved: (pin2) {},
                style: Theme.of(context).textTheme.headlineSmall,
                keyboardType: TextInputType.text,
                textAlign: TextAlign.center,
                inputFormatters: [
                  LengthLimitingTextInputFormatter(1),
                ],
              ),
            ),
            SizedBox(
              height: 58,
              width: 43,
              child: TextFormField(
                onChanged: (value) {
                  pin3.text = value;
                  if (value.length == 1) {
                    FocusScope.of(context).nextFocus();
                  }
                },
                onSaved: (pin3) {},
                style: Theme.of(context).textTheme.headlineSmall,
                keyboardType: TextInputType.text,
                textAlign: TextAlign.center,
                inputFormatters: [
                  LengthLimitingTextInputFormatter(1),
                ],
              ),
            ),
            SizedBox(
              height: 58,
              width: 43,
              child: TextFormField(
                onChanged: (value) {
                  pin4.text = value;
                  if (value.length == 1) {
                    FocusScope.of(context).nextFocus();
                  }
                },
                onSaved: (pin4) {},
                style: Theme.of(context).textTheme.headlineSmall,
                keyboardType: TextInputType.text,
                textAlign: TextAlign.center,
                inputFormatters: [
                  LengthLimitingTextInputFormatter(1),
                ],
              ),
            ),
            SizedBox(
              height: 58,
              width: 43,
              child: TextFormField(
                onChanged: (value) {
                  pin5.text = value;
                  if (value.length == 1) {
                    FocusScope.of(context).nextFocus();
                  }
                },
                onSaved: (pin5) {},
                style: Theme.of(context).textTheme.headlineSmall,
                keyboardType: TextInputType.text,
                textAlign: TextAlign.center,
                inputFormatters: [
                  LengthLimitingTextInputFormatter(1),
                ],
              ),
            ),
            SizedBox(
              height: 58,
              width: 43,
              child: TextFormField(
                onChanged: (value) {
                  pin6.text = value;
                },
                onSaved: (pin6) {},
                style: Theme.of(context).textTheme.headlineSmall,
                keyboardType: TextInputType.text,
                textAlign: TextAlign.center,
                inputFormatters: [
                  LengthLimitingTextInputFormatter(1),
                ],
              ),
            )
          ],
        ),
        SizedBox(
          height: 30,
        ),
        WhiteStyledButton(
            text: "Resend",
            onPressed: () async {
              Map<String, dynamic> message =
                  await API().resendVerification(widget.username);
              if (message.containsKey('message')) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(message['message']),
                    backgroundColor: Colors.green,
                  ),
                );
              } else if (message.containsKey('error')) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(message['error']),
                    backgroundColor: Colors.redAccent,
                  ),
                );
              }
            }),
        BrownStyledButton(
            text: "Verify",
            onPressed: () async {
              String pin = pin1.text +
                  pin2.text +
                  pin3.text +
                  pin4.text +
                  pin5.text +
                  pin6.text;
              var response = await API().verifyCode(widget.username, pin);
              if (response.containsKey('token')) {
                var token = response['token'];
                UserPreferences.setToken(token);
                UserPreferences.setUsername(JwtDecoder.decode(token)['sub']);
                UserPreferences.setFirstTimeLaunch(false);
                Get.off(MyHomePage());
              } else if (response.containsKey('error')) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(response['error']),
                    backgroundColor: Colors.red,
                  ),
                );
              }
              //Throw errow that incomplete if
            })
      ],
    ));
  }
}
