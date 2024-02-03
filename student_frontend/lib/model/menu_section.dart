import 'package:student_frontend/model/menu_item.dart';

class MenuSection {
  final int menuSectionId;
  final String menuSectionName;
  final String menuSectionDescription;
  final List<MenuItem> menuItems;

  MenuSection({
    required this.menuSectionId,
    required this.menuSectionName,
    required this.menuSectionDescription,
    required this.menuItems,
  });

  factory MenuSection.fromJson(Map<String, dynamic> json) {
    return MenuSection(
      menuSectionId: json['menuSectionId'],
      menuSectionName: json['menuSectionName'],
      menuSectionDescription: json['menuSectionDescription'],
      menuItems: List<MenuItem>.from(
          json['menuItems'].map((x) => MenuItem.fromJson(x))),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'menuSectionId': menuSectionId,
      'menuSectionName': menuSectionName,
      'menuSectionDescription': menuSectionDescription,
      'menuItems': List<dynamic>.from(menuItems.map((x) => x.toJson())),
    };
  }

  @override
  String toString() {
    var sb = StringBuffer();
    sb.writeln('MenuSection:');
    sb.writeln('  menuSectionId: $menuSectionId');
    sb.writeln('  menuSectionName: $menuSectionName');
    sb.writeln('  menuSectionDescription: $menuSectionDescription');
    sb.writeln('  menuItems:');
    for (var item in menuItems) {
      sb.writeln('    - ${item.toString().replaceAll('\n', '\n    ')}');
    }
    return sb.toString();
  }
}
