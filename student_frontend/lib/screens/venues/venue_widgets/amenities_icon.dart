import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class AmenitiesIcon extends StatelessWidget {
  final String text;

  const AmenitiesIcon({Key? key, required this.text}) : super(key: key);

  String getSvgPath(String amenity) {
    switch (amenity) {
      case 'Wifi':
        return 'assets/wifi.svg';
      case 'Charging Ports':
        return 'assets/charging_ports.svg';
      case 'Takeaway Available':
        return 'assets/takeaway_available.svg';
      default:
        return 'assets/takeaway_available.svg'; //fallback
    }
  }

  @override
  Widget build(BuildContext context) {
    String svgPath = getSvgPath(text);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 3),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          SvgPicture.asset(
            svgPath,
            width: 15,
            height: 15,
          ),
          const SizedBox(width: 4),
          Text(
            text,
            style: const TextStyle(
              color: Colors.brown,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }
}
