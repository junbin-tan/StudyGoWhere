import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../screens/venues/venue_details_page.dart';
import '../services/api.dart';

class AdvertisementSpace extends StatefulWidget {
  final Image? advertisement;
  final int? advertId;
  AdvertisementSpace({super.key, this.advertisement, this.advertId});
  final API api = API();

  @override
  _AdvertisementSpaceState createState() => _AdvertisementSpaceState();
}

class _AdvertisementSpaceState extends State<AdvertisementSpace> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        // Send call to backend to retrieve the nearest venueId (advertId, lat, long)
        int nearbyVenueId =
            await widget.api.getNearbyVenueFromAdvertisement(widget.advertId!);
        print("GONNA REDIRECT YOU TO THIS VENUE ID");
        print(nearbyVenueId);
        Future.delayed(const Duration(milliseconds: 500), () {
          Get.to(
            VenueDetailsPage(
              venueId: nearbyVenueId,
            ),
            transition: Transition.fade,
            duration: const Duration(milliseconds: 1500), // Fade-in duration
          );
        });
      },
      child: Hero(
        tag: 'advertisement_hero_${widget.advertId}',
        child: Container(
          width: 300,
          height: 200,
          child: widget.advertisement ?? const FallbackImageWidget(),
        ),
      ),
    );
  }
}

class FallbackImageWidget extends StatelessWidget {
  const FallbackImageWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      height: 300,
      child:
          Image.asset('assets/cafe-image-help-center.jpeg', fit: BoxFit.cover),
    );
  }
}
