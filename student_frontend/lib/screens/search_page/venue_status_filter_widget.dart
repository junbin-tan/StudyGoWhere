import 'package:flutter/material.dart';

class StatusCircleButton extends StatelessWidget {
  final String status;
  final String text;
  final VoidCallback onPressed;
  final bool selected;

  StatusCircleButton({
    required this.status,
    required this.text,
    required this.onPressed,
    required this.selected,
  });

  Color _getStatusColor() {
    switch (status) {
      case "red":
        return Colors.red;
      case "amber":
        return Colors.orange;
      case "green":
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: selected ? _getStatusColor() : Colors.grey[100]!,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(25),
        ),
        shadowColor: Colors.transparent,
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 1.0),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: _getStatusColor(),
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 5),
            Text(
              text,
              style: TextStyle(
                color: selected ? Colors.white : _getStatusColor(),
                fontSize: 12,
                fontWeight: FontWeight.w400,
                letterSpacing: 1,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
