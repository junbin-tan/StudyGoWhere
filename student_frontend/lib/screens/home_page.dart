import 'dart:async';

import 'package:collection/collection.dart';
import 'package:flashy_tab_bar2/flashy_tab_bar2.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:location/location.dart';
import 'package:provider/provider.dart';
import 'package:student_frontend/model/profile_manager.dart';
import 'package:student_frontend/model/venue.dart';
import 'package:student_frontend/model/voucher.dart';
import 'package:student_frontend/screens/home_page_widgets/home_page_voucher_list.dart';
import 'package:student_frontend/screens/home_page_widgets/nearby_venues_module.dart';
import 'package:student_frontend/screens/my_vouchers_page/vouchers_page.dart';
import 'package:student_frontend/screens/qr_scanner_page/qr_scanner_page.dart';
import 'package:student_frontend/screens/search_page/search_page.dart';
import 'package:student_frontend/screens/venues/home_page_widgets/box_navigation_icon.dart';
import 'package:student_frontend/screens/venues/home_page_widgets/navigation_icon_row.dart';
import 'package:student_frontend/screens/wallet_page/wallet_page.dart';
import 'package:student_frontend/services/firebase_image_fetch.dart';
import 'package:student_frontend/services/navigation_provider.dart';
import 'package:student_frontend/widgets/advertisement_space.dart';

