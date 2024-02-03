import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:student_frontend/widgets/verification_code_input.dart';

import '../services/api.dart';

class VerificationPage extends StatefulWidget {
  final String? username;
  final String? email;
  const VerificationPage({super.key, this.email, this.username});

  @override
  State<VerificationPage> createState() => _VerificationPageState();
}

class _VerificationPageState extends State<VerificationPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: const IconThemeData(color: Color.fromARGB(255, 101, 69, 31)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () async {
            Get.offAndToNamed('/signup');
          },
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              "Verification Code",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            ),
            SizedBox(
              height: 3,
            ),
            Text(
              "We have sent the code verification to",
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            SizedBox(
              height: 3,
            ),
            Text(
              "${widget.email}",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            SizedBox(
              height: 20,
            ),
            VerificationCodeInput(
              username: widget.username,
              email: widget.email,
            )
          ],
        ),
      ),
    );
  }
}
