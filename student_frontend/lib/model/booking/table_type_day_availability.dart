import 'availability_period.dart';
import 'booking.dart';
import 'table_type.dart';
import 'table_type_booking-slot.dart';

class TableTypeDayAvailability {
  final int id;
  final List<AvailabilityPeriod> availabilityPeriods;
  final TableType tableType;
  final List<Booking> bookings;
  final List<TableTypeBookingSlot> tableTypeBookingSlots;

  TableTypeDayAvailability({
    required this.id,
    required this.availabilityPeriods,
    required this.tableType,
    required this.bookings,
    required this.tableTypeBookingSlots,
  });

  factory TableTypeDayAvailability.fromJson(Map<String, dynamic> json) {
    return TableTypeDayAvailability(
      id: json['id'],
      availabilityPeriods: (json['availabilityPeriods'] as List)
          .map((item) => AvailabilityPeriod.fromJson(item))
          .toList(),
      tableType: TableType.fromJson(json['tableType']),
      bookings: (json['bookings'] as List)
          .map((item) => Booking.fromJson(item))
          .toList(),
      tableTypeBookingSlots: (json['tableTypeBookingSlots'] as List)
          .map((item) => TableTypeBookingSlot.fromJson(item))
          .toList(),
    );
  }
}
