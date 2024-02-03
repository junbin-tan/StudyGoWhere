import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:student_frontend/model/profile_manager.dart';
import 'package:provider/provider.dart';
import 'package:student_frontend/widgets/brown_styled_button.dart';
import 'package:get/get.dart';
import 'package:student_frontend/widgets/orange_styled_buttons.dart';

class UpdateProfilePage extends StatefulWidget {
  const UpdateProfilePage({Key? key, required this.userData}) : super(key: key);
  final Map userData;

  @override
  State<UpdateProfilePage> createState() => _UpdateProfilePageState();
}

class _UpdateProfilePageState extends State<UpdateProfilePage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  PlatformFile? pickedFile;
  bool isUploading = false; // To track image upload state

  // Uploads the selected file to Firebase Storage
  // Method has been updated to prevent mounting bug during SR1
  Future<void> uploadFile() async {
    setState(() {
      isUploading = true;
    });

    final path =
        'test-images/${Provider.of<ProfileManager>(context, listen: false).loggedInStudent!.id}.jpg';
    final file = File(pickedFile!.path!);
    final ref = FirebaseStorage.instance.ref().child(path);

    try {
      await ref.putFile(file);

      // Check if widget is active
      if (!mounted) return;

      await Provider.of<ProfileManager>(context, listen: false).fetchProfile();

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text("Image uploaded successfully!"),
            backgroundColor: Colors.green),
      );
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text("Error uploading image."),
              backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          isUploading = false;
        });
      }
    }
  }

  Future<void> selectFile() async {
    final result = await FilePicker.platform.pickFiles();
    if (result == null) return;
    setState(() {
      pickedFile = result.files.first;
    });
  }

  Future<void> updateProfile() async {
    if (!_formKey.currentState!.validate()) return;
    try {
      await Provider.of<ProfileManager>(context, listen: false).updateProfile(
          {"name": nameController.text, "email": emailController.text});
      Get.back();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text("Profile updated successfully!"),
            backgroundColor: Colors.green),
      );
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text("Error updating profile."),
            backgroundColor: Colors.red),
      );
    }
  }

  @override
  void dispose() {
    emailController.dispose();
    nameController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    nameController.text = widget.userData['name'];
    emailController.text = widget.userData['email'];
  }

  Widget _profileImageWidget() {
    if (pickedFile != null) {
      return Image.file(
        File(pickedFile!.path!),
        width: double.infinity,
        fit: BoxFit.cover,
      );
    }

    if (Provider.of<ProfileManager>(context).pp != null) {
      return Provider.of<ProfileManager>(context).pp!;
    }

    return Image.asset("assets/default_nongigachad_image.jpeg");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: const IconThemeData(color: Colors.deepOrangeAccent),
        title: const Text('Update Profile',
            style: TextStyle(color: Colors.deepOrangeAccent)),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(30),
          child: Column(
            children: [
              Stack(
                children: [
                  SizedBox(
                    height: 120,
                    width: 120,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(100),
                      child: _profileImageWidget(),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(100),
                          color: Colors.deepOrangeAccent),
                      child: IconButton(
                        icon: const Icon(Icons.camera_alt_outlined),
                        color: Colors.white,
                        onPressed: () async {
                          await selectFile();
                        },
                      ),
                    ),
                  ),
                  if (isUploading)
                    Positioned.fill(
                      child: Container(
                        color: Colors.black38,
                        child: const Center(child: CircularProgressIndicator()),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 20),
              Form(
                key: _formKey,
                child: Column(
                  children: <Widget>[
                    TextFormField(
                      decoration:
                          const InputDecoration(label: Text("Full Name")),
                      controller: nameController,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your name';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      decoration: const InputDecoration(label: Text("Email")),
                      controller: emailController,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your email';
                        }
                        if (!value.contains('@')) {
                          return 'Please enter a valid email address';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 50),
                    Center(
                        child: OrangeStyledButton(
                      text: "Update Profile",
                      onPressed: () async {
                        await updateProfile();
                        if (pickedFile != null) {
                          await uploadFile();
                        }
                      },
                    )),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
