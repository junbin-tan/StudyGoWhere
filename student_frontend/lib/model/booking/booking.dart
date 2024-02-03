class Booking {
  final int billableId;
  final String billableName;
  final double billablePrice;
  final String bookStatus;
  final String fromDateTime;
  final String toDateTime;
  final String label;

  Booking({
    required this.billableId,
    required this.billableName,
    required this.billablePrice,
    required this.bookStatus,
    required this.fromDateTime,
    required this.toDateTime,
    required this.label,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      billableId: json['billableId'],
      billableName: json['billableName'],
      billablePrice: json['billablePrice'],
      bookStatus: json['bookStatus'],
      fromDateTime: json['fromDateTime'],
      toDateTime: json['toDateTime'],
      label: json['label'],
    );
  }
}
