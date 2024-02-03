class TableType {
  final int id;
  final String name;
  final String description;
  final double basePrice;
  final double pricePerHalfHour;
  final int seats;
  final bool deleted;

  TableType({
    required this.id,
    required this.name,
    required this.description,
    required this.basePrice,
    required this.pricePerHalfHour,
    required this.seats,
    required this.deleted,
  });

  factory TableType.fromJson(Map<String, dynamic> json) {
    return TableType(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      basePrice: json['basePrice'],
      pricePerHalfHour: json['pricePerHalfHour'],
      seats: json['seats'],
      deleted: json['deleted'],
    );
  }
}
