import 'dart:io';
import 'dart:convert';
import 'package:flashy_tab_bar2/flashy_tab_bar2.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:student_frontend/screens/bookings_page/bookings_page.dart';
import 'package:student_frontend/screens/home_page.dart';
import 'package:student_frontend/screens/venues/venue_details_page.dart';
import 'package:student_frontend/services/navigation_provider.dart';
import 'package:vibration/vibration.dart';

class QRScannerPage extends StatefulWidget {
  @override
  _QRScannerPageState createState() => _QRScannerPageState();
}

class _QRScannerPageState extends State<QRScannerPage> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  Barcode? result;
  QRViewController? controller;
  String? lastScannedCode;
  DateTime? lastScannedTime;

  @override
  void reassemble() {
    super.reassemble();
    if (Platform.isAndroid) {
      controller!.pauseCamera();
    } else if (Platform.isIOS) {
      controller!.resumeCamera();
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    controller?.resumeCamera();
  }

  @override
  void deactivate() {
    super.deactivate();
    controller?.pauseCamera();
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) {
      final now = DateTime.now();

      // Ignores duplicate scans in a short period of time (3s)
      if (lastScannedCode == scanData.code &&
          lastScannedTime != null &&
          now.difference(lastScannedTime!).inSeconds < 3) {
        return;
      }
      lastScannedCode = scanData.code;
      lastScannedTime = now;

      setState(() {
        result = scanData;
        // Provide vibration feedback upon successful scan
        Vibration.vibrate(duration: 200);
      });
      // Process scanned qr code & navigate to venue details page
      processQRCode(scanData.code);
    });
  }

  void processQRCode(String? code) {
    // Decode Base64 encoded string
    String decodedVenueId = utf8.decode(base64.decode(code!));

    final venueId = int.tryParse(decodedVenueId);
    if (venueId != null) {
      Get.to(
          VenueDetailsPage(
            venueId: venueId,
          ),
          transition: Transition.fade);
    } else {
      Get.defaultDialog(
        title: 'Invalid QR Code',
        content:
            const Text('The scanned QR code is not valid. Please try again.'),
        confirm: TextButton(
          child: const Text('OK'),
          onPressed: () => Get.back(),
        ),
      );
    }
  }

  void _onItemTapped(int index) {
    context.read<NavigationProvider>().setIndex(index);
    switch (index) {
      case 0:
        Get.offAll(() => MyHomePage());
        break;
      case 1:
        Get.offAll(() => QRScannerPage());
        break;
      case 2:
        Get.offAll(() => BookingsPage());
        break;
      default:
        break;
    }
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    int currentIndex = Provider.of<NavigationProvider>(context).currentIndex;
    return Scaffold(
      appBar: AppBar(
        iconTheme: const IconThemeData(color: Color.fromARGB(255, 101, 69, 31)),
        title: const Text('Venue QR Code',
            style: TextStyle(color: Color.fromARGB(255, 101, 69, 31))),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.flash_on),
            onPressed: () {
              controller?.toggleFlash();
            },
          )
        ],
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            flex: 5,
            child: QRView(
              key: qrKey,
              onQRViewCreated: _onQRViewCreated,
              overlay: QrScannerOverlayShape(
                borderColor: Colors.green,
                borderRadius: 10,
                borderLength: 30,
                borderWidth: 10,
                cutOutSize: 250,
              ),
            ),
          ),
          // Maybe replace with a button to navigate/confirm checkin?
          const Expanded(
            flex: 1,
            child: Center(
              child: SizedBox(height: 10),
            ),
          )
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
