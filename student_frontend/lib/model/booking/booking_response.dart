class BookingResponse {
  final int billableId;
  final String billableName;
  final double billablePrice;
  final String bookStatus;
  final DateTime fromDateTime;
  final DateTime toDateTime;
  final String label;

  BookingResponse({
    required this.billableId,
    required this.billableName,
    required this.billablePrice,
    required this.bookStatus,
    required this.fromDateTime,
    required this.toDateTime,
    required this.label,
  });

  factory BookingResponse.fromJson(Map<String, dynamic> json) {
    return BookingResponse(
      billableId: json['billableId'],
      billableName: json['billableName'],
      billablePrice: json['billablePrice'].toDouble(),
      bookStatus: json['bookStatus'],
      fromDateTime: DateTime.parse(json['fromDateTime']),
      toDateTime: DateTime.parse(json['toDateTime']),
      label: json['label'],
    );
  }
}
