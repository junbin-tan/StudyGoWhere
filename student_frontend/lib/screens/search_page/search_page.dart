import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';
import 'package:student_frontend/model/venue.dart';
import 'package:student_frontend/screens/home_page.dart';
import 'package:student_frontend/screens/search_page/price_rating_filter_widget.dart';
import 'package:student_frontend/screens/search_page/venue_status_filter_widget.dart';
import 'package:student_frontend/screens/venues/closing_time_today.dart';
import 'package:student_frontend/screens/venues/venue_details_page.dart';
import 'package:student_frontend/services/api.dart';
import 'package:student_frontend/services/firebase_image_fetch.dart';
import 'package:student_frontend/widgets/search_bar.dart';
import 'package:student_frontend/widgets/venue_card_modular.dart';

import '../home_page_widgets/nearby_venues_module.dart';

class SearchPage extends StatefulWidget {
  final String initialQuery;

  SearchPage({this.initialQuery = ''});

  @override
  _SearchPageState createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  List<Map<String, dynamic>> venues = [];
  List<Map<String, dynamic>> filteredVenues = [];
  List<Map<String, dynamic>> venueSuggestions = [];
  String searchQuery = '';
  API api = API();
  bool isFilterDrawerOpen = false;
  bool isLoading = false;

  // Filter options
  bool filterOpenNow = true; // default show venues that are open
  String? filterCrowdLevel;
  double filterPriceMin = 1;
  double filterPriceMax = 5;

  @override
  void initState() {
    super.initState();
    searchQuery = widget.initialQuery;
    fetchVenues();
  }

  void fetchVenues() async {
    setState(() {
      isLoading = true;
    });

    venues = await api.getAllVenues();

    // Preliminary filter for opening hours
    // if (filterOpenNow) {
    //   venues = venues.where((v) => isVenueOpen(v['venue'])).toList();
    // }

    venues = venues.where((venue) {
      return venue['venue']
          .venueName
          .toLowerCase()
          .contains(searchQuery.toLowerCase());
    }).toList();

    await Future.wait(venues.map((venue) async {
      String? imageUrl = await getFirebaseLink(venue['venue'].displayImagePath);
      int index = venues.indexOf(venue);
      venues[index]['venue'] = venue['venue'].copyWith(imageUrl);
    }));

    setState(() {
      isLoading = false;
      if (searchQuery.isNotEmpty) {
        filteredVenues = venues;
      } else {
        filteredVenues = venues;
      }
    });
  }

  bool isVenueOpen(Venue venue) {
    final now = DateTime.now();
    final day = now.weekday;
    final currentTime =
        "${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}";
    List<Map<String, dynamic>> dayHours = [];

    switch (day) {
      case 1:
        dayHours = (venue.businessHours["mon"] as List<dynamic>)
            .map((item) => item as Map<String, dynamic>)
            .toList();
        break;
      case 2:
        dayHours = (venue.businessHours["tue"] as List<dynamic>)
            .map((item) => item as Map<String, dynamic>)
            .toList();
        break;
      case 3:
        dayHours = (venue.businessHours["wed"] as List<dynamic>)
            .map((item) => item as Map<String, dynamic>)
            .toList();
        break;
      case 4:
        dayHours = (venue.businessHours["thu"] as List<dynamic>)
            .map((item) => item as Map<String, dynamic>)
            .toList();
        break;
      case 5:
        dayHours = (venue.businessHours["fri"] as List<dynamic>)
            .map((item) => item as Map<String, dynamic>)
            .toList();
        break;
      case 6:
        dayHours = (venue.businessHours["sat"] as List<dynamic>)
            .map((item) => item as Map<String, dynamic>)
            .toList();
        break;
      case 7:
        dayHours = (venue.businessHours["sun"] as List<dynamic>)
            .map((item) => item as Map<String, dynamic>)
            .toList();
        break;
      default:
        return false;
    }

    for (var timeFrame in dayHours) {
      if (currentTime.compareTo(timeFrame["fromTime"]!) >= 0 &&
          currentTime.compareTo(timeFrame["toTime"]!) <= 0) {
        return true;
      }
    }
    return false;
  }

