// ignore_for_file: constant_identifier_names

import 'dart:convert';

import 'package:student_frontend/model/message.dart';

class Ticket {
  final int? ticketId;
  final String subject;
  final String description;
  final DateTime? createdAt;
  final List<String> images;
  final String ticketStatus;
  final String? ticketCategory;
  final bool notifyClient;
  final bool notifyAdmin;

  Ticket({
    this.ticketId,
    required this.subject,
    required this.description,
    this.createdAt,
    required this.images,
    required this.ticketStatus,
    required this.ticketCategory,
    required this.notifyClient,
    required this.notifyAdmin,
  });

  Map<String, dynamic> toJson() => {
        'ticketId': ticketId,
        'subject': subject,
        'description': description,
        'createdAt': createdAt?.toIso8601String(),
        'images': images,
        'ticketStatus': ticketStatus,
        'ticketCategory': ticketCategory,
        'notifyClient': notifyClient,
        'notifyAdmin': notifyAdmin,
      };

  String toJsonString() => jsonEncode(toJson());

  factory Ticket.fromJson(Map<String, dynamic> json) {
    return Ticket(
      ticketId: json['ticketId'],
      subject: json['subject'],
      description: json['description'],
      createdAt: DateTime.parse(json['createdAt']),
      images: List<String>.from(json['images']),
      ticketStatus: json['ticketStatus'],
      ticketCategory: json['ticketCategory'],
      notifyClient: json['notifyClient'],
      notifyAdmin: json['notifyAdmin'],
    );
  }
}
