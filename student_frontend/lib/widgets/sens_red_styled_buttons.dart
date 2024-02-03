import 'package:flutter/material.dart';
import 'package:student_frontend/services/sgw_colors.dart';

class SensRedStyledButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  SensRedStyledButton({
    required this.text,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: SGWColors.themeColor,
        foregroundColor: Colors.white,
        side: const BorderSide(color: Colors.black, width: 0.5),
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
