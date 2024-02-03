import 'package:flutter/material.dart';

class ChooseStarRating extends StatefulWidget {
  int currentRating;
  final void Function(int) updateRating;

  ChooseStarRating({required this.currentRating, required this.updateRating});

  @override
  _ChooseStarRatingState createState() => _ChooseStarRatingState();
}

class _ChooseStarRatingState extends State<ChooseStarRating> {
  static Color themeColor = Color.fromARGB(255, 224, 79, 83);
  @override
  Widget build(BuildContext context) {
    List<Widget> stars = List.generate(
      5,
      (index) {
        bool isYellow = index < widget.currentRating;
        return GestureDetector(
          onTap: () {
            setState(() {
              widget.updateRating(index + 1);
            });
          },
          child: Icon(
            isYellow ? Icons.star : Icons.star_border,
            size: 25,
            color: isYellow ? themeColor : Colors.grey,
          ),
        );
      },
    );

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: stars,
    );
  }
}
