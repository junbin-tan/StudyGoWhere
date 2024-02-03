import 'package:flutter/material.dart';
import 'package:student_frontend/screens/help_center/create_ticket_page.dart';
import 'package:student_frontend/screens/help_center/view_all_tickets_page.dart';
import 'package:student_frontend/services/colors_list.dart';
import 'package:student_frontend/services/sgw_colors.dart';

import '../../widgets/help_center_header.dart';
import '../../model/student.dart';

class HelpCenterPage extends StatefulWidget {
  final Student? currentStudent;

  const HelpCenterPage({this.currentStudent});

  @override
  _HelpCenterPageState createState() => _HelpCenterPageState();
}

void handleSearch(String query) {
  // Not required here
}

class _HelpCenterPageState extends State<HelpCenterPage> {
  String? searchKeyword;

  void _showCreateTicketPageInDialog(BuildContext context) {
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
                  contentTextStyle: const TextStyle(color: Color(0xffE04F53)),
                  title: const Text('Are you sure?'),
                  content: const Text(
                    'You haven\'t sent the ticket. Are you sure you want to leave?',
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
                      'You haven\'t sent the ticket. Are you sure you want to leave?'),
                  actions: [
                    TextButton(
                      child: const Text('No',
                          style: TextStyle(color: Color(0xffE04F53))),
                      onPressed: () => Navigator.of(context).pop(false),
                    ),
                    TextButton(
                      child: const Text('Yes',
                          style: TextStyle(color: Color(0xffE04F53))),
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
                      decoration: BoxDecoration(
                        color: const Color(0xffE04F53).withOpacity(0.7),
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(20),
                          topRight: Radius.circular(20),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Create Ticket',
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.w500),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close, color: Colors.white),
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                          ),
                        ],
                      ),
                    ),
                    const Expanded(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: CreateTicketPage(),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: SGWColors.themeColor!.withOpacity(0.7),
        toolbarHeight: 50,
        centerTitle: true,
        title: const Text('Help Center'),
        actions: [
          IconButton(
            icon: const Icon(
              Icons.message_outlined,
              color: Colors.white,
            ),
            onPressed: () {
              _showCreateTicketPageInDialog(context);
            },
          ),
        ],
      ),
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: Column(
          children: [
            HelpCenterHeader(
              currentStudent: widget.currentStudent,
              onChanged: (value) {
                setState(() {
                  searchKeyword = value;
                });
              },
              onSearch: handleSearch,
            ),
            Expanded(
              child: ViewAllTicketsPage(
                searchKeyword: searchKeyword,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
