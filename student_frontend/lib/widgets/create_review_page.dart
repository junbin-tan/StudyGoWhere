import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:student_frontend/services/sgw_colors.dart';
import 'package:student_frontend/widgets/choose_star_rating.dart';
import 'package:student_frontend/widgets/sens_red_styled_buttons.dart';

import '../model/review.dart';
import '../services/api.dart';
import 'brown_styled_button.dart';

class CreateReviewPage extends StatefulWidget {
  final int? venueId;
  final Review? review;
  final void Function() updateReviewed;

  const CreateReviewPage(
      {super.key, this.venueId, required this.updateReviewed, this.review});

  @override
  State<CreateReviewPage> createState() => CreateReviewPageState();
}

class CreateReviewPageState extends State<CreateReviewPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _subjectController = TextEditingController();
  final TextEditingController _reviewController = TextEditingController();
  int rating = 1;

  @override
  void initState() {
    super.initState();
    if (widget.review != null) {
      _subjectController.text = widget.review!.subject;
      _reviewController.text = widget.review!.description;
      setState(() {
        rating = widget.review!.starRating;
      });
    }
  }

  Future<void> _createReview() async {
    if (_formKey.currentState!.validate()) {
      if (widget.review == null) {
        try {
          //Create Review object
          Review newReview = Review(
              subject: _subjectController.text,
              description: _reviewController.text,
              starRating: rating);
          Map<String, dynamic> reviewWithVenueId = Map<String, dynamic>();
          reviewWithVenueId['review'] = newReview;
          reviewWithVenueId['venueId'] = widget.venueId;
          Review createdReview = await API().createReview(reviewWithVenueId);
          print('Response received: ${createdReview.toJsonString()}');

          // Clear form
          _reviewController.clear();
          _subjectController.clear();
          setState(() {
            rating = 1;
          });
          widget.updateReviewed();

          // Dismiss keyboard if open
          FocusScope.of(context).unfocus();

          // Show snackbar success
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Successfully created review'),
              backgroundColor: Colors.green,
            ),
          );

          // Close the dialog if still open after 1 second
          Future.delayed(Duration(seconds: 1), () {
            Navigator.of(context).pop();
          });
        } catch (e) {
          print('Error while creating ticket: $e');

          // Show snackbar error
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Error creating review'),
              backgroundColor: Colors.red,
            ),
          );
        }
      } else {
        try {
          //Create Review object
          Review newReview = Review(
              reviewId: widget.review!.reviewId,
              subject: _subjectController.text,
              description: _reviewController.text,
              starRating: rating);
          Map<String, dynamic> reviewWithVenueId = Map<String, dynamic>();
          reviewWithVenueId['review'] = newReview;
          reviewWithVenueId['venueId'] = widget.venueId;
          Review createdReview = await API().updateReview(reviewWithVenueId);
          print('Response received: ${createdReview.toJsonString()}');

          // Clear form
          _reviewController.clear();
          _subjectController.clear();
          setState(() {
            rating = 1;
          });
          widget.updateReviewed();

          // Dismiss keyboard if open
          FocusScope.of(context).unfocus();

          // Show snackbar success
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Successfully edited review'),
              backgroundColor: Colors.green,
            ),
          );

          // Close the dialog if still open after 1 second
          Future.delayed(Duration(seconds: 1), () {
            Navigator.of(context).pop();
          });
        } catch (e) {
          print('Error while editing review: $e');

          // Show snackbar error
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Error when editing review'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  void updateRating(int newRating) {
    setState(() {
      rating = newRating;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.white,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              children: [
                Text(
                  "Been here before? Leave a review!",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontFamily: 'Montserrat',
                    color: SGWColors.mainBodyColor,
                    fontWeight: FontWeight.w400,
                    fontSize: 20,
                  ),
                ),
                SizedBox(
                  height: 20,
                ),
                TextFormField(
                  controller: _subjectController,
                  decoration: const InputDecoration(
                    labelText: "Subject",
                    border: OutlineInputBorder(
                      // Customize the border
                      borderRadius: BorderRadius.all(
                          Radius.circular(8.0)), // Adjust the radius as needed
                      borderSide: BorderSide(
                        color: Colors.blue, // Border color
                        width: 2.0, // Border width
                      ),
                    ),
                  ),
                  style: TextStyle(
                      fontFamily: 'Montserrat',
                      fontSize: 18,
                      fontWeight: FontWeight.w800),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a title';
                    }
                    return null;
                  },
                  maxLines: 2,
                  maxLength: 50,
                ),
                const SizedBox(height: 30.0),
                TextFormField(
                  style: TextStyle(
                    fontSize: 16,
                    fontFamily: 'Montserrat',
                    fontWeight: FontWeight.w500,
                  ),
                  controller: _reviewController,
                  maxLines: null,
                  decoration: const InputDecoration(
                    labelText: "Description",
                    border: OutlineInputBorder(
                      // Customize the border
                      borderRadius: BorderRadius.all(
                          Radius.circular(8.0)), // Adjust the radius as needed
                      borderSide: BorderSide(
                        color: Colors.blue, // Border color
                        width: 2.0, // Border width
                      ),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a review';
                    }
                    return null;
                  },
                  maxLength: 100,
                ),
                const SizedBox(height: 20.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Ratings: ",
                      style: TextStyle(
                        fontSize: 16,
                        fontFamily: 'Montserrat',
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    ChooseStarRating(
                      currentRating: rating,
                      updateRating: updateRating,
                    ),
                  ],
                ),
                const SizedBox(height: 20.0),
                SensRedStyledButton(
                  text: widget.review == null ? "Add Review" : "Edit Review",
                  onPressed: _createReview,
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
