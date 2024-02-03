import 'dart:convert';

class Review {
  final int? reviewId;

  final String? studentUsername;

  final String subject;

  final int starRating;

  final String description;

  final String? ownerReply;

  final DateTime? createdAt;

  Review(
      {this.reviewId,
      required this.subject,
      required this.starRating,
      required this.description,
      this.ownerReply,
      this.createdAt,
      this.studentUsername}) {}

  Map<String, dynamic> toJson() => {
        'reviewId': reviewId,
        'subject': subject,
        'description': description,
        'starRating': starRating,
        'createdAt': createdAt?.toIso8601String(),
        'ownerReply': ownerReply,
        'studentUsername': studentUsername
      };

  String toJsonString() => jsonEncode(toJson());

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
        reviewId: json['reviewId'],
        subject: json['subject'],
        description: json['description'],
        createdAt: DateTime.parse(json['createdAt']),
        ownerReply: json['ownerReply'],
        starRating: json['starRating'],
        studentUsername: json['studentUsername']);
  }
}
