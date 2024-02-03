import 'package:student_frontend/model/menu_section.dart';

class Menu {
  final int menuId;
  final String menuName;
  final String menuDescription;
  final List<MenuSection> menuSections;

  Menu({
    required this.menuId,
    required this.menuName,
    required this.menuDescription,
    required this.menuSections,
  });

  factory Menu.fromJson(Map<String, dynamic> json) {
    return Menu(
      menuId: json['menuId'],
      menuName: json['menuName'],
      menuDescription: json['menuDescription'],
      menuSections: List<MenuSection>.from(
          json['menuSections'].map((x) => MenuSection.fromJson(x))),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'menuId': menuId,
      'menuName': menuName,
      'menuDescription': menuDescription,
      'menuSections': List<dynamic>.from(menuSections.map((x) => x.toJson())),
    };
  }

  @override
  String toString() {
    var sb = StringBuffer();
    sb.writeln('```');
    sb.writeln('Menu:');
    sb.writeln('  menuId: $menuId');
    sb.writeln('  menuName: $menuName');
    sb.writeln('  menuDescription: $menuDescription');
    sb.writeln('  menuSections:');
    for (var section in menuSections) {
      sb.writeln('    - ${section.toString().replaceAll('\n', '\n    ')}');
    }
    sb.writeln('```');
    return sb.toString();
  }
}
