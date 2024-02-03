import 'package:flutter/material.dart';

class AdvertisementImage extends StatelessWidget {
  final String imagePath;
  final double height;

  const AdvertisementImage({
    Key? key,
    required this.imagePath,
    this.height = 120.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: double.infinity,
      decoration: BoxDecoration(
        image: DecorationImage(
          image: AssetImage(imagePath),
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}
