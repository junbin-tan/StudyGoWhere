// ignore_for_file: use_build_context_synchronously

import 'dart:math';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:student_frontend/model/booking/table_type_booking-slot.dart';
import 'package:student_frontend/model/booking/venue_booking_day.dart';
import 'package:intl/intl.dart';
import 'package:student_frontend/screens/bookings_page/bookings_page.dart';
import 'package:student_frontend/services/api.dart';
import 'package:student_frontend/services/colors_list.dart';

class VenueBookingPage extends StatefulWidget {
  final int venueId;
  final List<VenueBookingDay> bookingSlots;
  final String venueName;
  final String venueAddress;
  final int studentId;

  VenueBookingPage({
    Key? key,
    required this.venueId,
    required this.bookingSlots,
    required this.venueName,
    required this.venueAddress,
    required this.studentId,
  }) : super(key: key);

  @override
  _VenueBookingPageState createState() => _VenueBookingPageState();
}

class _VenueBookingPageState extends State<VenueBookingPage> {
  DateTime selectedDate = DateTime.now();
  String? selectedTableType;
  List<int> selectedBookingSlotIds = [];
  ColorsList colorsList = ColorsList();
  API api = API();

  List<TableTypeBookingSlot> getSelectedSlots() {
    List<TableTypeBookingSlot> selectedSlots = [];
    for (var day in widget.bookingSlots) {
      for (var availability in day.tableTypeDayAvailabilities) {
        for (var slot in availability.tableTypeBookingSlots) {
          if (selectedBookingSlotIds.contains(slot.id)) {
            selectedSlots.add(slot);
          }
        }
      }
    }
    return selectedSlots;
  }

  double calculateTotalPrice(List<TableTypeBookingSlot> selectedSlots) {
    double highestBasePrice = 0.0;
    double totalSlotPricePerHalfHour = 0.0;

    for (var slot in selectedSlots) {
      DateTime start = DateTime.parse(slot.fromDateTime);
      DateTime end = DateTime.parse(slot.toDateTime);
      int durationInMinutes = end.difference(start).inMinutes;

      highestBasePrice = max(highestBasePrice, slot.slotBasePrice);
      totalSlotPricePerHalfHour +=
          slot.slotPricePerHalfHour * (durationInMinutes / 30);
    }

    double totalPrice = highestBasePrice + totalSlotPricePerHalfHour;
    return totalPrice / 100;
  }

  Future<void> showConfirmationDialog() async {
    List<TableTypeBookingSlot> selectedSlots = getSelectedSlots();
    double totalPrice = calculateTotalPrice(selectedSlots);

    bool? confirm = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Confirm Booking'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Text('You have selected ${selectedSlots.length} slots.'),
              Text('Total Price: \$${totalPrice.toStringAsFixed(2)}'),
            ],
          ),
          actions: <Widget>[
            TextButton(
              child: Text(
                'Cancel',
                style: TextStyle(
                  color: colorsList.blueHomePage,
                ),
              ),
              onPressed: () => Navigator.of(context).pop(false),
            ),
            TextButton(
              child: Text(
                'Confirm',
                style: TextStyle(
                  color: colorsList.blueHomePage,
                ),
              ),
              onPressed: () => Navigator.of(context).pop(true),
            ),
          ],
        );
      },
    );

    if (confirm == true) {
      await bookingCheckout(
          widget.venueId, widget.studentId, selectedBookingSlotIds);
    }
  }

  Future<void> bookingCheckout(
      int venueId, int studentId, List<int> selectedBookingSlotIds) async {
    try {
      var bookingResponse = await api.createBooking(
        venueId,
        studentId,
        selectedBookingSlotIds,
      );

      print("Booking created successfully, Slots: $selectedBookingSlotIds");
      print(bookingResponse.toString());

      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Booking Successful'),
            content: const Text('Your booking has been successfully created.'),
            actions: <Widget>[
              TextButton(
                child: Text('OK',
                    style: TextStyle(color: colorsList.blueHomePage)),
                onPressed: () {
                  Get.off(BookingsPage());
                },
              ),
            ],
          );
        },
      );

      // Clear the selected booking slots
      setState(() {
        selectedBookingSlotIds.clear();
      });
    } catch (e) {
      print("Error during booking: $e");

      // Show error message
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Error'),
            content: const Text('Failed to create booking. Please try again.'),
            actions: <Widget>[
              TextButton(
                child: Text('OK',
                    style: TextStyle(color: colorsList.blueHomePage)),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (BuildContext context, Widget? child) {
        return Theme(
          data: ThemeData.light().copyWith(
            primaryColor: colorsList.blueHomePage,
            colorScheme: ColorScheme.light(primary: colorsList.blueHomePage),
            buttonTheme:
                const ButtonThemeData(textTheme: ButtonTextTheme.primary),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
        selectedTableType = null;
        selectedBookingSlotIds.clear();
      });
    }
  }

  bool isSameDay(DateTime date1, DateTime date2) {
    return date1.year == date2.year &&
        date1.month == date2.month &&
        date1.day == date2.day;
  }

// SECTION 1: Venue Details
  Widget _buildVenueDetails() {
    return Container(
      padding: const EdgeInsets.only(left: 16.0, top: 16.0, right: 16.0),
      alignment: Alignment.centerLeft,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            widget.venueName,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: colorsList.blueHomePage,
              fontSize: 24,
            ),
          ),
          Text(
            widget.venueAddress,
            style: const TextStyle(
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDateSelectionAndSlots() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const Divider(),
          Text(
            'Select Date',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: colorsList.blueHomePage,
              fontSize: 24,
            ),
          ),
          const SizedBox(
            height: 10,
          ),
          Row(
            children: [
              Expanded(
                child: Row(
                  children: [
                    Expanded(
                      child: Theme(
                        data: ThemeData.light().copyWith(
                          inputDecorationTheme: InputDecorationTheme(
                            focusedBorder: OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: colorsList.blueHomePage),
                            ),
                          ),
                        ),
                        child: TextFormField(
                          readOnly: true,
                          controller: TextEditingController(
                            text: selectedDate != null
                                ? DateFormat('yyyy-MM-dd').format(selectedDate)
                                : '',
                          ),
                          decoration: const InputDecoration(
                            hintText: 'Select Date',
                            border: OutlineInputBorder(),
                          ),
                          onTap: () {
                            _selectDate(context);
                          },
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.calendar_today),
                      onPressed: () {
                        _selectDate(context);
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16.0),
          const Divider(),
          Text(
            'Select Table Type',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: colorsList.blueHomePage,
              fontSize: 24,
            ),
          ),
          _buildTableTypeDropdown(),
          if (selectedTableType != null) ...[
            _buildBookingSlots(),
          ],
        ],
      ),
    );
  }

  Widget _buildDatePill(String label, DateTime date) {
    bool isSelected = isSameDay(selectedDate, date);

    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      selectedColor: Colors.blue, // Color when selected
      onSelected: (bool selected) {
        setState(() {
          if (selected) {
            selectedDate = date;
            selectedTableType = null;
            selectedBookingSlotIds.clear();
          }
        });
      },
      labelStyle: TextStyle(color: isSelected ? Colors.white : Colors.black),
    );
  }

  Widget _buildTableTypeDropdown() {
    List<String> tableTypes = widget.bookingSlots
        .expand((day) => day.tableTypeDayAvailabilities)
        .map((availability) => availability.tableType.name)
        .toSet()
        .toList();

    if (tableTypes.isEmpty) {
      return const Center(child: Text('No Table Types Available'));
    }

    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: DropdownButton<String>(
        value: selectedTableType,
        hint: const Text("Select Table Type"),
        icon: const Icon(Icons.arrow_drop_down_outlined),
        iconSize: 24,
        elevation: 16,
        style: const TextStyle(color: Colors.black),
        underline: Container(
          height: 1,
          color: Colors.black,
        ),
        items: tableTypes.map<DropdownMenuItem<String>>((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(value),
          );
        }).toList(),
        onChanged: (String? newValue) {
          setState(() {
            selectedTableType = newValue;
            selectedBookingSlotIds.clear();
          });
        },
      ),
    );
  }

