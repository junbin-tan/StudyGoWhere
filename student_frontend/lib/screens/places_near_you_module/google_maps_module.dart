import 'dart:typed_data';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:student_frontend/screens/venues/venue_details_page.dart';
import 'package:get/get.dart';

class GoogleMapModule extends StatefulWidget {
  final List<Map<String, dynamic>> nearbyVenues;

  const GoogleMapModule({required this.nearbyVenues});

  @override
  _GoogleMapModuleState createState() => _GoogleMapModuleState();
}

class _GoogleMapModuleState extends State<GoogleMapModule> {
  final Location location = Location();
  LatLng? userPosition;
  Marker? currentLocationMarker;
  Set<Marker> markers = Set<Marker>();

  @override
  void initState() {
    super.initState();
    _fetchCurrentLocation();
  }

  Future<Uint8List> getBytesFromAsset(String path, int width) async {
    ByteData data = await rootBundle.load(path);
    Codec codec = await instantiateImageCodec(data.buffer.asUint8List(),
        targetWidth: width);
    FrameInfo fi = await codec.getNextFrame();

    return (await fi.image.toByteData(format: ImageByteFormat.png))!
        .buffer
        .asUint8List();
  }

  Future<Uint8List> getBytesFromIcon(
      IconData icon, Color color, double size) async {
    final recorder = PictureRecorder();
    final canvas = Canvas(
        recorder, Rect.fromPoints(const Offset(0.0, 0.0), Offset(size, size)));

    final iconStr = String.fromCharCode(icon.codePoint);
    final textPainter = TextPainter(textDirection: TextDirection.ltr);
    textPainter.text = TextSpan(
        text: iconStr,
        style: TextStyle(
            letterSpacing: 0,
            fontSize: size,
            fontFamily: icon.fontFamily,
            color: color));
    textPainter.layout();
    textPainter.paint(canvas, const Offset(0.0, 0.0));

    final picture = recorder.endRecording();
    final img = await picture.toImage(size.toInt(), size.toInt());
    final bytes = await img.toByteData(format: ImageByteFormat.png);

    return bytes!.buffer.asUint8List();
  }

  Future<void> _fetchCurrentLocation() async {
    try {
      final LocationData currentLocation = await location.getLocation();
      Uint8List markerIcon =
          await getBytesFromIcon(Icons.person_pin, Colors.blue[700]!, 90.0);

      setState(() {
        userPosition =
            LatLng(currentLocation.latitude!, currentLocation.longitude!);
        currentLocationMarker = Marker(
            markerId: const MarkerId('-1'),
            position: userPosition!,
            icon: BitmapDescriptor.fromBytes(markerIcon));
        markers.add(currentLocationMarker!);
      });
    } catch (e) {
      print("Failed to get user location: $e");
    }
  }

  void _onMarkerTapped(MarkerId markerId) {
    print("Marker tapped: ${markerId.value}");
  }

  @override
  Widget build(BuildContext context) {
    widget.nearbyVenues.map((venue) {
      markers.add(Marker(
        markerId: MarkerId(venue['venue']['venueName']),
        position: LatLng(venue['venue']['address']['latitude'] as double,
            venue['venue']['address']['longitude'] as double),
        infoWindow: InfoWindow(
            title: venue['venue']['venueName'],
            snippet: venue['venue']['address']['address'],
            onTap: () => {
                  Get.to(() =>
                      VenueDetailsPage(venueId: venue['venue']['venueId']))
                }),
      ));
    }).toSet();

    return Scaffold(
      body: userPosition == null || currentLocationMarker == null
          ? const Center(child: CircularProgressIndicator())
          : GoogleMap(
              initialCameraPosition: CameraPosition(
                target: userPosition!,
                zoom: 14,
              ),
              markers: markers,
              mapToolbarEnabled: false,
            ),
    );
  }
}
