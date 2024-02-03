import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class BoxNavigationIcon extends StatelessWidget {
  final String text;
  final String iconAssetPath;
  final VoidCallback onPressed;

  const BoxNavigationIcon({
    Key? key,
    required this.text,
    required this.iconAssetPath,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onPressed,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18.0),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.5),
                  spreadRadius: 0.3,
                  blurRadius: 0.5,
                  offset: const Offset(0, 0.4),
                ),
              ],
            ),
            child: SvgPicture.asset(
              iconAssetPath,
              height: 36,
              width: 36,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            text,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Colors.black,
              fontWeight: FontWeight.w400,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }
}
