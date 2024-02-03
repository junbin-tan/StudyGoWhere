import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:student_frontend/model/booking/venue_booking_day.dart';
import 'package:student_frontend/model/menu.dart';
import 'package:student_frontend/model/profile_manager.dart';
import 'package:student_frontend/model/voucher_listing.dart';
import 'package:student_frontend/screens/venues/venue_widgets/amenities_icon.dart';
import 'package:student_frontend/screens/venues/venue_widgets/booking/venue_booking_page.dart';
import 'package:student_frontend/screens/venues/venue_widgets/menu/menu_page.dart';
import 'package:student_frontend/screens/venues/venue_widgets/venue_header.dart';
import 'package:student_frontend/screens/venues/venue_widgets/venue_rating_review.dart';
import 'package:student_frontend/screens/venues/venue_widgets/venue_text_section.dart';
import 'package:student_frontend/screens/venues/venue_widgets/venue_voucher_listings_section.dart';
import 'package:student_frontend/services/api.dart';
import 'package:student_frontend/services/firebase_image_fetch.dart';
import 'package:student_frontend/screens/venues/view_all_review.dart';
import 'package:student_frontend/services/sgw_colors.dart';
import 'package:student_frontend/widgets/create_review_page.dart';
import 'package:student_frontend/widgets/review_card.dart';
import 'package:student_frontend/widgets/purchase_success_widget.dart';
import 'package:student_frontend/widgets/service_hours.dart';

import '../../model/review.dart';
import '../../model/venue.dart';
import '../../widgets/image_slider.dart';

class VenueDetailsPage extends StatefulWidget {
  final int venueId;

  const VenueDetailsPage({
    super.key,
    required this.venueId,
  });

  @override
  State<VenueDetailsPage> createState() => _VenueDetailsPageState();
}

class _VenueDetailsPageState extends State<VenueDetailsPage> {
  Image? cafeImage;
  List<Widget>? imageSliders;
  String? crowdLevel;
  Venue? currentVenue;
  List<String>? amenities;
  List<VoucherListing>? voucherListings;
  List<VenueBookingDay>? bookingSlots;

  List<Review>? reviews;
  bool? reviewed;
  final API api = API();
  static const Color mainBodyColor = Color.fromARGB(100, 31, 37, 51);

  final PageController _pageController = PageController(initialPage: 1);
  Menu? menu;

