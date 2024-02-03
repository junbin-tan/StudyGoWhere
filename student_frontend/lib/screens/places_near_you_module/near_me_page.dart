import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:student_frontend/screens/places_near_you_module/google_maps_module.dart';
import 'package:student_frontend/screens/venues/closing_time_today.dart';
import 'package:student_frontend/screens/venues/venue_details_page.dart';
import 'package:student_frontend/widgets/venue_card_large.dart';

import '../../services/firebase_image_fetch.dart';

class NearMePage extends StatefulWidget {
  final List<Map<String, dynamic>> nearbyVenues;
  const NearMePage({super.key, required this.nearbyVenues});
  @override
  State<NearMePage> createState() => _NearMePageState();
}

class _NearMePageState extends State<NearMePage> {
  static const Color themeColor = Color.fromARGB(255, 101, 69, 31);

  Future<List<Widget>> loadNearbyVenueCards() async {
    List<Widget> venueCards = [];

    for (var venueDistance in widget.nearbyVenues) {
      Map<String, dynamic> venue = venueDistance['venue'];
      double distance = venueDistance['distance'];
      distance = (distance / 10).round() / 100;
      Image? cafeImage;
      if (venue['displayImagePath'] != null) {
        cafeImage = await getImageFromFirebaseH(venue['displayImagePath']);
      } else {
        cafeImage = null;
      }

      venueCards.add(
        VenueCardLarge(
          cafeLink: VenueDetailsPage(
            venueId: venue['venueId'],
          ),
          hasBooking: false,
          crowdLevel: venue['venueCrowdLevel'],
          storeName: venue['venueName'],
          ratings: "${venueDistance['ratings']}",
          distance: distance,
          priceRating: venue['averagePrice'] ?? 1,
          cafeImage: cafeImage,
          closingTime: extractClosingHour(venue['businessHours']),
        ),
      );
    }

    return venueCards;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 80,
        iconTheme: const IconThemeData(color: themeColor),
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Places Near You",
              style: TextStyle(
                  fontFamily: 'Montserrat',
                  fontWeight: FontWeight.w800,
                  fontSize: 16,
                  color: themeColor),
            ),
            Row(
              children: [
                Text(
                  "Street name",
                  style: TextStyle(
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.w400,
                      fontSize: 14,
                      color: Colors.grey),
                ),
                Icon(
                  Icons.chevron_right,
                  color: Colors.grey,
                )
              ],
            )
          ],
        ),
      ),
      body: Column(
        children: [
          Container(
            height: 250,
            width: double.infinity,
            color: Colors.grey,
            child: GoogleMapModule(
              nearbyVenues: widget.nearbyVenues,
            ),
          ),
          Expanded(
            child: Padding(
                padding: const EdgeInsets.fromLTRB(15.0, 10.0, 15.0, 0),
                child: FutureBuilder<List<Widget>>(
                  future: loadNearbyVenueCards(),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return Center(
                          child: Text(
                        "Loading...",
                        style: TextStyle(color: Colors.grey),
                      ));
                    } else if (snapshot.hasError) {
                      return Text('Error: ${snapshot.error}');
                    } else if (snapshot.hasData) {
                      return ListView(
                        scrollDirection: Axis.vertical,
                        children: snapshot.data!,
                      );
                    } else {
                      return Center(child: Text("No Nearby Venues"));
                    }
                  },
                )),
          )
        ],
      ),
    );
  }
}
