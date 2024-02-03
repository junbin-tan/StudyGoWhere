import 'package:flutter/material.dart';

class OrangeStyledButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  OrangeStyledButton({
    required this.text,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.deepOrangeAccent,
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
