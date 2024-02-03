import 'package:flutter/material.dart';
import 'package:student_frontend/model/venue.dart';

class HomePageVenueCard extends StatelessWidget {
  final Venue venue;
  final VoidCallback onPressed;

  const HomePageVenueCard({
    Key? key,
    required this.venue,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onPressed,
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ListTile(
              contentPadding: EdgeInsets.all(16.0),
              title: Text(venue.venueName),
              subtitle: Text(
                  'Average Rating: ${venue.getVenueAverageRatings().toStringAsFixed(1)}\n' +
                      'Price: \$${venue.averagePrice.toString()}'),
            ),
            Padding(
              padding: EdgeInsets.only(left: 16.0, right: 16.0, bottom: 16.0),
              child: Text(
                'Crowd level: ${venue.venueCrowdLevel}',
                style: TextStyle(color: Colors.black.withOpacity(0.6)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
