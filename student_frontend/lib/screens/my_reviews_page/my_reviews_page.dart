import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:get/get.dart';
import 'package:student_frontend/model/review.dart';
import 'package:student_frontend/screens/venues/venue_details_page.dart';
import 'package:student_frontend/services/sgw_colors.dart';
import 'package:student_frontend/widgets/review_card_personal.dart';

import '../../services/api.dart';

class MyReviewsPage extends StatefulWidget {
  const MyReviewsPage({super.key});

  @override
  State<MyReviewsPage> createState() => _MyReviewsPageState();
}

class _MyReviewsPageState extends State<MyReviewsPage> {
  final API api = API();
  static Color themeColor = Color.fromARGB(255, 224, 79, 83);
  List<dynamic>? reviews;
  @override
  void initState() {
    super.initState();
    _setReviews();
  }

  Future<void> _setReviews() async {
    List<dynamic> res = await api.getMyReviews();
    setState(() {
      reviews = res;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          backgroundColor: themeColor,
          elevation: 0,
          title: Text("My Reviews"),
        ),
        body: reviews != null
            ? Stack(
                children: [
                  Container(
                    height: 170,
                    color: themeColor,
                  ),
                  SingleChildScrollView(
                    child: Column(
                      children: <Widget>[
                        SizedBox(
                          height: 120,
                        ),
                        Container(
                          padding: EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(
                                  20), // Adjust the radius as needed
                              topRight: Radius.circular(
                                  20), // Adjust the radius as needed
                            ),
                            color: Colors.white,
                          ),
                          child: Column(
                            children: <Widget>[
                              ...?reviews?.map(
                                (e) => Container(
                                  padding: EdgeInsets.all(20),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: <Widget>[
                                      GestureDetector(
                                        onTap: () {
                                          Get.to(VenueDetailsPage(
                                              venueId: e['venueId']));
                                        },
                                        child: ReviewCardPersonal(
                                          review: Review.fromJson(e['review']),
                                          venueName: e['venueName'],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                ],
              )
            : SpinKitCircle(
                color: SGWColors.mainBodyColor,
              ));
  }
}
