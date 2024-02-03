import 'package:intl/intl.dart';

// Define a function to extract today's closing hour in 12-hour format
String extractClosingHour(Map<String, dynamic> businessHours) {
  // Get the current day of the week (e.g., "mon", "tue", etc.)
  final currentDay = DateFormat('E').format(DateTime.now()).toLowerCase();

  // Check if the current day exists in the business hours
  if (businessHours.containsKey(currentDay)) {
    final todayBusinessHours = businessHours[currentDay];

    // Find the closing hour and minute for the current day
    if (todayBusinessHours is List && todayBusinessHours.isNotEmpty) {
      int closingHour24hr = 0;
      int closingMinute = 0;
      final currentHour = DateTime.now().hour;
      final currentMinute = DateTime.now().minute;
      //Sort business hours
      todayBusinessHours.sort((x, y) =>
          int.parse(x['fromTime'].split(":")[0]) -
          int.parse(y['fromTime'].split(":")[0]));

      for (int i = 0; i < todayBusinessHours.length; i++) {
        final entry = todayBusinessHours[i];
        final fromTime = entry['fromTime'];
        final toTime = entry['toTime'];
        // Convert the closing time to 24-hour format
        final toTimeParts = toTime.split(':');
        final fromTimeParts = fromTime.split(':');
        final closingHour24hr = int.parse(toTimeParts[0]);
        final closingMinute = int.parse(toTimeParts[1]);
        final openingHour24hr = int.parse(fromTimeParts[0]);
        final openingMinute = int.parse(fromTimeParts[1]);
        if (i == todayBusinessHours.length - 1) {
          if (currentHour > closingHour24hr ||
              (currentHour == closingHour24hr &&
                  currentMinute > closingMinute)) {
            return 'Closed';
          }
          final closingHourDateTime = DateFormat('HH:mm:ss').parse(toTime);
          final closingHour12hrFormat =
              DateFormat('h:mm a').format(closingHourDateTime);
          return 'Closing $closingHour12hrFormat';
        }
        if ((currentHour == openingHour24hr &&
                currentMinute >= openingMinute) ||
            (currentHour > openingHour24hr && currentHour < closingHour24hr) ||
            (currentHour == closingHour24hr &&
                currentMinute <= closingMinute)) {
          final closingHourDateTime = DateFormat('HH:mm:ss').parse(toTime);
          final closingHour12hrFormat =
              DateFormat('h:mm a').format(closingHourDateTime);
          // Convert the closing hour to 12-hour format
          return 'Currently open. Break @ $closingHour12hrFormat';
        }
        final nextEntry = todayBusinessHours[i + 1];
        final fromNextTimeParts = nextEntry['fromTime'].split(':');
        final nextOpeningHour24hr = int.parse(fromNextTimeParts[0]);
        final nextOpeningMinute = int.parse(fromNextTimeParts[1]);
        if (((currentHour == closingHour24hr &&
                    currentMinute > closingMinute) ||
                (currentHour > closingHour24hr)) &&
            ((currentHour < nextOpeningHour24hr) ||
                (currentHour == nextOpeningHour24hr &&
                    currentMinute < nextOpeningMinute))) {
          final resumingHourDateTime =
              DateFormat('HH:mm:ss').parse(nextEntry['fromTime']);
          final closingHour12hrFormat =
              DateFormat('h:mm a').format(resumingHourDateTime);
          return "On break. Resuming @ $closingHour12hrFormat";
        }
      }
    }
  }

  // Return a message indicating that it's closed on the current day
  return 'Closed Today';
}
