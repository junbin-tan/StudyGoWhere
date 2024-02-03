class Advertisement {
  final int billableId;
  final double billablePrice;
  final String name;
  final String image;
  final String description;
  final String startDate;
  final String endDate;
  final String adCreatorUsername;
  final double costPerImpression;
  final int impressionsLeft;
  final double budgetLeft;
  final List<int> impressionIds;
  final int impressionCount;
  final Map<String, int> reachIds;
  final int reachCount;
  final String advertisementStatus;
  final String rejectionReason;

  Advertisement({
    required this.billableId,
    required this.billablePrice,
    required this.name,
    required this.image,
    required this.description,
    required this.startDate,
    required this.endDate,
    required this.adCreatorUsername,
    required this.costPerImpression,
    required this.impressionsLeft,
    required this.budgetLeft,
    required this.impressionIds,
    required this.impressionCount,
    required this.reachIds,
    required this.reachCount,
    required this.advertisementStatus,
    required this.rejectionReason,
  });

  factory Advertisement.fromJson(Map<String, dynamic> json) {
    return Advertisement(
      billableId: json['billableId'],
      billablePrice: json['billablePrice'],
      name: json['name'],
      image: json['image'],
      description: json['description'],
      startDate: json['startDate'],
      endDate: json['endDate'],
      adCreatorUsername: json['adCreatorUsername'],
      costPerImpression: json['costPerImpression'],
      impressionsLeft: json['impressionsLeft'],
      budgetLeft: json['budgetLeft'],
      impressionIds: List<int>.from(json['impressionIds']),
      impressionCount: json['impressionCount'],
      reachIds: Map<String, int>.from(json['reachIds']),
      reachCount: json['reachCount'],
      advertisementStatus: json['advertisementStatus'],
      rejectionReason: json['rejectionReason'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'billableId': billableId,
      'billablePrice': billablePrice,
      'name': name,
      'image': image,
      'description': description,
      'startDate': startDate,
      'endDate': endDate,
      'adCreatorUsername': adCreatorUsername,
      'costPerImpression': costPerImpression,
      'impressionsLeft': impressionsLeft,
      'budgetLeft': budgetLeft,
      'impressionIds': impressionIds,
      'impressionCount': impressionCount,
      'reachIds': reachIds,
      'reachCount': reachCount,
      'advertisementStatus': advertisementStatus,
      'rejectionReason': rejectionReason,
    };
  }

  @override
  String toString() {
    return '''
    Advertisement(
      billableId: $billableId,
      billablePrice: $billablePrice,
      name: $name,
      image: $image,
      description: $description,
      startDate: $startDate,
      endDate: $endDate,
      adCreatorUsername: $adCreatorUsername,
      costPerImpression: $costPerImpression,
      impressionsLeft: $impressionsLeft,
      budgetLeft: $budgetLeft,
      impressionIds: ${impressionIds.toString()},
      impressionCount: $impressionCount,
      reachIds: ${reachIds.toString()},
      reachCount: $reachCount,
      advertisementStatus: $advertisementStatus,
      rejectionReason: $rejectionReason
    )
  ''';
  }
}
