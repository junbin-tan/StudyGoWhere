class MenuItemQuantity {
  final int menuItemId;
  final int quantity;

  MenuItemQuantity({
    required this.menuItemId,
    required this.quantity,
  });

  Map<String, dynamic> toJson() {
    return {
      'menuItemId': menuItemId,
      'quantity': quantity,
    };
  }
}
