import 'package:flutter/material.dart';

class PriceRating extends StatelessWidget {
  final int? rating;
  final double? fontSize;
  const PriceRating({super.key, this.rating, this.fontSize});

  @override
  Widget build(BuildContext context) {
    List<Widget> ratingsWidget = [];
    for (int i = 0; i < rating!; i++) {
      ratingsWidget.add(SizedBox(
        width: 8,
        child: Icon(
          Icons.attach_money,
          color: Colors.green,
          size: fontSize ?? 18,
        ),
      ));
    }
    for (int i = 0; i < 5 - rating!; i++) {
      ratingsWidget.add(SizedBox(
        width: 8,
        child: Icon(
          Icons.attach_money,
          color: Colors.grey,
          size: fontSize ?? 18,
        ),
      ));
    }

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 4),
      child: Row(
        children: ratingsWidget,
      ),
    );
  }
}
