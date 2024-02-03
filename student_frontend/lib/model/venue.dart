import 'dart:convert';

import 'package:student_frontend/model/review.dart';

class Venue {
  final int? venueId;
  final String venueName;
  final String description;
  final List<String> venueMenu;
  final String ownerUsername;
  final int? averagePrice;
  final String phoneNumber;
  String venueCrowdLevel;
  final String venueStatus;
  final Map<String, dynamic> businessHours;
  final List<Review> reviews;
  final Map<String, dynamic> address;
  final List<String> venueImages;
  final String displayImagePath;
  final List<String> amenities;
  int? ratings;
  double? distance;
  String imageUrl;

  Venue({
    required this.venueId,
    required this.venueName,
    required this.description,
    required this.venueMenu,
    required this.ownerUsername,
    required this.averagePrice,
    required this.phoneNumber,
    required this.venueCrowdLevel,
    required this.venueStatus,
    required this.businessHours,
    required this.reviews,
    required this.address,
    required this.venueImages,
    required this.displayImagePath,
    required this.amenities,
    required this.ratings,
    this.distance,
    required this.imageUrl,
  });

  Map<String, dynamic> toMap() {
    return {
      'venueId': venueId,
      'venueName': venueName,
      'description': description,
      'venueMenu': venueMenu,
      'ownerUsername': ownerUsername,
      'averagePrice': averagePrice,
      'phoneNumber': phoneNumber,
      'venueCrowdLevel': venueCrowdLevel,
      'venueStatus': venueStatus,
      'businessHours': businessHours,
      'reviews': reviews,
      'address': address,
      'venueImages': venueImages,
      'displayImagePath': displayImagePath,
      'amenities': amenities,
      'ratings': ratings,
      'distance': distance,
    };
  }

  factory Venue.fromMap(Map<String, dynamic> map) {
    List<Review> reviews = (map['reviews'] as List<dynamic>?)
            ?.map((reviewData) => Review.fromJson(reviewData))
            .toList() ??
        [];

    return Venue(
      venueId: map['venueId'] as int?,
      venueName: map['venueName'] ?? 'Starbucks',
      description: map['description'] ?? 'Starbucks Description',
      venueMenu: List<String>.from(map['venueMenu'] ?? []),
      ownerUsername: map['ownerUsername'] ?? "-",
      averagePrice: map['averagePrice'] as int?,
      phoneNumber: map['phoneNumber'] ?? '87623332',
      venueCrowdLevel: map['venueCrowdLevel'] ?? 'GREEN',
      venueStatus: map['venueStatus'] ?? 'ACTIVATED',
      businessHours: map['businessHours'] ?? {},
      reviews: reviews,
      address: map['address'] ?? {},
      displayImagePath: map['displayImagePath'] ?? "",
      amenities: List<String>.from(map['amenities'] ?? []),
      venueImages: List<String>.from(map['images'] ?? []),
      ratings: map['ratings'] as int?,
      distance: map['distance'] as double?,
      imageUrl: map['imageUrl'] ?? "",
    );
  }

  Venue copyWith(String? imageUrl) {
    return Venue(
      venueId: venueId ?? venueId,
      venueName: venueName,
      description: description,
      venueMenu: venueMenu,
      ownerUsername: ownerUsername,
      averagePrice: averagePrice ?? this.averagePrice,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      venueCrowdLevel: venueCrowdLevel ?? this.venueCrowdLevel,
      venueStatus: venueStatus ?? this.venueStatus,
      businessHours: businessHours ?? this.businessHours,
      reviews: reviews ?? this.reviews,
      address: address ?? this.address,
      venueImages: venueImages ?? this.venueImages,
      displayImagePath: displayImagePath ?? this.displayImagePath,
      amenities: amenities ?? this.amenities,
      ratings: ratings ?? this.ratings,
      distance: distance ?? this.distance,
      imageUrl: imageUrl ?? this.imageUrl,
    );
  }

  void setImageUrl(String url) {
    imageUrl = url;
  }

  void setDistance(double distance) {
    this.distance = distance;
  }

  void setRatings(int ratings) {
    this.ratings = ratings;
  }

  void setVenueCrowdLevel(String crowdLevel) {
    venueCrowdLevel = crowdLevel;
  }

  double getVenueAverageRatings() {
    if (reviews.isEmpty) {
      return 0.0;
    }

    double sum = 0;
    reviews.forEach((review) {
      sum += review.starRating ?? 0.0;
    });

    if (reviews.isNotEmpty) {
      double averageRating = sum / reviews.length;
      return double.parse(averageRating.toStringAsFixed(2));
    } else {
      return 0.00; // Return a default value if there are no reviews.
    }
  }

  String toJson() => json.encode(toMap());

  factory Venue.fromJson(String source) => Venue.fromMap(json.decode(source));

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Venue &&
        other.venueId == venueId &&
        other.venueName == venueName &&
        other.venueCrowdLevel == venueCrowdLevel &&
        other.venueStatus == venueStatus &&
        other.businessHours == businessHours &&
        other.displayImagePath == displayImagePath &&
        other.imageUrl == imageUrl;
  }

  @override
  int get hashCode {
    return venueId.hashCode ^
        venueName.hashCode ^
        venueCrowdLevel.hashCode ^
        venueStatus.hashCode ^
        businessHours.hashCode ^
        displayImagePath.hashCode ^
        imageUrl.hashCode;
  }

  @override
  String toString() {
    return '''
      Venue(
        venueId: $venueId,
        venueName: $venueName,
        description: $description,
        venueMenu: ${venueMenu.toString()},
        ownerUsername: $ownerUsername,
        averagePrice: $averagePrice,
        phoneNumber: $phoneNumber,
        venueCrowdLevel: $venueCrowdLevel,
        venueStatus: $venueStatus,
        businessHours: {
          businessHoursId: ${businessHours['businessHoursId']},
          mon: ${businessHours['mon'].toString()},
          tue: ${businessHours['tue'].toString()},
          wed: ${businessHours['wed'].toString()},
          thu: ${businessHours['thu'].toString()},
          fri: ${businessHours['fri'].toString()},
          sat: ${businessHours['sat'].toString()},
          sun: ${businessHours['sun'].toString()},
          holidays: ${businessHours['holidays'].toString()}
        },
        reviews: ${reviews.toString()},
        address: {
          addressId: ${address['addressId']},
          postalCode: ${address['postalCode']},
          address: ${address['address']},
          latitude: ${address['latitude']},
          longitude: ${address['longitude']}
        },
        displayImagePath: $displayImagePath,
        amenities: ${amenities.toString()},
        ratings: $ratings,
        distance: $distance,
      )
      ''';
  }
}
