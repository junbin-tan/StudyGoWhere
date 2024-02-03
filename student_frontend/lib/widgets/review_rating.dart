import 'package:flutter/material.dart';

class ReviewRating extends StatelessWidget {
  final int? rating;
  const ReviewRating({super.key, this.rating});
  static Color themeColor = Color.fromARGB(255, 224, 79, 83);

  @override
  Widget build(BuildContext context) {
    List<Widget> ratingsWidget = [];
    for (int i = 0; i < rating!; i++) {
      ratingsWidget.add(SizedBox(
        width: 16,
        child: Icon(
          Icons.star,
          color: themeColor,
          size: 18,
        ),
      ));
    }
    for (int i = 0; i < 5 - rating!; i++) {
      ratingsWidget.add(SizedBox(
        width: 16,
        child: Icon(
          Icons.star,
          color: Colors.grey,
          size: 18,
        ),
      ));
    }
    return Container(
      child: Row(
        children: ratingsWidget,
      ),
    );
  }
}
