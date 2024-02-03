import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:student_frontend/model/venue.dart';
import 'package:student_frontend/screens/places_near_you_module/near_me_page.dart';
import 'package:student_frontend/screens/venues/venue_details_page.dart';
import 'package:student_frontend/services/colors_list.dart';
// Removed the firebase_image_fetch import since it's not directly used here now
import 'package:student_frontend/widgets/venue_card_small.dart';

class NearbyVenuesListSection extends StatefulWidget {
  final List<Venue> venues;
  final List<Map<String, dynamic>> rawVenues;
  final Function(Venue) onVenuePressed;

  const NearbyVenuesListSection({
    Key? key,
    required this.venues,
    required this.rawVenues,
    required this.onVenuePressed,
  }) : super(key: key);

  @override
  _NearbyVenuesListSectionState createState() =>
      _NearbyVenuesListSectionState();
}

class _NearbyVenuesListSectionState extends State<NearbyVenuesListSection> {
  ColorsList colorsList = ColorsList();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color.fromARGB(252, 255, 249, 249),
      padding: const EdgeInsets.only(left: 4.0, right: 4.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.start,
        children: <Widget>[
          Transform.translate(
            offset: const Offset(0, 0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                const SizedBox(width: 7),
                Text(
                  'PLACES NEAR YOU',
                  style: TextStyle(
                    color: colorsList.blueHomePage,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(
                  width: 10,
                ),
                InkWell(
                  onTap: () {
                    print("TAPPED");
                    Get.to(NearMePage(nearbyVenues: widget.rawVenues));
                  },
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text(
                      'View more..',
                      style: TextStyle(
                        color: colorsList.blueHomePage,
                        fontWeight: FontWeight.w400,
                        fontSize: 8,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Transform.translate(
            offset: const Offset(0, 0),
            child: widget.venues.isNotEmpty
                ? Padding(
                    padding: EdgeInsets.zero,
                    child: GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 1,
                        mainAxisSpacing: 1,
                        childAspectRatio: 0.8,
                      ),
                      itemCount: widget.venues.length,
                      itemBuilder: (context, index) {
                        final venue = widget.venues[index];
                        final rawVenue = widget.rawVenues[index];

                        double distance = rawVenue['distance'];
                        distance = (distance / 10).round() / 100;

                        return VenueCardSmall(
                          cafeLink: VenueDetailsPage(
                            venueId: venue.venueId!,
                          ),
                          crowdLevel: venue.venueCrowdLevel,
                          storeName: venue.venueName,
                          ratings: "${venue.getVenueAverageRatings()}",
                          distance: distance,
                          cafeImage: Image.network(venue.imageUrl),
                        );
                      },
                    ),
                  )
                : const Center(child: Text("No Nearby Venues")),
          ),
        ],
      ),
    );
  }
}
