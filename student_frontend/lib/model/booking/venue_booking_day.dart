import 'table_type_day_availability.dart';

class VenueBookingDay {
  final int id;
  final String date;
  final bool published;
  final List<TableTypeDayAvailability> tableTypeDayAvailabilities;

  VenueBookingDay({
    required this.id,
    required this.date,
    required this.published,
    required this.tableTypeDayAvailabilities,
  });

  factory VenueBookingDay.fromJson(Map<String, dynamic> json) {
    return VenueBookingDay(
      id: json['id'],
      date: json['date'],
      published: json['published'],
      tableTypeDayAvailabilities: (json['tableTypeDayAvailabilities'] as List)
          .map((item) => TableTypeDayAvailability.fromJson(item))
          .toList(),
    );
  }
}
