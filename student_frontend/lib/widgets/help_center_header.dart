import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:student_frontend/widgets/help_center_search_bar_widget.dart';

import '../model/profile_manager.dart';
import '../model/student.dart';
import 'search_bar.dart';

class HelpCenterHeader extends StatelessWidget {
  final Student? currentStudent;
  final ValueChanged<String>? onChanged;
  final Function(String) onSearch;

  const HelpCenterHeader(
      {super.key,
      required this.currentStudent,
      this.onChanged,
      required this.onSearch});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 10.0,
        left: 20.0,
        right: 20.0,
        bottom: 20.0,
      ),
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/image1-min.png'),
          fit: BoxFit.cover,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 60.0),
          HelpCenterSearchBar(
            hintText: 'Search tickets...',
            onTextChanged: onChanged,
            onSearch: onSearch,
          ),
        ],
      ),
    );
  }
}
