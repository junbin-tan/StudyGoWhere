import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:location/location.dart';
import 'package:student_frontend/model/advertisement.dart';
import 'package:student_frontend/model/booking/booking.dart';
import 'package:student_frontend/model/booking/booking_response.dart';
import 'package:student_frontend/model/booking/venue_booking_day.dart';
import 'package:student_frontend/model/menu.dart';
import 'package:student_frontend/model/menu_item_quantity.dart';
import 'package:student_frontend/model/message.dart';
import 'package:student_frontend/model/transaction.dart';
import 'package:student_frontend/model/transaction_dto.dart';
import 'package:student_frontend/model/venue.dart';
import 'package:student_frontend/model/voucher.dart';
import 'package:student_frontend/model/voucher_listing.dart';
import 'package:student_frontend/services/user_preferences.dart';
import '../model/review.dart';
import '../model/ticket.dart';

class API {
  final String baseUrl = "http://192.168.0.111:5001";
  //Depending on whether emulator or physical phone. Change host.
  //Android host: 10.0.2.2
  //Physical host: wifi IP - 192.168.1.54 (EZEKIEL IP)
  // 192.168.0.111 (RYAN IP)
  final Location location = Location();
  // Topup route
  Future<Map<String, dynamic>> stripePayment(int studentId, int amount) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/public/api/stripe/payment/$studentId'),
        body: json.encode({'amount': amount * 100}), // convert to dollars
        headers: {'Content-Type': 'application/json'},
      );
      if (response.statusCode == 200) {
        if (response.body.isNotEmpty) {
          return json.decode(response.body);
        } else {
          return {
            'message':
                'stripePayment was successful, but the response body was empty'
          };
        }
      } else {
        throw Exception(
            'stripePayment failed ${response.statusCode} + ${response.body}');
      }
    } catch (e) {
      return {'error': e.toString()};
    }
  }

  // GetProfile route
  Future<Map<dynamic, dynamic>> getProfile() async {
    try {
      final response = await http.get(
          Uri.parse(
              '$baseUrl/student/profile/${UserPreferences.getUsername()}'),
          headers: {'Authorization': 'Bearer ${UserPreferences.getToken()}'});
      if (response.statusCode == 200) {
        print("getProfile OKAY");
        print(json.decode(response.body));
        return json.decode(response.body);
      } else {
        throw Exception('Failed to retrieve user profile');
      }
    } catch (e) {
      return {'error': e.toString()};
    }
  }

  Future<Map<dynamic, dynamic>> updateProfile(Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/student/profile/${UserPreferences.getUsername()}'),
        body: json.encode(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}'
        },
      );
      if (response.statusCode == 200) {
        print("OKAY");
        return {'status': '200'};
      } else {
        throw Exception('Failed to update user profile');
      }
    } catch (e) {
      return {'error': e.toString()};
    }
  }

  Future<Map<dynamic, dynamic>> register(Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/public/student/first-register'),
        body: json.encode(data),
        headers: {'Content-Type': 'application/json'},
      );
      if (response.statusCode == 200) {
        return {'message': 'Ok'};
      } else {
        return {'error': response.statusCode};
      }
    } catch (e) {
      return {'error': e.toString()};
    }
  }

  Future<Map<dynamic, dynamic>> login(Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/public/student/authenticate'),
        body: json.encode(data),
        headers: {'Content-Type': 'application/json'},
      );
      if (response.statusCode == 200) {
        print("OKAY");
        return json.decode(response.body);
      } else if (response.statusCode == 403) {
        return json.decode(response.body);
      } else if (response.statusCode == 404) {
        return json.decode(response.body);
      } else {
        return {'error': response.statusCode};
      }
    } catch (e) {
      return {'error': e.toString()};
    }
  }

  Future<Ticket> createTicket(Ticket ticket) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/student/ticket/create'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}'
        },
        body: jsonEncode(ticket.toJson()),
      );
      print(UserPreferences.getToken());

      if (response.statusCode == 200) {
        return Ticket.fromJson(jsonDecode(response.body));
      } else {
        throw Exception(
            'Failed to create ticket with status code ${response.statusCode}');
      }
    } catch (e, stacktrace) {
      print('Original exception: $e');
      print('Stack trace: $stacktrace');
      throw Exception('Error: failed to create ticket: $e');
    }
  }

  Future<List<Message>> fetchMessages(int ticketId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/student/ticket/$ticketId/getallmessages'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}',
        },
      );

      if (response.statusCode == 200) {
        List<dynamic> body = jsonDecode(response.body);
        return body.map((dynamic item) => Message.fromJson(item)).toList();
      } else {
        throw Exception(
            'Failed to load messages with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error when fetching messages: $e');
    }
  }

  Future<Message> postMessage(int ticketId, String messageContent) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/student/ticket/$ticketId/message'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}',
        },
        body: jsonEncode(<String, String>{
          'message': messageContent,
        }),
      );

      if (response.statusCode == 200) {
        return Message.fromJson(jsonDecode(response.body));
      } else {
        throw Exception(
            'Failed to post message with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error when posting message: $e');
    }
  }

  Future<void> markTicketAsRead(int ticketId) async {
    try {
      final response = await http
          .put(Uri.parse('$baseUrl/student/ticket-read/$ticketId'), headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}',
      });
      if (response.statusCode == 200) {
        print("Successfully marked ticket as read");
      } else {
        throw Exception(
            'Failed to mark ticket as read with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error when marking ticket as read: $e');
    }
  }

  Future<Map<String, dynamic>> resendVerification(String? username) async {
    try {
      Map<String, dynamic> jsonMessage = {'username': username};
      final response = await http.post(
        Uri.parse('$baseUrl/public/student/resend-verification'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(jsonMessage),
      );

      if (response.statusCode == 200) {
        return {'message': "Successfully sent verification code"};
      } else {
        return {'error': "Failed to send verification code"};
      }
    } catch (e) {
      throw Exception('Error: failed to send verification code: $e');
    }
  }

  Future<Map<dynamic, dynamic>> verifyCode(
      String? username, String? verificationCode) async {
    try {
      Map<String, dynamic> jsonMessage = {
        'username': username,
        'verificationCode': verificationCode
      };
      final response = await http.post(
        Uri.parse('$baseUrl/public/student/verify'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(jsonMessage),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        return {'error': "Failed to verify code"};
      }
    } catch (e) {
      throw Exception('Error: Failed to verify code');
    }
  }

  Future<List<Ticket>> getRelatedTickets(String username) async {
    final response = await http.get(
      Uri.parse('$baseUrl/student/ticket/getall/$username'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}'
      },
    );

    if (response.statusCode == 200) {
      List<dynamic> responseBody = jsonDecode(response.body);
      List<Ticket> tickets =
          responseBody.map((i) => Ticket.fromJson(i)).toList();
      return tickets;
    } else {
      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to load tickets');
    }
  }

  Future<Venue> getVenue(int venueId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/student/venue/$venueId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}'
      },
    );

    if (response.statusCode == 200) {
      print(response.body);
      return Venue.fromMap(jsonDecode(response.body));
    } else {
      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to load venue');
    }
  }

  /*
  Gets all venues from the server
  */
  Future<List<Map<String, dynamic>>> getAllVenues() async {
    final LocationData currentLocation = await location.getLocation();
    final response = await http.get(
      Uri.parse(
          '$baseUrl/student/venue/getallactivatedvenues?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}'
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> decodedData = jsonDecode(response.body);
      final List<Map<String, dynamic>> res = [];
      for (var data in decodedData) {
        Map<String, dynamic> entry = {};
        entry["venue"] = Venue.fromMap(data["venue"]);
        double distance = data['distance'];
        distance = (distance / 10).round() / 100;
        entry["distance"] = distance;
        res.add(entry);
      }
      return res;
    } else {
      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to load venue');
    }
  }

/*
  Gets all voucher listings
  */
  Future<List<VoucherListing>> getAllVenueVoucherListing() async {
    final response = await http.get(
      Uri.parse('$baseUrl/student/getallvoucherlistings'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load voucher listings');
    }
  }

  Future<Review> createReview(Map<String, dynamic> reviewWithVenueId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/student/review'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}'
        },
        body: jsonEncode(reviewWithVenueId),
      );

      if (response.statusCode == 200) {
        print("Success");
        print(response.body);
        return Review.fromJson(jsonDecode(response.body));
      } else {
        throw Exception(
            'Failed to create review with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error: failed to create review: $e');
    }
  }

  Future<bool> checkReviewed(int venueId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/student/review/check?venueId=$venueId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}'
        },
      );

      if (response.statusCode == 200) {
        return bool.parse(response.body);
      } else {
        throw Exception(
            'Failed to check if user reviewed with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error: failed to check if user reviewed: $e');
    }
  }

  Future<List<Review>> getVenueReviews(int venueId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/student/venue/$venueId/review'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}'
        },
      );

      if (response.statusCode == 200) {
        List<Review> reviews =
            List<Review>.from(jsonDecode(response.body).map((obj) {
          obj['review']['studentUsername'] = obj['username'];
          Review res = Review.fromJson(obj['review']);
          return res;
        }));
        return reviews;
      } else {
        throw Exception(
            'Failed to retrieve venue reviews with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error: failed to retrieve venue reviews: $e');
    }
  }

  Future<Advertisement?> getNearbyAdvertisement() async {
    final LocationData currentLocation = await location.getLocation();
    final response = await http.get(
      Uri.parse(
          '$baseUrl/student/advertisement?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}'
      },
    );

    if (response.statusCode == 200) {
      if (jsonDecode(response.body).isEmpty) {
        return null;
      }
      return Advertisement.fromJson(jsonDecode(response.body)[0]);
    } else {
      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to load nearby venues');
    }
  }

  Future<int> getNearbyVenueFromAdvertisement(int advertId) async {
    final LocationData currentLocation = await location.getLocation();
    final response = await http.get(
      Uri.parse(
          '$baseUrl/student/advertisement/nearestVenue?advertisementId=$advertId&latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}'
      },
    );

    if (response.statusCode == 200) {
      print("NEAREST VENUE HERE!");
      print(response.body);
      return jsonDecode(response.body);
    } else {
      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to load nearby venues');
    }
  }

  /*
  Gets all voucher listings for a specific venue (owner)
  */
  Future<List<VoucherListing>> getAllVoucherListingsByOwnerUsername(
      String ownerUsername) async {
    final response = await http.get(
      Uri.parse('$baseUrl/student/getallvoucherlistings/$ownerUsername'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}',
      },
    );
    if (response.statusCode == 200) {
      List jsonResponse = json.decode(response.body);
      return jsonResponse
          .map((voucher) => VoucherListing.fromJson(voucher))
          .toList();
    }
    if (response.statusCode == 204) {
      return [];
    } else {
      throw Exception('Failed to load voucher listings for owner');
    }
  }

  /*
  Student buy voucher
  */
  Future<Voucher> buyVoucher(int voucherListingId, int studentId) async {
    final response = await http.post(
      Uri.parse(
          '$baseUrl/student/buyvoucher/$voucherListingId?studentId=$studentId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}',
      },
    );

    if (response.statusCode == 200) {
      print("Successfully bought voucher @ API dart");
      return Voucher.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to buy voucher');
    }
  }

  /*
  Get all student vouchers
  */
  Future<List<Voucher>> getAllStudentVouchers(int studentId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/student/getallvouchers/$studentId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}',
      },
    );

    if (response.statusCode == 200) {
      List jsonResponse = json.decode(response.body);
      return jsonResponse.map((voucher) => Voucher.fromJson(voucher)).toList();
    } else {
      throw Exception('Failed to load vouchers for student');
    }
  }

  /*
  Activate voucher (as student)
  */
  Future<Voucher> activateVoucher(int voucherId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/student/activatevoucher/$voucherId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}',
      },
    );

    if (response.statusCode == 200) {
      print("Successfully activated voucher @ API dart");
      return Voucher.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to activate voucher');
    }
  }

  /*
  Fetch my reviews
  */
  Future<List<dynamic>> getMyReviews() async {
    final response = await http.get(
      Uri.parse('$baseUrl/student/my-review'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}',
      },
    );
    if (response.statusCode == 200) {
      print("Successfully retrieved my reviews");
      return json.decode(response.body);
    } else {
      throw Exception('Failed to retrieve my reviews');
    }
  }