  @override
  void initState() {
    super.initState();
    retrieveVenueDetails();
    checkIfUserReviewed();
    retrieveVenueReviews();
    retrieveMenu();
    retrieveBookingSlots();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> retrieveVenueDetails() async {
    Venue res = await api.getVenue(widget.venueId);
    Image? cafeImage = await getImageFromFirebaseF(res.displayImagePath);
    List<Image?>? cafeImages = await getAllImageFromFirebase(res.venueImages);

    final List<Widget> imageSliders = cafeImages!.map((item) {
      return Container(margin: const EdgeInsets.all(5.0), child: item);
    }).toList();
    setState(() {
      currentVenue = res;
      this.cafeImage = cafeImage;
      this.imageSliders = imageSliders;
      amenities = currentVenue!.amenities;
    });

    // Retrieve voucher listings for venue
    retrieveVoucherListings(res.ownerUsername);
  }

  Future<void> retrieveMenu() async {
    try {
      Menu fetchedMenu = await api.getMenuByVenueId(widget.venueId);
      await Future.wait(fetchedMenu.menuSections.map((menuSection) async =>
          await Future.wait(menuSection.menuItems.map((menuItem) async {
            menuItem.imageURL = await getFirebaseLink(menuItem.imageURL);
          }))));
      setState(() {
        menu = fetchedMenu;
      });
      print("MENU: ${fetchedMenu.toString()}");
    } catch (e) {
      print("Error retrieving menu: $e");
    }
  }

  Future<void> retrieveVoucherListings(String ownerUsername) async {
    List<VoucherListing> fetchedVoucherListings =
        await api.getAllVoucherListingsByOwnerUsername(ownerUsername);
    setState(() {
      voucherListings = fetchedVoucherListings;
    });

    print("VOUCHER LISTINGS:  $voucherListings");
  }

  Future<void> retrieveVenueReviews() async {
    List<Review> res = await api.getVenueReviews(widget.venueId);
    setState(() {
      this.reviews = res;
    });
  }

  Future<void> retrieveBookingSlots() async {
    List<VenueBookingDay> fetchedBookingSlots =
        await api.getBookingSlotsByVenueId(widget.venueId);
    setState(() {
      bookingSlots = fetchedBookingSlots;
    });

    print("BOOKING SLOTS:  $bookingSlots");
  }

  Future<void> checkIfUserReviewed() async {
    bool checkReview = await api.checkReviewed(widget.venueId);
    setState(() {
      reviewed = checkReview;
    });
  }

  void updateReviewed() {
    setState(() {
      reviewed = true;
    });
  }

  Map<String, dynamic> parseBusinessHours(Map<String, dynamic>? jsonPayload) {
    final Map<String, dynamic> result = {};
    jsonPayload?.forEach((day, value) {
      if (value is List) {
        if (value.isNotEmpty) {
          final hoursList = value.map((timeRange) {
            final from = timeRange['fromTime'].split(':');
            final to = timeRange['toTime'].split(':');
            return '${from[0]}:${from[1]} - ${to[0]}:${to[1]}';
          }).toList();
          result[day] = hoursList.join(', ');
        } else {
          result[day] = 'closed';
        }
      } else if (value == 'closed') {
        result[day] = 'closed';
      }
    });
    return result;
  }

  void _showCreateReviewPageInDialog(BuildContext context, Review? review) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (BuildContext context) {
        return GestureDetector(
          onTap: () {
            if (MediaQuery.of(context).viewInsets.bottom != 0) {
              // If the keyboard is visible
              FocusScope.of(context).unfocus(); // Hide the keyboard
            } else {
              // If the keyboard is not visible
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  contentTextStyle: const TextStyle(color: Colors.brown),
                  title: const Text('Are you sure?'),
                  content: const Text(
                    'You haven\'t sent the review. Are you sure you want to leave?',
                  ),
                  actions: [
                    TextButton(
                      child: const Text('No'),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                    TextButton(
                      child: const Text('Yes'),
                      onPressed: () {
                        Navigator.of(context)
                            .pop(); // close the confirmation dialog
                        Navigator.of(context).pop(); // close the main dialog
                      },
                    ),
                  ],
                ),
              );
            }
          },
          child: WillPopScope(
            onWillPop: () async {
              bool shouldPop = await showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Are you sure?'),
                  content: const Text(
                      'You haven\'t sent the review. Are you sure you want to leave?'),
                  actions: [
                    TextButton(
                      child: const Text('No',
                          style: TextStyle(color: Colors.brown)),
                      onPressed: () => Navigator.of(context).pop(false),
                    ),
                    TextButton(
                      child: const Text('Yes',
                          style: TextStyle(color: Colors.brown)),
                      onPressed: () => Navigator.of(context).pop(true),
                    ),
                  ],
                ),
              );
              return shouldPop ?? false;
            },
            child: Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  maxHeight: MediaQuery.of(context).size.height * 0.7,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16.0, vertical: 8.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            review == null ? 'Add Review' : 'Edit Review',
                            style: TextStyle(
                              color: SGWColors.themeColor,
                              fontSize: 18,
                              fontFamily: 'Montserrat',
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          IconButton(
                            icon:
                                Icon(Icons.close, color: SGWColors.themeColor),
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: CreateReviewPage(
                          venueId: widget.venueId,
                          review: review,
                          updateReviewed: updateReviewed,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Future<void> confirmVoucherPurchase(
    int studentId,
    int studentWalletBalance,
    VoucherListing voucherListing,
  ) async {
    bool purchaseSuccessful = false;
    String errorMessage = '';

    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text('Confirm Purchase'),
              content: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const Divider(),
                    const Text(
                      'Voucher Name',
                      style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          fontFamily: "Montserrat"),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4.0),
                      child: Text(
                        voucherListing.voucherName,
                        style: const TextStyle(
                            fontWeight: FontWeight.w500,
                            fontSize: 14,
                            fontFamily: "Montserrat"),
                      ),
                    ),
                    const Text(
                      'Voucher Value',
                      style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          fontFamily: "Montserrat"),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4.0),
                      child: Text(
                        '\$${voucherListing.voucherValue.toString()}',
                        style: const TextStyle(
                            fontWeight: FontWeight.w500,
                            fontSize: 14,
                            fontFamily: "Montserrat"),
                      ),
                    ),
                    const Text(
                      'Validity',
                      style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          fontFamily: "Montserrat"),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4.0),
                      child: Text(
                        '${voucherListing.validityPeriodInDays.toString()} days',
                        style: const TextStyle(
                            fontWeight: FontWeight.w500,
                            fontSize: 14,
                            fontFamily: "Montserrat"),
                      ),
                    ),
                    const Divider(),
                    const Text(
                      'Current Balance',
                      style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          fontFamily: "Montserrat"),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4.0),
                      child: Text(
                        '\$${studentWalletBalance.toDouble().toString()}',
                        style: const TextStyle(
                            fontWeight: FontWeight.w500,
                            fontSize: 14,
                            fontFamily: "Montserrat"),
                      ),
                    ),
                    const Text(
                      'Voucher Cost',
                      style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          fontFamily: "Montserrat"),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4.0),
                      child: Text(
                        '\$${voucherListing.voucherCost.toString()}',
                        style: const TextStyle(
                            fontWeight: FontWeight.w500,
                            fontSize: 14,
                            fontFamily: "Montserrat"),
                      ),
                    ),
                    const Text(
                      'Balance After Purchase',
                      style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          fontFamily: "Montserrat"),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4.0),
                      child: Text(
                        '\$${(studentWalletBalance - voucherListing.voucherCost).toString()}',
                        style: const TextStyle(
                            fontWeight: FontWeight.w500,
                            fontSize: 14,
                            fontFamily: "Montserrat"),
                      ),
                    ),
                    if (errorMessage.isNotEmpty)
                      Column(
                        children: [
                          const SizedBox(height: 10),
                          Text(
                            'Error: $errorMessage',
                            style: const TextStyle(color: Colors.red),
                          ),
                        ],
                      ),
                  ],
                ),
              ),
              actions: <Widget>[
                TextButton(
                  onPressed: purchaseSuccessful
                      ? null
                      : () {
                          Navigator.of(context).pop();
                        },
                  child: const Text(
                    'Cancel',
                    style: TextStyle(color: Color(0xffE04F53)),
                  ),
                ),
                TextButton(
                  child: purchaseSuccessful
                      ? const Text('Done',
                          style: TextStyle(color: Color(0xffE04F53)))
                      : const Text('Buy',
                          style: TextStyle(color: Color(0xffE04F53))),
                  onPressed: () async {
                    if (!purchaseSuccessful) {
                      setState(() {
                        errorMessage = '';
                      });
                      try {
                        await api.buyVoucher(
                          voucherListing.voucherListingId,
                          studentId,
                        );
                        purchaseSuccessful = true;
                        Navigator.of(context).pop();
                        showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return const PurchaseSuccessfulWidget();
                          },
                        );
                      } catch (error) {
                        errorMessage = error.toString();
                        setState(() {});
                      }
                    } else {
                      Navigator.of(context).pop();
                    }
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final profileManager = Provider.of<ProfileManager>(context, listen: false);

    return currentVenue != null && voucherListings != null
        ? Scaffold(
            body: Stack(
              children: [
                PageView(
                  controller: _pageController,
                  children: <Widget>[
                    VenueBookingPage(
                      venueId: widget.venueId,
                      bookingSlots: bookingSlots!,
                      venueName: currentVenue!.venueName,
                      venueAddress: currentVenue!.address['address'],
                      studentId: profileManager.currentStudentId!,
                    ),
                    RefreshIndicator(
                      onRefresh: () async {
                        retrieveVenueDetails();
                        checkIfUserReviewed();
                        retrieveVenueReviews();
                      },
                      child: SingleChildScrollView(
                        child: Column(
                          children: <Widget>[
                            VenueHeader(
                                venueName: currentVenue!.venueName,
                                venueAddress: currentVenue!.address['address'],
                                venueCrowdLevel: currentVenue!.venueCrowdLevel,
                                cafeImage: cafeImage),
                            Container(
                              padding: const EdgeInsets.all(20),
                              color: const Color.fromARGB(255, 245, 245, 245),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  VenueRatingAndReview(
                                      averagePrice: currentVenue!.averagePrice,
                                      reviewCount: currentVenue!.reviews.length,
                                      averageRatings: currentVenue!
                                          .getVenueAverageRatings(),
                                      tags: const [
                                        "Coffee",
                                        "Booking",
                                        "New Venue"
                                      ]), // temp tags
                                  const SizedBox(height: 10),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    children: amenities!.map((amenity) {
                                      return AmenitiesIcon(text: amenity);
                                    }).toList(),
                                  ),
                                  const SizedBox(
                                    height: 20,
                                  ),
                                  VenueTextSection(
                                    title: "Description",
                                    description: currentVenue!.description,
                                  ),
                                  Text(
                                    "Service Hours",
                                    style: TextStyle(
                                        fontSize: 24,
                                        fontFamily: 'Montserrat',
                                        fontWeight: FontWeight.w800,
                                        color: SGWColors.themeColor),
                                  ),
                                  const SizedBox(
                                    height: 10,
                                  ),
                                  ServiceHours(
                                    serviceHours: parseBusinessHours(
                                        currentVenue?.businessHours),
                                  ),
                                  const SizedBox(
                                    height: 20,
                                  ),
                                  if (voucherListings!.isNotEmpty)
                                    VoucherListSection(
                                      voucherListings: voucherListings!,
                                      onVoucherPressed: (studentId,
                                          studentBalance, voucherListing) {
                                        print("STUDENT ID: $studentId");
                                        print(
                                            "STUDENT BALANCE: $studentBalance");
                                        confirmVoucherPurchase(
                                          studentId,
                                          studentBalance,
                                          voucherListing,
                                        );
                                      },
                                    ),
                                  Text(
                                    "Photos",
                                    style: TextStyle(
                                        fontSize: 24,
                                        fontFamily: 'Montserrat',
                                        fontWeight: FontWeight.w800,
                                        color: SGWColors.themeColor),
                                  ),
                                  if (imageSliders!.isNotEmpty)
                                    ImageSlider(
                                      imageSliders: imageSliders,
                                    )
                                  else
                                    Center(
                                      child: Container(
                                          margin: const EdgeInsets.all(75),
                                          child: const Text("No Photos")),
                                    ),
                                  Row(
                                    children: [
                                      Text(
                                        "Ratings & Reviews",
                                        style: TextStyle(
                                            fontSize: 24,
                                            fontFamily: 'Montserrat',
                                            fontWeight: FontWeight.w800,
                                            color: SGWColors.themeColor),
                                      ),
                                      !reviewed!
                                          ? IconButton(
                                              onPressed: () {
                                                //Open up add review modal
                                                _showCreateReviewPageInDialog(
                                                    context, null);
                                              },
                                              icon: const Icon(
                                                Icons.add_box,
                                                size: 32.0,
                                                color: Colors.green,
                                              ),
                                            )
                                          : Container(
                                              padding: const EdgeInsets.all(5),
                                              margin:
                                                  const EdgeInsets.symmetric(
                                                      horizontal: 10),
                                              child: const Center(
                                                  child: Icon(
                                                Icons.check_circle,
                                                color: Colors.green,
                                              )),
                                            )
                                    ],
                                  ),
                                  const SizedBox(
                                    height: 10,
                                  ),
                                  ...reviews!
                                      .take(3)
                                      .map((review) => ReviewCard(
                                            review: review,
                                            openModel: () =>
                                                _showCreateReviewPageInDialog(
                                                    context, review),
                                          ))
                                      .toList(),
                                  if (reviews!.length == 0)
                                    Center(
                                      child: Container(
                                          margin: const EdgeInsets.all(30),
                                          child: const Text("No Reviews")),
                                    ),
                                  if (reviews!.length > 3)
                                    Center(
                                        child: TextButton(
                                      child: const Text("view all",
                                          style: TextStyle(
                                              fontFamily: 'Montserrat',
                                              decoration:
                                                  TextDecoration.underline,
                                              color: Colors.grey)),
                                      onPressed: () {
                                        //Open up all the reviews
                                        showModalBottomSheet(
                                          context: context,
                                          isScrollControlled:
                                              true, // Ensures the sheet takes the full screen height
                                          builder: (BuildContext context) {
                                            return ViewAllReview(
                                              reviews: reviews,
                                              openModel:
                                                  _showCreateReviewPageInDialog,
                                            );
                                          },
                                        );
                                      },
                                    ))
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    menu != null
                        ? SingleChildScrollView(
                            child: Container(
                              color: Colors.black,
                              width: double.infinity,
                              height: MediaQuery.of(context).size.height,
                              child: Center(
                                child: MenuPage(
                                    menu: menu!,
                                    venueOwnerUsername:
                                        currentVenue!.ownerUsername,
                                    studentId:
                                        profileManager.currentStudentId!),
                              ),
                            ),
                          )
                        : const Center(
                            child: Text(
                              "No Menu Available",
                              style: TextStyle(
                                  fontSize: 24,
                                  fontFamily: 'Montserrat',
                                  fontWeight: FontWeight.w800,
                                  color: Colors.black),
                            ),
                          )
                  ],
                ),
                Positioned(
                  bottom: 16.0,
                  left: 0.0,
                  right: 0.0,
                  child: Center(
                    child: SmoothPageIndicator(
                      controller: _pageController,
                      count: 3,
                      effect: WormEffect(
                        dotColor: Colors.grey.withOpacity(0.5),
                        activeDotColor: const Color.fromARGB(255, 0, 46, 126)
                            .withOpacity(0.5),
                        dotHeight: 10,
                        dotWidth: 10,
                      ),
                      onDotClicked: (index) {
                        _pageController.animateToPage(
                          index,
                          duration: const Duration(milliseconds: 500),
                          curve: Curves.easeInOut,
                        );
                      },
                    ),
                  ),
                ),
              ],
            ),
          )
        : const SpinKitRing(color: Colors.grey);
  }
}
