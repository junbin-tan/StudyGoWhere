import 'dart:typed_data';

import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:student_frontend/model/student.dart';
import 'package:student_frontend/services/api.dart';

class ProfileManager extends ChangeNotifier {
  Student? loggedInStudent;
  Image? pp;

  ProfileManager() {
    loggedInStudent = Student(
        id: 0, email: "", username: "", balance: 0, name: "", enabled: true);
    pp = null;
  }

  // Method to update the name field
  void updateName(String newName) {
    loggedInStudent?.name = newName;
    notifyListeners();
  }

  // Method to update the email field
  void updateEmail(String newEmail) {
    loggedInStudent?.email = newEmail;
    notifyListeners();
  }

  // Method to update the wallet balance field
  void updateWalletBalance(int newWalletBalance) {
    loggedInStudent?.balance = newWalletBalance;
    notifyListeners();
  }

  bool _isProfileChanged(Map data) {
    return loggedInStudent?.name != data["name"] ||
        loggedInStudent?.email != data["email"] ||
        loggedInStudent?.username != data["username"] ||
        loggedInStudent?.balance !=
            (data["wallet"]["walletBalance"] / 100).toInt() ||
        loggedInStudent?.id != data["userId"] ||
        loggedInStudent?.enabled != data["enabled"];
  }

  Future<Image?> retrieveImage() async {
    final Reference storageReference = FirebaseStorage.instance
        .ref()
        .child('test-images/${loggedInStudent?.id}.jpg');

    try {
      final Uint8List? imageBytes = await storageReference.getData();
      final Image image = Image.memory(imageBytes!);
      return image;
    } catch (e) {
      print('Error retrieving: $e');
    }
    // Fallback image if retrival fails
    return Image.asset("assets/default_nongigachad_image.jpeg");
  }

  Future<void> fetchProfile() async {
    Map data = await API().getProfile();
    if (!_isProfileChanged(data)) return;
    loggedInStudent?.name = data["name"];
    loggedInStudent?.email = data["email"];
    loggedInStudent?.username = data["username"];
    loggedInStudent?.balance = (data["wallet"]["walletBalance"] / 100).toInt();
    loggedInStudent?.id = data["userId"];
    loggedInStudent?.enabled = data["enabled"];
    pp = await retrieveImage();

    notifyListeners();
  }

  Future<void> updateProfile(Map<String, dynamic> data) async {
    try {
      await API().updateProfile(data);
      loggedInStudent?.name = data["name"];
      loggedInStudent?.email = data["email"];
      notifyListeners();
    } catch (e) {
      print(e);
    }
  }

  void logout() {
    try {
      loggedInStudent?.name = "";
      loggedInStudent?.email = "";
      loggedInStudent?.username = "";
      loggedInStudent?.balance = 0;
      loggedInStudent?.id = 0;
      pp = null;
      notifyListeners();
    } catch (e) {
      print(e);
    }
  }

  // Method to retrieve the profile information
  Map<String, dynamic> getProfileInfo() {
    return loggedInStudent!.toJson();
  }

  int? get currentStudentId => loggedInStudent?.id;
  int? get currentStudentBalance => loggedInStudent?.balance;
}
