import 'package:flutter/material.dart';
import 'package:flashy_tab_bar2/flashy_tab_bar2.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:student_frontend/model/booking/booking.dart';
import 'package:student_frontend/model/profile_manager.dart';
import 'package:student_frontend/screens/home_page.dart';
import 'package:student_frontend/screens/qr_scanner_page/qr_scanner_page.dart';
import 'package:student_frontend/services/api.dart';
import 'package:student_frontend/services/colors_list.dart';
import 'package:student_frontend/services/navigation_provider.dart';

class BookingsPage extends StatefulWidget {
  @override
  _BookingsPageState createState() => _BookingsPageState();
}

class _BookingsPageState extends State<BookingsPage> {
  List<Booking> bookings = [];
  List<Booking> filteredBookings = [];
  String filterType = 'All';
  DateTime? selectedDate;
  API api = API();
  bool isLoading = false;
  ColorsList colorsList = ColorsList();

  @override
  void initState() {
    super.initState();
    fetchBookings();
  }

  Future<void> fetchBookings() async {
    setState(() {
      isLoading = true;
    });

    final profileManager = context.read<ProfileManager>();
    int studentId = profileManager.loggedInStudent!.id;

    try {
      List<Booking> fetchedBookings = await api.getBookingByStudent(studentId);
      setState(() {
        bookings = fetchedBookings;
        filteredBookings = List.from(bookings);
      });
    } catch (e) {
      print('Error fetching bookings: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  void _onItemTapped(int index) {
    context.read<NavigationProvider>().setIndex(index);
    switch (index) {
      case 0:
        Get.to(() => MyHomePage());
        break;
      case 1:
        Get.to(() => QRScannerPage());
        break;
      case 2:
        Get.to(() => BookingsPage());
        break;
      default:
        break;
    }
  }

  void cancelBooking(BuildContext context, int bookingId) async {
    // Show confirm cancel booking
    bool confirm = await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Confirm Cancellation"),
          content: const Text("Are you sure you want to cancel this booking?"),
          actions: [
            TextButton(
              child: Text(
                "Cancel",
                style: TextStyle(
                  color: colorsList.blueHomePage,
                ),
              ),
              onPressed: () {
                Navigator.of(context).pop(false);
              },
            ),
            TextButton(
              child: Text("Confirm",
                  style: TextStyle(
                    color: colorsList.blueHomePage,
                  )),
              onPressed: () {
                Navigator.of(context).pop(true);
              },
            ),
          ],
        );
      },
    );

    if (confirm) {
      try {
        await api.cancelBooking(bookingId);
        await fetchBookings();
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Booking cancelled successfully')),
        );
      } catch (e) {
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to cancel booking: $e')),
        );
      }
    }
  }

  void completeBooking(BuildContext context, int bookingId) async {
    // Show confirm cancel booking
    bool confirm = await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Complete Booking"),
          content:
              const Text("Are you sure you want to complete this booking?"),
          actions: [
            TextButton(
              child: Text(
                "Cancel",
                style: TextStyle(
                  color: colorsList.blueHomePage,
                ),
              ),
              onPressed: () {
                Navigator.of(context).pop(false);
              },
            ),
            TextButton(
              child: Text("Confirm",
                  style: TextStyle(
                    color: colorsList.blueHomePage,
                  )),
              onPressed: () {
                Navigator.of(context).pop(true);
              },
            ),
          ],
        );
      },
    );

    if (confirm) {
      try {
        await api.completeBooking(bookingId);
        await fetchBookings();
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Booking completed successfully')),
        );
      } catch (e) {
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to complete booking: $e')),
        );
      }
    }
  }

  Widget bookingItem(Booking booking) {
    DateTime fromDateTime = DateTime.parse(booking.fromDateTime);
    DateTime toDateTime = DateTime.parse(booking.toDateTime);
    DateTime now = DateTime.now();

    String fromTime = DateFormat('HH:mm').format(fromDateTime);
    String toTime = DateFormat('HH:mm').format(toDateTime);
    String period = DateFormat('a').format(fromDateTime).toLowerCase();

    String dayOfMonth = DateFormat('d').format(fromDateTime);
    String month = DateFormat('MMM').format(fromDateTime).toUpperCase();

    bool isWithinBookingTime = now.isAfter(fromDateTime) &&
        now.isBefore(toDateTime) &&
        booking.bookStatus.toLowerCase() == 'reserved';

    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      elevation: 5,
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Column(
              children: [
                Text(
                  dayOfMonth,
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 24,
                      color: Colors.blueGrey[800]),
                ),
                Text(
                  month,
                  style: TextStyle(
                      fontWeight: FontWeight.normal,
                      fontSize: 16,
                      color: Colors.blueGrey[800]),
                ),
              ],
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        booking.bookStatus,
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: booking.bookStatus.toLowerCase() ==
                                        'reserved' ||
                                    booking.bookStatus.toLowerCase() ==
                                        'complete'
                                ? Colors.green
                                : colorsList.blueHomePage),
                      ),
                      const SizedBox(
                        width: 8,
                      ),
                      Text(
                        '$fromTime - $toTime $period',
                        style: const TextStyle(
                            fontSize: 14, color: Colors.black87),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    booking.label,
                    style: const TextStyle(fontSize: 14, color: Colors.black87),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '\$${(booking.billablePrice / 100).toStringAsFixed(2)}',
                    style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.black87,
                        fontFamily: 'Montserrat'),
                  ),
                ],
              ),
            ),
            if (booking.bookStatus.toLowerCase() == 'reserved')
              isWithinBookingTime == true
                  ? TextButton(
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.white,
                        backgroundColor: Colors.redAccent,
                      ),
                      onPressed: () {
                        completeBooking(
                          context,
                          booking.billableId,
                        );
                      },
                      child:
                          const Text('Confirm', style: TextStyle(fontSize: 16)),
                    )
                  : TextButton(
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.white,
                        backgroundColor: Colors.redAccent,
                      ),
                      onPressed: () {
                        cancelBooking(
                          context,
                          booking.billableId,
                        );
                      },
                      child:
                          const Text('Cancel', style: TextStyle(fontSize: 16)),
                    ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    int currentIndex = Provider.of<NavigationProvider>(context).currentIndex;
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text(
          "My Bookings",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w700,
            fontFamily: 'Montserrat',
          ),
        ),
        automaticallyImplyLeading: false,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: filteredBookings.length,
                    itemBuilder: (context, index) =>
                        bookingItem(filteredBookings[index]),
                  ),
                ),
              ],
            ),
      bottomNavigationBar: FlashyTabBar(
        animationCurve: Curves.linear,
        selectedIndex: currentIndex,
        iconSize: 25,
        showElevation: false,
        onItemSelected: _onItemTapped,
        items: [
          FlashyTabBarItem(
            activeColor: Colors.blueGrey[800]!,
            inactiveColor: Colors.grey[500]!,
            icon: const Icon(Icons.home),
            title: const Text('Home'),
          ),
          FlashyTabBarItem(
            activeColor: Colors.blueGrey[800]!,
            inactiveColor: Colors.grey[500]!,
            icon: const Icon(Icons.qr_code_scanner),
            title: const Text("QR Code"),
          ),
          FlashyTabBarItem(
            activeColor: Colors.blueGrey[800]!,
            inactiveColor: Colors.grey[500]!,
            icon: const Icon(Icons.calendar_today),
            title: const Text('Bookings'),
          ),
        ],
      ),
    );
  }
}
