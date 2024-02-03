import 'package:flutter/material.dart';
import 'package:get/get.dart';

class VenueCardSmall extends StatelessWidget {
  final String? storeName;
  final Image? cafeImage;
  final dynamic cafeLink;
  final String? crowdLevel;
  final double? distance;
  final String? ratings;

  const VenueCardSmall({
    Key? key,
    this.storeName,
    this.cafeImage,
    this.cafeLink,
    this.crowdLevel,
    this.distance,
    this.ratings,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double totalHeight = 210;
    double imageHeight = totalHeight * 0.7;
    double boxHeight = totalHeight * 0.3;
    double width = 180;

    String crowdText;
    Color crowdColor;

    if (crowdLevel == "GREEN") {
      crowdText = "Available ";
      crowdColor = Colors.green;
    } else if (crowdLevel == "AMBER") {
      crowdText = "Busy ";
      crowdColor = Colors.amber;
    } else {
      crowdText = "Full ";
      crowdColor = Colors.red;
    }

    return GestureDetector(
      onTap: () {
        try {
          Get.to(cafeLink);
        } catch (e) {
          print("NO ROUTE");
        }
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 5, vertical: 5),
        width: width,
        height: totalHeight,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10.0),
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.5),
              spreadRadius: 1,
              blurRadius: 1,
              offset: Offset(0, 1),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Stack(
            children: <Widget>[
              Container(
                height: imageHeight,
                width: width,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: cafeImage?.image ??
                        AssetImage("assets/default_cafe_logo.jpg"),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              Positioned(
                top: 8,
                left: 8,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.3),
                        spreadRadius: 1,
                        blurRadius: 1,
                        offset: Offset(0, 1),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: crowdColor,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        crowdText,
                        style: const TextStyle(
                          fontSize: 12,
                          fontFamily: 'Montserrat',
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Positioned(
                bottom: 0,
                child: Container(
                  color: Colors.white,
                  height: boxHeight,
                  width: width,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 8.0, vertical: 4.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        "$storeName",
                        style: const TextStyle(
                            fontFamily: 'Montserrat',
                            fontWeight: FontWeight.w500,
                            fontSize: 15,
                            color: Colors.black),
                      ),
                      Row(
                        children: <Widget>[
                          Text(
                            "${distance}km",
                            style: const TextStyle(
                                fontFamily: 'Montserrat',
                                fontWeight: FontWeight.w500,
                                fontSize: 13,
                                color: Colors.grey),
                          ),
                          const SizedBox(
                            width: 10,
                          ),
                          const Icon(
                            Icons.star,
                            size: 12,
                          ),
                          Text(
                            "$ratings",
                            style: const TextStyle(
                              fontSize: 13,
                              fontFamily: 'Montserrat',
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(
                            width: 10,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
