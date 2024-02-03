import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:student_frontend/widgets/review_rating.dart';
import 'package:student_frontend/services/user_preferences.dart';
import '../model/review.dart';

class ReviewCard extends StatelessWidget {
  final Review review;
  const ReviewCard({super.key, required this.review, this.openModel});
  final void Function()? openModel;

  String formatDateTime(DateTime dateTime) {
    return '${dateTime.day.toString().padLeft(2, '0')}/${dateTime.month.toString().padLeft(2, '0')}/${dateTime.year}';
  }

  String daysAgo(DateTime? postingDate) {
    if (postingDate == null) {
      return '';
    }

    DateTime now = DateTime.now();
    int hoursDifference = now.difference(postingDate).inHours;

    if (hoursDifference < 24) {
      return 'today';
    } else if (hoursDifference < 24 * 7) {
      int days = now.difference(postingDate).inDays;
      return '$days ${days == 1 ? 'day' : 'days'} ago';
    } else {
      return formatDateTime(postingDate);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(vertical: 15),
      child: Container(
        margin: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                ReviewRating(
                  rating: review.starRating,
                ),
                Text(daysAgo(review.createdAt)) //Day Ago Widget
              ],
            ),
            SizedBox(
              height: 5,
            ),
            Text(
              "${review.subject}",
              style: TextStyle(
                  fontFamily: 'Montserrat',
                  fontSize: 14,
                  fontWeight: FontWeight.w500),
            ),
            SizedBox(
              height: 2,
            ),
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                "\"${review.description}\"",
                style: TextStyle(
                  fontSize: 12,
                  fontFamily: 'Montserrat',
                  fontWeight: FontWeight.w400,
                ),
              ),
            ),
            SizedBox(
              height: 5,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (review.studentUsername != null)
                  Text(
                    review.studentUsername == UserPreferences.getUsername()
                        ? "By: Me"
                        : "By: ${review.studentUsername}",
                    style: TextStyle(
                      fontSize: 12,
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                if (review.studentUsername == UserPreferences.getUsername())
                  ElevatedButton(
                      onPressed: () {
                        openModel!();
                      },
                      child: Text("Edit")),
              ],
            ),
            if (review!.ownerReply != null)
              Container(
                width: double.infinity,
                padding: EdgeInsets.fromLTRB(5, 0, 0, 0),
                decoration: BoxDecoration(
                  border: Border(
                    left: BorderSide(
                      color:
                          Colors.grey, // Specify the color of the left border
                      width: 3.0, // Adjust the width of the border as needed
                    ),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Response from the owner",
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    SizedBox(
                      height: 5,
                    ),
                    Text("${review.ownerReply}"),
                  ],
                ),
              )
          ],
        ),
      ),
    );
  }
}
