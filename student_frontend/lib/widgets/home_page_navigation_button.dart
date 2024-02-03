import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class HomePageNavigationButton extends StatelessWidget {
  final String text;
  final String subtext;
  final String iconAssetPath;
  final VoidCallback onPressed;

  const HomePageNavigationButton({
    Key? key,
    required this.text,
    required this.subtext,
    required this.iconAssetPath,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.white,
        foregroundColor: Colors.brown[800]!,
        side: const BorderSide(color: Colors.brown, width: 1),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(7),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.max,
        children: [
          SvgPicture.asset(iconAssetPath, height: 24, width: 24),
          const SizedBox(width: 8),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                text,
                style:
                    const TextStyle(fontSize: 17, fontWeight: FontWeight.w400),
              ),
              Text(subtext,
                  style: const TextStyle(
                      fontSize: 9.3, fontWeight: FontWeight.w400)),
            ],
          ),
        ],
      ),
    );
  }
}
