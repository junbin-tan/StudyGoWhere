import 'package:flutter/material.dart';
import 'package:student_frontend/services/sgw_colors.dart';

class WhiteStyledButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  WhiteStyledButton({
    required this.text,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.white,
        foregroundColor: SGWColors.themeColor,
        minimumSize: const Size(200, 35),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
      onPressed: onPressed,
      child: Text(text),
    );
  }
}
