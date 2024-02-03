import 'package:flutter/material.dart';
import 'package:student_frontend/widgets/price_rating.dart';

class VenueRatingAndReview extends StatelessWidget {
  final int? averagePrice;
  final int reviewCount;
  final double averageRatings;
  final List<String> tags;
  static const Color mainBodyColor = Color.fromARGB(100, 31, 37, 51);

  const VenueRatingAndReview({
    Key? key,
    required this.averagePrice,
    required this.reviewCount,
    required this.averageRatings,
    required this.tags,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        Row(
          children: tags.map((tag) {
            return Container(
              margin: const EdgeInsets.only(right: 5),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: Colors.orangeAccent,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                tag,
                style: TextStyle(fontSize: 10, fontFamily: 'Montserrat'),
              ),
            );
          }).toList(),
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: <Widget>[
            Row(
              children: <Widget>[
                const Icon(
                  Icons.star,
                  size: 12,
                ),
                Text(
                  "$averageRatings",
                  style: TextStyle(
                    fontSize: 15,
                    fontFamily: 'Montserrat',
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(
                  width: 10,
                ),
                PriceRating(
                  rating: averagePrice,
                ),
              ],
            ),
            Text(
              "$reviewCount reviews",
              style: const TextStyle(
                  fontFamily: 'Montserrat',
                  fontWeight: FontWeight.w500,
                  fontSize: 15),
            ),
          ],
        )
      ],
    );
  }
}
