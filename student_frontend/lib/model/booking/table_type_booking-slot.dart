class TableTypeBookingSlot {
  final int id;
  final String fromDateTime;
  final String toDateTime;
  final int tableTypeId;
  final String tableTypeName;
  final int tablesAvailable;
  final double slotBasePrice;
  final double slotPricePerHalfHour;

  TableTypeBookingSlot({
    required this.id,
    required this.fromDateTime,
    required this.toDateTime,
    required this.tableTypeId,
    required this.tableTypeName,
    required this.tablesAvailable,
    required this.slotBasePrice,
    required this.slotPricePerHalfHour,
  });

  factory TableTypeBookingSlot.fromJson(Map<String, dynamic> json) {
    return TableTypeBookingSlot(
      id: json['id'],
      fromDateTime: json['fromDateTime'],
      toDateTime: json['toDateTime'],
      tableTypeId: json['tableTypeId'],
      tableTypeName: json['tableTypeName'],
      tablesAvailable: json['tablesAvailable'],
      slotBasePrice: json['slotBasePrice'],
      slotPricePerHalfHour: json['slotPricePerHalfHour'],
    );
  }
}
