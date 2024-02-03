class MenuItem {
  final int menuItemId;
  final String menuItemName;
  final String menuItemDescription;
  String imageURL;
  final double sellingPrice;
  final double costPrice;
  final bool enabled;
  final bool adminBanned;
  final double voucherMultiplier;

  MenuItem({
    required this.menuItemId,
    required this.menuItemName,
    required this.menuItemDescription,
    required this.imageURL,
    required this.sellingPrice,
    required this.costPrice,
    required this.enabled,
    required this.adminBanned,
    required this.voucherMultiplier,
  });

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    return MenuItem(
      menuItemId: json['menuItemId'],
      menuItemName: json['menuItemName'],
      menuItemDescription: json['menuItemDescription'],
      imageURL: json['imageURL'],
      sellingPrice: json['sellingPrice'].toDouble(),
      costPrice: json['costPrice'].toDouble(),
      enabled: json['enabled'],
      adminBanned: json['adminBanned'],
      voucherMultiplier: json['voucherMultiplier'].toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'menuItemId': menuItemId,
      'menuItemName': menuItemName,
      'menuItemDescription': menuItemDescription,
      'imageURL': imageURL,
      'sellingPrice': sellingPrice,
      'costPrice': costPrice,
      'enabled': enabled,
      'adminBanned': adminBanned,
      'voucherMultiplier': voucherMultiplier,
    };
  }

  @override
  String toString() {
    return '''
MenuItem:
  menuItemId: $menuItemId
  menuItemName: $menuItemName
  menuItemDescription: $menuItemDescription
  imageURL: $imageURL
  sellingPrice: $sellingPrice
  costPrice: $costPrice
  enabled: $enabled
  adminBanned: $adminBanned
  voucherMultiplier: $voucherMultiplier
''';
  }
}
