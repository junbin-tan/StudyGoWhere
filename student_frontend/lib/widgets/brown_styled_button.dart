import 'package:flutter/material.dart';
import 'package:student_frontend/services/colors_list.dart';

class BrownStyledButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  BrownStyledButton({
    required this.text,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    ColorsList colorslist = ColorsList();
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: colorslist.blueHomePage,
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
