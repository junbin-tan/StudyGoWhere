import 'package:flutter/material.dart';
import 'package:student_frontend/widgets/review_card.dart';

import '../../model/review.dart';

class ViewAllReview extends StatefulWidget {
  const ViewAllReview({super.key, this.reviews, required this.openModel});
  final List<Review>? reviews;
  final void Function(BuildContext context, Review review) openModel;

  @override
  State<ViewAllReview> createState() => _ViewAllReviewState();
}

class _ViewAllReviewState extends State<ViewAllReview> {
  @override
  void initState() {
    super.initState();
    loadReviews();
  }

  List<Review> displayedReviews = [];
  int currentPage = 1;
  int reviewsPerPage = 5; // Number of reviews per page
  void loadReviews() {
    // Calculate the range of reviews to display on the current page
    final endIndex = (currentPage - 1) * reviewsPerPage + reviewsPerPage;
    if (endIndex > widget.reviews!.length) {
      setState(() {
        displayedReviews = widget.reviews!.sublist(0, widget.reviews!.length);
      });
    } else {
      setState(() {
        displayedReviews = widget.reviews!.sublist(0, endIndex);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      // Customize the content of your sliding page here
      padding: EdgeInsets.all(50),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Center(
              child: Text(
                'Reviews',
                style: TextStyle(fontSize: 18),
              ),
            ),
            ...displayedReviews.map((e) => ReviewCard(
                  review: e,
                  openModel: () => {widget.openModel(context, e)},
                )),
            if (displayedReviews.length != widget.reviews?.length)
              TextButton(
                child: Text("load more..."),
                onPressed: () {
                  setState(() {
                    currentPage += 1;
                  });
                  loadReviews();
                },
              ) // Add more widgets as needed
          ],
        ),
      ),
    );
  }
}
