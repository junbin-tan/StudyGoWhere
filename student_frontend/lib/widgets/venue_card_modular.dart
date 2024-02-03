import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:student_frontend/services/sgw_colors.dart';
import 'package:student_frontend/widgets/price_rating.dart';

class VenueCardModular extends StatelessWidget {
  final bool hasBooking;
  final String storeName;
  final double distance;
  final String ratings;
  final String crowdLevel;
  final String cafeImage;
  final dynamic cafeLink;
  final int priceRating;
  final String closingTime;

  const VenueCardModular(
      {Key? key,
      required this.cafeImage,
      required this.hasBooking,
      required this.crowdLevel,
      this.cafeLink,
      required this.distance,
      required this.ratings,
      required this.storeName,
      required this.priceRating,
      required this.closingTime})
      : super(key: key);

  static const Color themeColor = Color.fromARGB(255, 101, 69, 31);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        try {
          Get.to(cafeLink);
        } catch (e) {
          print("NO ROUTE");
        }
      },
      child: Container(
        margin: EdgeInsets.all(5),
        height: 100,
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 5,
                spreadRadius: 0,
                offset: Offset(0, 1.0))
          ],
          borderRadius: BorderRadius.circular(20),
          color: Colors.white,
        ),
        child: Row(
          children: [
            CafeImageWidget(cafeImage: cafeImage, crowdLevel: crowdLevel),
            Expanded(
              child: VenueInfoWidget(
                closingTime: closingTime,
                storeName: storeName,
                distance: distance,
                priceRating: priceRating,
                hasBooking: hasBooking,
                ratings: ratings,
              ),
            )
          ],
        ),
      ),
    );
  }
}

class CafeImageWidget extends StatelessWidget {
  final String cafeImage;
  final String crowdLevel;

  CafeImageWidget({required this.cafeImage, required this.crowdLevel});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              color: SGWColors.themeColor,
            ),
            child: Image.network(
                  cafeImage,
                  fit: BoxFit.cover,
                ) ??
                Image.asset(
                  "assets/default_cafe_logo.jpg",
                  fit: BoxFit.fitHeight,
                ),
          ),
        ),
        CrowdLevelIndicator(crowdLevel: crowdLevel),
      ],
    );
  }
}

class CrowdLevelIndicator extends StatelessWidget {
  final String crowdLevel;

  CrowdLevelIndicator({required this.crowdLevel});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 5,
      left: 5,
      child: IntrinsicWidth(
        child: Container(
          padding: EdgeInsets.fromLTRB(5, 0, 5, 0),
          height: 20,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            color: Colors.white,
          ),
          child: Row(
            children: [
              Icon(
                Icons.circle_rounded,
                size: 10,
                color: crowdLevel == "GREEN"
                    ? Colors.green
                    : crowdLevel == "AMBER"
                        ? Colors.amber
                        : Colors.red,
              ),
              SizedBox(
                width: 5,
              ),
              Text(
                crowdLevel == "GREEN"
                    ? "available"
                    : crowdLevel == "AMBER"
                        ? "busy"
                        : "full",
                style: TextStyle(
                  fontSize: 12,
                  color: crowdLevel == "GREEN"
                      ? Colors.green
                      : crowdLevel == "AMBER"
                          ? Colors.amber
                          : Colors.red,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class VenueInfoWidget extends StatelessWidget {
  final String storeName;
  final double distance;
  final int priceRating;
  final bool hasBooking;
  final String closingTime;
  final String ratings;

  VenueInfoWidget(
      {required this.storeName,
      required this.distance,
      required this.priceRating,
      required this.hasBooking,
      required this.closingTime,
      required this.ratings});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(10),
      width: 130,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.horizontal(right: Radius.circular(20)),
      ),
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                "$storeName",
                style: TextStyle(
                  fontFamily: 'Montserrat',
                  fontWeight: FontWeight.w500,
                  fontSize: 15,
                  color: VenueCardModular.themeColor,
                ),
              ),
              Row(
                children: <Widget>[
                  Text(
                    "${distance}km",
                    style: TextStyle(
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.w500,
                      fontSize: 13,
                      color: Colors.grey,
                    ),
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Icon(
                    Icons.star,
                    size: 12,
                  ),
                  Text(
                    ratings,
                    style: TextStyle(
                      fontSize: 13,
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  PriceRating(
                    rating: priceRating,
                    fontSize: 14,
                  )
                ],
              ),
              Container(
                width: 140,
                child: Text(
                  closingTime,
                  softWrap: true,
                  style: TextStyle(
                    fontSize: 13,
                    fontFamily: 'Montserrat',
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          Positioned(
            bottom: 0,
            right: 0,
            child: BookButton(hasBooking: hasBooking),
          )
        ],
      ),
    );
  }
}

class BookButton extends StatelessWidget {
  final bool hasBooking;

  BookButton({required this.hasBooking});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {
        print("Book Venue");
      },
      style: ButtonStyle(
        minimumSize: MaterialStateProperty.all(Size(60, 30)),
        side: MaterialStateProperty.all(
            BorderSide(color: Colors.black, width: 1)),
        backgroundColor: MaterialStateProperty.all(
            !hasBooking ? Colors.grey : VenueCardModular.themeColor),
      ),
      child: Text(
        "Book",
        style: TextStyle(
          color: !hasBooking ? Colors.black : Colors.white,
          fontFamily: 'Montserrat',
          fontWeight: FontWeight.w500,
          fontSize: 13,
        ),
      ),
    );
  }
}
