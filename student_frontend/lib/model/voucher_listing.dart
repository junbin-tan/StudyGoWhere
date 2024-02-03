import 'voucher.dart';

class VoucherListing {
  final int voucherListingId;
  final String voucherListingDelistDate;
  final int validityPeriodInDays;
  final String description;
  final double voucherValue;
  final double voucherCost;
  final int voucherStock;
  final bool enabled;
  final String voucherName;
  final List<int> voucherIds;

  VoucherListing({
    required this.voucherListingId,
    required this.voucherListingDelistDate,
    required this.validityPeriodInDays,
    required this.description,
    required this.voucherValue,
    required this.voucherCost,
    required this.voucherStock,
    required this.enabled,
    required this.voucherName,
    required this.voucherIds,
  });

  factory VoucherListing.fromJson(Map<String, dynamic> json) {
    var voucherList = json['vouchers'] as List;
    List<Voucher> vouchers =
        voucherList.map((i) => Voucher.fromJson(i)).toList();
    List<int> voucherIds =
        vouchers.map((voucher) => voucher.billableId).toList();

    return VoucherListing(
      voucherListingId: json['voucherListingId'],
      voucherListingDelistDate: json['voucherListingDelistDate'],
      validityPeriodInDays: json['validityPeriodInDays'],
      description: json['description'],
      voucherValue: json['voucherValue'].toDouble(),
      voucherCost: json['voucherCost'].toDouble(),
      voucherStock: json['voucherStock'],
      enabled: json['enabled'],
      voucherName: json['voucherName'],
      voucherIds: voucherIds,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'voucherListingId': voucherListingId,
      'voucherListingDelistDate': voucherListingDelistDate,
      'validityPeriodInDays': validityPeriodInDays,
      'description': description,
      'voucherValue': voucherValue,
      'voucherCost': voucherCost,
      'voucherStock': voucherStock,
      'enabled': enabled,
      'voucherName': voucherName,
      'voucherIds': voucherIds,
    };
  }

  @override
  String toString() {
    return '''
VoucherListing(
  voucherListingId: $voucherListingId,
  voucherListingDelistDate: $voucherListingDelistDate,
  validityPeriodInDays: $validityPeriodInDays,
  description: $description,
  voucherValue: $voucherValue,
  voucherCost: $voucherCost,
  voucherStock: $voucherStock,
  enabled: $enabled,
  voucherName: $voucherName
)''';
  }
}
