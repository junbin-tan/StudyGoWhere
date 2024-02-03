import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';

class ImageSlider extends StatelessWidget {
  List<Widget>? imageSliders;

  ImageSlider({this.imageSliders});

  @override
  Widget build(BuildContext context) {
    return Container(
      child: CarouselSlider(
        options: CarouselOptions(
            autoPlay: false,
            aspectRatio: 2.0,
            enlargeCenterPage: true,
            enableInfiniteScroll: false),
        items: imageSliders ?? [],
      ),
    );
  }
}