  void filterVenues(String query) {
    fetchVenues(); //fetch new list of most updated venues
    final filtered = venues.where((venue) {
      bool nameMatches =
          venue['venue'].venueName.toLowerCase().contains(query.toLowerCase());
      bool priceMatches = venue['venue'].averagePrice >= filterPriceMin &&
          venue['venue'].averagePrice <= filterPriceMax;
      bool crowdMatches = filterCrowdLevel == null ||
          venue['venue'].venueCrowdLevel == filterCrowdLevel;
      bool openNowMatches = !filterOpenNow || isVenueOpen(venue['venue']);

      return nameMatches && priceMatches && crowdMatches && openNowMatches;
    }).toList();

    setState(() {
      filteredVenues = filtered;
    });
  }

  void openFilterDrawer() {
    setState(() {
      isFilterDrawerOpen = !isFilterDrawerOpen;
    });
  }

  Widget buildFilterDrawer() {
    return Container(
      color: Colors.white,
      height: 200,
      padding: const EdgeInsets.fromLTRB(5.0, 10.0, 5.0, 10.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(left: 17.5),
            child: Text("Status",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w400,
                )),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              StatusCircleButton(
                status: "green",
                text: "Available",
                selected: filterCrowdLevel == "GREEN",
                onPressed: () {
                  setState(() {
                    filterCrowdLevel = "GREEN";
                  });
                },
              ),
              StatusCircleButton(
                status: "amber",
                text: "Busy",
                selected: filterCrowdLevel == "AMBER",
                onPressed: () {
                  setState(() {
                    filterCrowdLevel = "AMBER";
                  });
                },
              ),
              StatusCircleButton(
                status: "red",
                text: "Full",
                selected: filterCrowdLevel == "RED",
                onPressed: () {
                  setState(() {
                    filterCrowdLevel = "RED";
                  });
                },
              ),
              StatusCircleButton(
                status: "grey",
                text: "All",
                selected: filterCrowdLevel == null,
                onPressed: () {
                  setState(() {
                    filterCrowdLevel = null;
                  });
                },
              )
            ],
          ),
          const Divider(),
          const Padding(
            padding: EdgeInsets.only(left: 17.5),
            child: Text(
              "Price Rating",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
          PriceRatingSlider(
            initialMin: filterPriceMin,
            initialMax: filterPriceMax,
            onChanged: (values) {
              setState(() {
                filterPriceMin = values.start;
                filterPriceMax = values.end;
              });
              // This is for automatic filtering
              // filterVenues(searchQuery);
            },
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          iconTheme:
              const IconThemeData(color: Color.fromARGB(255, 101, 69, 31)),
          title: const Text('Search Venues',
              style: TextStyle(color: Color.fromARGB(255, 101, 69, 31))),
          centerTitle: true,
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () {
              Get.offAll(MyHomePage());
            },
          )),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: CustomSearchBar(
                    hintText: "search venues",
                    onSearch: filterVenues,
                    initialQuery: searchQuery,
                  ),
                ),
                InkWell(
                  onTap: openFilterDrawer,
                  child: SvgPicture.asset(
                    'assets/filter_button.svg',
                    height: 24,
                    width: 24,
                  ),
                ),
                const SizedBox(width: 8),
              ],
            ),
          ),
          if (isFilterDrawerOpen) buildFilterDrawer(),
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                    itemCount: filteredVenues.length,
                    itemBuilder: (context, index) {
                      final venue = filteredVenues[index];
                      return VenueCardModular(
                        cafeLink:
                            VenueDetailsPage(venueId: venue['venue'].venueId),
                        storeName: venue['venue'].venueName,
                        distance: venue['distance'], //temp
                        priceRating: venue['venue'].averagePrice,
                        hasBooking: false, //temp
                        ratings:
                            "${venue['venue'].getVenueAverageRatings()}", //temp
                        crowdLevel: venue['venue'].venueCrowdLevel,
                        closingTime:
                            extractClosingHour(venue['venue'].businessHours),
                        cafeImage: venue['venue'].imageUrl,
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