/*
  Get Nearest venues list
  */
  Future<List<Map<String, dynamic>>> getNearbyVenues(
      double lat, double long) async {
    final response = await http.get(
      Uri.parse('$baseUrl/student/venues?latitude=$lat&longitude=$long'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${UserPreferences.getToken()}',
      },
    );

    if (response.statusCode == 200) {
      print("Successfully fetched venues in get nearest venues @ API");
      final List<dynamic> jsonResponse = json.decode(response.body);
      print(jsonResponse);

      List<Map<String, dynamic>> venues =
          jsonResponse.cast<Map<String, dynamic>>();

      return venues;
    } else {
      print('Failed with status code: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to get nearest venues');
    }
  }

  Future<Review> updateReview(Map<String, dynamic> reviewWithVenueId) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/student/review'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}'
        },
        body: jsonEncode(reviewWithVenueId),
      );

      if (response.statusCode == 200) {
        print("Success");
        print(response.body);
        return Review.fromJson(jsonDecode(response.body));
      } else {
        throw Exception(
            'Failed to create review with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error: failed to create review: $e');
    }
  }

  Future<Menu> getMenuByVenueId(int venueId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/public/get-menu-by-venue-id?venueId=$venueId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}'
        },
      );

      if (response.statusCode == 200) {
        print("Successfully retrieved menu from venue id $venueId");
        return Menu.fromJson(json.decode(response.body));
      } else if (response.statusCode == 404) {
        throw Exception('Menu not found for ID $venueId');
      } else {
        throw Exception('Failed to retrieve menu: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error: failed to retrieve menu: $e');
    }
  }

  Future<TransactionDTO> createTransactionForMultipleItems(
      List<MenuItemQuantity> menuItemQuantities,
      int payerWalletId,
      String receiverUsername) async {
    var queryParameters = {
      'payerWalletId': payerWalletId.toString(),
      'receiverUsername': receiverUsername,
    };

    String queryString = Uri(queryParameters: queryParameters).query;

    try {
      final response = await http.post(
        Uri.parse(
            '$baseUrl/public/create-multiple-menuitem-transaction?$queryString'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}'
        },
        body: jsonEncode(menuItemQuantities.map((e) => e.toJson()).toList()),
      );

      if (response.statusCode == 200) {
        return TransactionDTO.fromJson(jsonDecode(response.body));
      } else {
        throw Exception(
            'Failed to create transaction with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error: failed to create transaction: $e');
    }
  }

  Future<List<VenueBookingDay>> getBookingSlotsByVenueId(int venueId) async {
    try {
      final response = await http.get(
        Uri.parse(
            '$baseUrl/public/get-booking-slots-from-venue?venueId=$venueId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}'
        },
      );

      if (response.statusCode == 200) {
        print("Successfully retrieved booking slots from venue id $venueId");
        List<dynamic> jsonResponse = json.decode(response.body);
        return jsonResponse
            .map((data) => VenueBookingDay.fromJson(data))
            .toList();
      } else if (response.statusCode == 404) {
        throw Exception('Booking slots not found for venue ID $venueId');
      } else {
        throw Exception('Failed to retrieve booking slots: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error: failed to retrieve booking slots: $e');
    }
  }

  Future<BookingResponse> createBooking(
      int venueId, int studentId, List<int> slotIds) async {
    try {
      final response = await http.post(
        Uri.parse(
            '$baseUrl/public/create-booking?venueId=$venueId&studentId=$studentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}'
        },
        body: json.encode(slotIds),
      );

      if (response.statusCode == 200) {
        print(
            "Successfully created booking for venue id $venueId and student id $studentId");
        Map<String, dynamic> jsonResponse = json.decode(response.body);
        return BookingResponse.fromJson(jsonResponse);
      } else {
        throw Exception('Failed to create booking: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error: failed to create booking: $e');
    }
  }

  Future<List<Booking>> getBookingByStudent(int studentId) async {
    try {
      final response = await http.get(
        Uri.parse(
            '$baseUrl/public/get-bookings-by-student?studentId=$studentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}'
        },
      );

      if (response.statusCode == 200) {
        print("Successfully retrieved booking for student id $studentId");

        List<dynamic> jsonResponse = json.decode(response.body);
        return jsonResponse.map((data) => Booking.fromJson(data)).toList();
      } else if (response.statusCode == 404) {
        throw Exception('Booking not found for student ID $studentId');
      } else {
        throw Exception('Failed to retrieve booking: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error: failed to retrieve booking: $e');
    }
  }

  Future<Booking> cancelBooking(int bookingId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/public/cancel-booking?bookingId=$bookingId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${UserPreferences.getToken()}'
        },
      );

      if (response.statusCode == 200) {
        print("Successfully cancelled booking for booking id $bookingId");

        Map<String, dynamic> jsonResponse = json.decode(response.body);
        return Booking.fromJson(jsonResponse);
      } else if (response.statusCode == 404) {
        throw Exception('Booking not found for booking ID $bookingId');
      } else {
        throw Exception('Failed to retrieve booking: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error: failed to retrieve booking: $e');
    }
  }

  Future<List<Transaction>> retrieveOwnTransactions() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/student/own-transactions'),
        headers: {'Authorization': 'Bearer ${UserPreferences.getToken()}'},
      );

      if (response.statusCode == 200) {
        List<dynamic> responseBody = jsonDecode(response.body);
        List<Transaction> res = [];
        print("RETRIEVING OKAY FOR TRANSACTIONS");
        responseBody.forEach((transaction) {
          print(transaction);
          res.add(Transaction.fromMap(transaction));
        });

        return res;
      } else if (response.statusCode == 404) {
        throw Exception('Error in fetching own transactions');
      } else {
        throw Exception('Failed to retrieve transactions: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error: failed to retrieve transactions: $e');
    }
  }

  Future<Booking> completeBooking(int bookingId) async {
    try {
      final repsonse = await http.post(
          Uri.parse('$baseUrl/public/complete-booking?bookingId=$bookingId'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${UserPreferences.getToken()}'
          });

      if (repsonse.statusCode == 200) {
        print("Successfully completed booking for booking id $bookingId");

        Map<String, dynamic> jsonResponse = json.decode(repsonse.body);
        return Booking.fromJson(jsonResponse);
      } else if (repsonse.statusCode == 404) {
        throw Exception('Booking not found for booking ID $bookingId');
      } else {
        throw Exception('Failed to retrieve booking: ${repsonse.body}');
      }
    } catch (e) {
      throw Exception('Error: failed to retrieve booking: $e');
    }
  }
}
