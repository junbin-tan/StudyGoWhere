import 'package:flutter/material.dart';

class CustomBottomNavigationBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onItemTapped;

  const CustomBottomNavigationBar({
    Key? key,
    required this.currentIndex,
    required this.onItemTapped,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        BottomNavigationBar(
          items: [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(null), // This is to hold space for the middle button
              label: '',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.calendar_today),
              label: 'Bookings',
            ),
          ],
          currentIndex: currentIndex,
          selectedItemColor: Colors.brown[500],
          onTap: onItemTapped,
        ),
        Positioned(
          bottom: 10,
          left: MediaQuery.of(context).size.width / 2 - 35,
          child: Container(
            width: 70,
            height: 70,
            child: FittedBox(
              child: FloatingActionButton(
                heroTag: 'fakebutton',
                onPressed: () {
                  // Add your QR code scanning function here
                },
                tooltip: 'Increment',
                child: const Icon(Icons.qr_code),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