import '../model/advertisement.dart';
import '../services/api.dart';
import '../model/student.dart';
import '../widgets/background_header.dart';
import '../screens/help_center/help_center_page.dart';
import 'bookings_page/bookings_page.dart';

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final API api = API();

  Student? currentStudent;

  Location location = Location();
  double? latitude;
  double? longitude;

  Advertisement? featuredAd;
  Image? featuredAdImage;

  final List<Voucher> vouchers = [];
  List<Venue> venues = [];
  List<Map<String, dynamic>> rawVenues = [];

  Timer? _timer1;
  Timer? _timer2;

  Color headerBackgroundColor = Colors.transparent;

  StreamSubscription<LocationData>? _locationSubscription;

  @override
  void initState() {
    super.initState();

    _locationSubscription =
        location.onLocationChanged.listen((currentLocation) {
      setState(() {
        latitude = currentLocation.latitude;
        longitude = currentLocation.longitude;
      });
      print("Updating location via listener");
      _fetchAndSetVenues();
    });

    // fetch venue using initial fallback location for instant generation of UI
    _fetchAndSetVenues();

    // Get profile / vouchers / advertisements
    _fetchAndSetProfile().then((_) {
      _fetchAndSetVouchers();
      _fetchAdvertisement();
    });

    _timer1 = Timer.periodic(const Duration(minutes: 2), (timer) {
      checkUserBanned();
    });
    _timer2 = Timer.periodic(const Duration(minutes: 1), (timer) {
      _fetchAdvertisement();
      _fetchAndSetVouchers();
    });
  }

  void _fetchLocation() async {
    LocationData locationData = await location.getLocation();
    setState(() {
      latitude = locationData.latitude;
      longitude = locationData.longitude;
    });
    print("location fetched");
  }

  Future<void> _fetchAndSetVenues() async {
    try {
      _fetchLocation();

      double fallbackLatitude = 1.3727489;
      double fallbackLongitude = 103.901828;

      List<Map<String, dynamic>> fetchedVenues = await api.getNearbyVenues(
          latitude ?? fallbackLatitude, longitude ?? fallbackLongitude);

      print("Venue fetched");

      // Extracting venue maps and creating Venue objects
      List<Venue> convertedVenues = fetchedVenues.map((data) {
        var venueMap = data['venue'] as Map<String, dynamic>;
        return Venue.fromMap(venueMap);
      }).toList();

      await Future.wait(convertedVenues.map((venue) async {
        String? imageUrl = await getFirebaseLink(venue.displayImagePath);
        int index = convertedVenues.indexOf(venue);
        convertedVenues[index] = venue.copyWith(imageUrl);
      }));

      // print venue image url
      convertedVenues.forEach((venue) {
        print("Venue image url: ${venue.imageUrl}");
      });

      bool isConvertedEqual =
          DeepCollectionEquality().equals(venues, convertedVenues);

      print("isConvertedEqual: $isConvertedEqual");

      print(fetchedVenues);
      print(rawVenues);

      if (!isConvertedEqual) {
        if (mounted) {
          setState(() {
            rawVenues = List.from(fetchedVenues);
            venues = List.from(convertedVenues);
          });
        }
      }
    } catch (e) {
      print("Error fetching venues in home page: $e");
    }
  }

  Future<void> _fetchAdvertisement() async {
    Advertisement? nearestAd = await api.getNearbyAdvertisement();
    if (nearestAd != null) {
      Image? nearestAdImage = await getImageFromFirebaseF(nearestAd.image);
      print("GIMME THE AD!");
      print(nearestAd.toString());
      if (mounted) {
        setState(() {
          featuredAd = nearestAd;
          featuredAdImage = nearestAdImage;
        });
      }
    }
  }

  @override
  void dispose() {
    _timer1?.cancel();
    _timer2?.cancel();
    _locationSubscription?.cancel();
    super.dispose();
  }

  Future<void> _fetchAndSetVouchers() async {
    try {
      List<Voucher> fetchedVouchers =
          await API().getAllStudentVouchers(currentStudent!.id);

      bool isEqual = vouchers.length == fetchedVouchers.length ||
          const DeepCollectionEquality.unordered()
              .equals(vouchers, fetchedVouchers);

      if (!isEqual) {
        setState(() {
          vouchers.clear();
          vouchers.addAll(fetchedVouchers);
        });
      }
    } catch (e) {
      print("Error fetching vouchers in home page: $e");
    }
  }

  bool hasUnredeemedVoucher(List<Voucher> voucher) {
    return vouchers.any((voucher) => voucher.voucherStatusEnum == "UNREDEEMED");
  }

  Future<void> _fetchAndSetProfile() async {
    final profileManager = context.read<ProfileManager>();
    try {
      await profileManager.fetchProfile();
      if (mounted) {
        setState(() {
          currentStudent = profileManager.loggedInStudent;
        });
      }
      print("fetched student profile: ID = ${currentStudent!.id}");

      // Check if user banned
      if (currentStudent?.enabled == false) {
        _handleBannedUser();
      }
    } catch (error) {
      print("Error fetching profile: $error");
    }
  }

  void _onItemTapped(int index) {
    context.read<NavigationProvider>().setIndex(index);

    switch (index) {
      case 0:
        Get.to(() => MyHomePage());
        break;
      case 1:
        Get.to(() => QRScannerPage());
        break;
      case 2:
        Get.to(() => BookingsPage());
        break;
      default:
        break;
    }
  }

  void handleSearch(String query) {
    setState(() {
      Get.to(SearchPage(
        initialQuery: query,
      ));
    });
  }

  Future<void> checkUserBanned() async {
    _fetchAndSetProfile();
  }

  void _handleBannedUser() {
    Get.defaultDialog(
        title: "Account Banned",
        titleStyle: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 20,
          color: Colors.black,
        ),
        content: const Text(
          "You have been banned from using the app. Please contact the admin for more information.",
          textAlign: TextAlign.center,
        ),
        confirm: ElevatedButton(
          onPressed: () {
            Get.offAllNamed("/login");
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.brown,
            foregroundColor: Colors.white,
          ),
          child: const Text("I Understand"),
        ),
        buttonColor: Colors.brown,
        barrierDismissible: false);
  }

  @override
  Widget build(BuildContext context) {
    int currentIndex = context.watch<NavigationProvider>().currentIndex;
    return Scaffold(
      body: Stack(
        children: <Widget>[
          NotificationListener<ScrollNotification>(
            onNotification: (scrollNotification) {
              if (scrollNotification is ScrollUpdateNotification) {
                // if scrolled past the advertisement height
                final scrolledPastAd = scrollNotification.metrics.pixels > 100;
                if (scrolledPastAd && headerBackgroundColor != Colors.brown) {
                  setState(() {
                    headerBackgroundColor = Colors.blueGrey[800]!;
                  });
                } else if (!scrolledPastAd &&
                    headerBackgroundColor != Colors.transparent) {
                  setState(() {
                    headerBackgroundColor = Colors.transparent;
                  });
                }
              }
              return true;
            },
            child: Positioned.fill(
              child: CustomScrollView(
                slivers: <Widget>[
                  SliverAppBar(
                    backgroundColor: Colors.transparent,
                    pinned: true,
                    toolbarHeight: 0,
                    expandedHeight: 200.0, // advertisement image height
                    flexibleSpace: FlexibleSpaceBar(
                      background: AdvertisementSpace(
                        advertisement: featuredAdImage,
                        advertId: featuredAd?.billableId,
                      ),
                    ),
                  ),
                  SliverList(
                    delegate: SliverChildListDelegate(
                      [
                        NavigationIconRow(
                          icons: <Widget>[
                            BoxNavigationIcon(
                              text: 'My Venues',
                              iconAssetPath: 'assets/saved_venue_svg.svg',
                              onPressed: () {
                                print('My venues pressed');
                              },
                            ),
                            BoxNavigationIcon(
                              text: 'Buy Credits',
                              iconAssetPath: 'assets/buy_credits_svg.svg',
                              onPressed: () {
                                Get.to(
                                  () => const WalletPage(
                                    initialTopUp: true,
                                  ),
                                );
                              },
                            ),
                            BoxNavigationIcon(
                              text: 'Vouchers',
                              iconAssetPath: 'assets/voucher_svg.svg',
                              onPressed: () {
                                Get.to(
                                  () => VouchersPage(
                                      studentId: currentStudent!.id),
                                );
                              },
                            ),
                            BoxNavigationIcon(
                              text: 'Help',
                              iconAssetPath: 'assets/customer_service_svg.svg',
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => HelpCenterPage(
                                        currentStudent: currentStudent),
                                  ),
                                );
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        if (hasUnredeemedVoucher(vouchers))
                          ActivatedVoucherListSection(
                            vouchers: vouchers,
                            onVoucherPressed: (voucher) {
                              print("Voucher pressed: ${voucher.billableId}");
                            },
                          ),
                        const SizedBox(height: 8),
                        NearbyVenuesListSection(
                          venues: venues,
                          rawVenues: rawVenues,
                          onVenuePressed: (venue) {
                            print("Venue pressed: ${venue.venueName}");
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: BackgroundHeader(
              currentStudent: currentStudent,
              onSearch: handleSearch,
              backgroundColor: headerBackgroundColor,
            ),
          ),
        ],
      ),
      bottomNavigationBar: FlashyTabBar(
        animationCurve: Curves.linear,
        selectedIndex: currentIndex,
        iconSize: 25,
        showElevation: false,
        onItemSelected: _onItemTapped,
        items: [
          FlashyTabBarItem(
            activeColor: Colors.blueGrey[800]!,
            inactiveColor: Colors.grey[500]!,
            icon: const Icon(
              Icons.home,
            ),
            title: const Text(
              'Home',
              style: TextStyle(),
            ),
          ),
          FlashyTabBarItem(
            activeColor: Colors.blueGrey[800]!,
            inactiveColor: Colors.grey[500]!,
            icon: const Icon(
              Icons.qr_code_scanner,
            ),
            title: const Text(
              "QR Code",
              style: TextStyle(),
            ),
          ),
          FlashyTabBarItem(
            activeColor: Colors.blueGrey[800]!,
            inactiveColor: Colors.grey[500]!,
            icon: const Icon(
              Icons.calendar_today,
            ),
            title: const Text(
              'Bookings',
              style: TextStyle(),
            ),
          ),
        ],
      ),
    );
  }
}
