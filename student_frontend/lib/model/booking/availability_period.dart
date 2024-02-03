class AvailabilityPeriod {
  final int id;
  final int numAvailable;
  final String fromTime;
  final String toTime;
  final bool overrideDefaultPrice;
  final double basePrice;
  final double pricePerHalfHour;

  AvailabilityPeriod({
    required this.id,
    required this.numAvailable,
    required this.fromTime,
    required this.toTime,
    required this.overrideDefaultPrice,
    required this.basePrice,
    required this.pricePerHalfHour,
  });

  factory AvailabilityPeriod.fromJson(Map<String, dynamic> json) {
    return AvailabilityPeriod(
      id: json['id'],
      numAvailable: json['numAvailable'],
      fromTime: json['fromTime'],
      toTime: json['toTime'],
      overrideDefaultPrice: json['overrideDefaultPrice'],
      basePrice: json['basePrice'],
      pricePerHalfHour: json['pricePerHalfHour'],
    );
  }
}
