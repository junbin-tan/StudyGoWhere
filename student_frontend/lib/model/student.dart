class Student {
  int id;
  String email;
  String username;
  int balance;
  String name;
  bool enabled;

  Student(
      {required this.id,
      required this.email,
      required this.username,
      required this.balance,
      required this.name,
      required this.enabled});

  Map<String, dynamic> toJson() => {
        'id': id,
        'email': email,
        'username': username,
        'balance': balance,
        'name': name,
        'enabled': enabled
      };

  factory Student.fromJson(Map<String, dynamic> json) => Student(
      id: json['id'],
      email: json['email'],
      username: json['username'],
      balance: json['balance'],
      name: json['name'],
      enabled: json['enabled']);
}
