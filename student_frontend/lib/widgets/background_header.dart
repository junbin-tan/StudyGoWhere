import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';
import 'package:student_frontend/model/student.dart';
import '../screens/profile_page/user_profile_page.dart';
import 'top_up_button.dart';
import 'search_bar.dart';

class BackgroundHeader extends StatelessWidget {
  final Student? currentStudent;
  final Function(String) onSearch;
  final Color backgroundColor;

  const BackgroundHeader({
    Key? key,
    required this.currentStudent,
    required this.onSearch,
    this.backgroundColor = Colors.transparent,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      color: backgroundColor,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top,
        left: 15.0,
        right: 10.0,
        bottom: 5.0,
      ),
      child: Row(
        children: [
          Expanded(
            child: CustomSearchBar(
              hintText: "Search for your new study spot",
              onSearch: onSearch,
            ),
          ),
          TopUpButton(),
          GestureDetector(
            onTap: () {
              Get.to(const UserProfilePage());
            },
            child: CircleAvatar(
              backgroundColor: Colors.transparent,
              radius: 15,
              child: SvgPicture.asset('assets/profile-circled.svg'),
            ),
          ),
        ],
      ),
    );
  }
}
