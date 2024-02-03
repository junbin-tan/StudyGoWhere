import 'package:flutter/material.dart';

class NavigationIconRow extends StatelessWidget {
  final List<Widget> icons;

  const NavigationIconRow({
    Key? key,
    required this.icons,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: icons,
      ),
    );
  }
}