// SECTION 3: Booking Slots
  Widget _buildBookingSlots() {
    var filteredSlots = widget.bookingSlots
        .where(
            (day) => day.date == DateFormat('yyyy-MM-dd').format(selectedDate))
        .expand((day) => day.tableTypeDayAvailabilities)
        .where(
            (availability) => availability.tableType.name == selectedTableType)
        .expand((availability) => availability.tableTypeBookingSlots)
        .where((slot) => slot.tablesAvailable > 0)
        .toList();

    // Sort by ascending time
    filteredSlots.sort((a, b) => a.fromDateTime.compareTo(b.fromDateTime));

    // Check if there are no booking slots available
    if (filteredSlots.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 16.0),
        child: Center(
          child: Text(
            'No booking slots available',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.black,
              fontSize: 16,
            ),
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Text('Select Booking Slots',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: colorsList.blueHomePage,
                fontSize: 24,
              )),
        ),
        Wrap(
          spacing: 16.0,
          runSpacing: 4.0,
          children:
              filteredSlots.map((slot) => _buildBookingPill(slot)).toList(),
        ),
      ],
    );
  }

  Widget _buildBookingPill(TableTypeBookingSlot slot) {
    bool isSelected = selectedBookingSlotIds.contains(slot.id);

    DateTime startTime = DateTime.parse(slot.fromDateTime);
    DateTime endTime = DateTime.parse(slot.toDateTime);

    String formattedStartTime = DateFormat('HH:mm').format(startTime);
    String formattedEndTime = DateFormat('HH:mm').format(endTime);

    bool isPastSlot = endTime.isBefore(DateTime.now());

    return ChoiceChip(
      label: Text('$formattedStartTime - $formattedEndTime'),
      selected: isSelected && !isPastSlot,
      backgroundColor: isPastSlot
          ? Colors.grey
          : (isSelected ? _getSlotColor(slot) : Colors.white),
      selectedColor: isPastSlot
          ? Colors.grey
          : colorsList.blueHomePage, // Color when selected
      onSelected: isPastSlot
          ? null
          : (bool selected) {
              setState(() {
                if (selected) {
                  selectedBookingSlotIds.add(slot.id);
                } else {
                  selectedBookingSlotIds.remove(slot.id);
                }
              });
            },
      labelStyle: TextStyle(
          color: isPastSlot
              ? Colors.black
              : (isSelected ? Colors.white : Colors.black)),
      // Define border for unselected state
      side:
          isSelected ? BorderSide.none : const BorderSide(color: Colors.black),
    );
  }

  Color _getSlotColor(TableTypeBookingSlot slot) {
    return slot.tablesAvailable > 0 ? Colors.grey : colorsList.blueHomePage;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text(
          'Booking',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w700,
            fontFamily: 'Montserrat',
          ),
        ),
        automaticallyImplyLeading: false,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            _buildVenueDetails(),
            _buildDateSelectionAndSlots(),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: colorsList.blueHomePage,
        onPressed: () {
          showConfirmationDialog();
        },
        child: const Icon(Icons.check),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }
}
