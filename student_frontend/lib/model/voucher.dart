class Voucher {
  final int billableId;
  final double billablePrice;
  final String voucherName;
  final double voucherValue;
  final String voucherCode;
  final String voucherExpiryDate;
  final String voucherStatusEnum;
  final String? activationTime;
  final String voucherApplicableVenue;
  final bool active;

  Voucher({
    required this.billableId,
    required this.billablePrice,
    required this.voucherName,
    required this.voucherValue,
    required this.voucherCode,
    required this.voucherExpiryDate,
    required this.voucherStatusEnum,
    this.activationTime,
    required this.voucherApplicableVenue,
    required this.active,
  });

  factory Voucher.fromJson(Map<String, dynamic> json) {
    return Voucher(
      billableId: json['billableId'],
      billablePrice: json['billablePrice'].toDouble(),
      voucherName: json['voucherName'],
      voucherValue: json['voucherValue'].toDouble(),
      voucherCode: json['voucherCode'],
      voucherExpiryDate: json['voucherExpiryDate'],
      voucherStatusEnum: json['voucherStatusEnum'],
      activationTime: json['activationTime'],
      voucherApplicableVenue: json['voucherApplicableVenue'],
      active: json['active'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'billableId': billableId,
      'billablePrice': billablePrice,
      'voucherName': voucherName,
      'voucherValue': voucherValue,
      'voucherCode': voucherCode,
      'voucherExpiryDate': voucherExpiryDate,
      'voucherStatusEnum': voucherStatusEnum,
      'activationTime': activationTime,
      'voucherApplicableVenue': voucherApplicableVenue,
      'active': active,
    };
  }
}
