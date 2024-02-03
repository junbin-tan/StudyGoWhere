import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:student_frontend/services/sgw_colors.dart';

class VenueHeader extends StatelessWidget {
  final String venueName;
  final String venueAddress;
  final String venueCrowdLevel;
  final Image? cafeImage;

  const VenueHeader({
    Key? key,
    required this.venueName,
    required this.venueAddress,
    required this.venueCrowdLevel,
    this.cafeImage,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        Container(
          color: SGWColors.themeColor,
          child:
              SizedBox(width: double.infinity, height: 250, child: cafeImage),
        ),
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          child: SizedBox(
            height: 120,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: <Widget>[
                IconButton(
                  icon: const Icon(
                    Icons.chevron_left,
                    color: Colors.white,
                  ),
                  onPressed: () {
                    Get.back();
                  },
                ),
                const Text(
                  "Street Name",
                  style: TextStyle(
                    color: Colors.white,
                    fontFamily: 'Montserrat',
                    fontWeight: FontWeight.w400,
                  ),
                )
              ],
            ),
          ),
        ),
        Positioned(
          top: 140,
          left: 0,
          right: 0,
          child: Container(
            padding: const EdgeInsets.all(10),
            height: 110,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: <Widget>[
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      IntrinsicWidth(
                        child: Container(
                          padding: const EdgeInsets.fromLTRB(5, 0, 5, 0),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(5),
                            color: Colors.white,
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.circle_rounded,
                                size: 10,
                                color: venueCrowdLevel == "GREEN"
                                    ? Colors.green
                                    : venueCrowdLevel == "AMBER"
                                        ? Colors.amber
                                        : Colors.red,
                              ),
                              const SizedBox(
                                width: 5,
                              ),
                              Text(
                                venueCrowdLevel == "GREEN"
                                    ? "available"
                                    : venueCrowdLevel == "AMBER"
                                        ? "busy"
                                        : "full",
                                style: TextStyle(
                                  color: venueCrowdLevel == "GREEN"
                                      ? Colors.green
                                      : venueCrowdLevel == "AMBER"
                                          ? Colors.amber
                                          : Colors.red,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      Text(
                        venueName,
                        style: const TextStyle(
                            color: Colors.white,
                            fontFamily: 'Montserrat',
                            fontWeight: FontWeight.w800,
                            fontSize: 30),
                      ),
                      Text(
                        venueAddress,
                        style: const TextStyle(
                            color: Colors.white,
                            fontFamily: 'Montserrat',
                            fontWeight: FontWeight.w400,
                            fontSize: 14),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
