import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:http/http.dart' as http;

Future<String> getFirebaseLink(String imagePath) async {
  try {
    print("Image path: $imagePath");
    final ref = FirebaseStorage.instance.ref(imagePath);
    final downloadUrl = await ref.getDownloadURL();
    print("Firedownload URL: $downloadUrl");
    return downloadUrl;
  } catch (e) {
    print('Error loading image from Firebase Storage: $e');
    return "";
  }
}

Future<Image?> getImageFromFirebaseH(String imageUrl) async {
  try {
    final ref = FirebaseStorage.instance.ref(imageUrl);
    final downloadUrl = await ref.getDownloadURL();
    print("Firedownload URL: $downloadUrl");
    final response = await http.get(Uri.parse(downloadUrl));
    if (response.statusCode == 200) {
      final Uint8List data = response.bodyBytes;
      final image = Image.memory(
        data,
        fit: BoxFit.fitHeight,
      );
      return image;
    }
  } catch (e) {
    print('Error loading image from Firebase Storage: $e');
  }
  return null;
}

Future<ImageProvider<Object>> getImageFromFirebaseFutureProvider(
    String imagePath) async {
  String imageUrl;
  try {
    // Retrieve the download URL from Firebase
    imageUrl = await FirebaseStorage.instance.ref(imagePath).getDownloadURL();
  } catch (e) {
    print("Error retrieving image from Firebase: $e");
    // Return a default image if the download fails
    return AssetImage('assets/default_image.png');
  }
  // Return the image URL wrapped in a NetworkImage
  return NetworkImage(imageUrl);
}

Future<Image?> getImageFromFirebaseF(String imageUrl) async {
  try {
    final ref = FirebaseStorage.instance.ref(imageUrl);
    final downloadUrl = await ref.getDownloadURL();
    print("Firedownload URL: $downloadUrl");
    final response = await http.get(Uri.parse(downloadUrl));
    if (response.statusCode == 200) {
      final Uint8List data = response.bodyBytes;
      final image = Image.memory(
        data,
        fit: BoxFit.fill,
      );
      return image;
    }
  } catch (e) {
    print('Error loading image from Firebase Storage: $e');
  }
  return null;
}

Future<List<Image?>?> getAllImageFromFirebase(List<String> imageUrls) async {
  try {
    List<Image?> imgs = [];
    for (String imageUrl in imageUrls) {
      print(imageUrl);
      final ref = FirebaseStorage.instance.ref(imageUrl);
      final downloadUrl = await ref.getDownloadURL();
      final response = await http.get(Uri.parse(downloadUrl));
      if (response.statusCode == 200) {
        final Uint8List data = response.bodyBytes;
        final image = Image.memory(
          data,
          fit: BoxFit.fill,
        );
        imgs.add(image);
      }
    }
    return imgs;
  } catch (e) {
    print('Error loading image from Firebase Storage: $e');
  }
  return null;
}
