import 'dart:convert';

class Message {
  final int messageId;
  final String message;
  final String sender;
  final DateTime createdAt;

  Message({
    required this.messageId,
    required this.message,
    required this.sender,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'messageId': messageId,
      'message': message,
      'sender': sender,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      messageId: json['messageId'],
      message: json['message'],
      sender: json['sender'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  // Helper method to convert a JSON string to a Message object
  factory Message.fromJsonString(String jsonString) {
    return Message.fromJson(jsonDecode(jsonString));
  }

  // Helper method to convert a Message object to a JSON string
  String toJsonString() {
    return jsonEncode(toJson());
  }
}
