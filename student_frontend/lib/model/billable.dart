/*
This billable is temp for menu items
*/

class Billable {
  final int billableId;
  final String billableName;
  final double billablePrice;

  Billable({
    required this.billableId,
    required this.billableName,
    required this.billablePrice,
  });

  factory Billable.fromJson(Map<String, dynamic> json) {
    return Billable(
      billableId: json['billableId'],
      billableName: json['billableName'],
      billablePrice: (json['billablePrice'] as num).toDouble(),
    );
  }
}
