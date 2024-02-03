import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:student_frontend/model/ticket.dart';
import 'package:student_frontend/screens/help_center/ticket_chat_page.dart';
import 'package:student_frontend/services/api.dart';
import 'package:student_frontend/model/profile_manager.dart';
import 'package:intl/intl.dart';
import 'package:get/get.dart';

import '../../model/student.dart';

class ViewAllTicketsPage extends StatefulWidget {
  final String? searchKeyword;

  ViewAllTicketsPage({this.searchKeyword});

  @override
  _ViewAllTicketsPageState createState() => _ViewAllTicketsPageState();
}

class _ViewAllTicketsPageState extends State<ViewAllTicketsPage> {
  late Future<List<Ticket>> futureTickets;
  API api = API();
  Student? currentStudent;
  String? searchKeyword;

  @override
  void initState() {
    super.initState();
    searchKeyword = widget.searchKeyword;
    futureTickets = _fetchTickets();
  }

  @override
  void didUpdateWidget(ViewAllTicketsPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    print("ViewAllTicketsPage didUpdateWidget called");
    if (widget.key != oldWidget.key) {
      _fetchTickets();
      refreshTickets();
    }
    if (oldWidget.searchKeyword != widget.searchKeyword) {
      setState(() {
        searchKeyword = widget.searchKeyword;
      });
    }
  }

  // method can be improved
  List<Ticket> _filterTickets(List<Ticket> tickets) {
    if (searchKeyword == null || searchKeyword!.isEmpty) {
      return tickets;
    }
    final searchLowerCase = searchKeyword!.toLowerCase();

    return tickets.where((ticket) {
      final subjectMatches =
          ticket.subject.toLowerCase().contains(searchKeyword!.toLowerCase());
      // Exact match because "resolved"
      final statusMatches =
          ticket.ticketStatus.toLowerCase() == searchLowerCase;
      return subjectMatches || statusMatches;
    }).toList();
  }

  Future<List<Ticket>> _fetchTickets() async {
    final profileManager = context.read<ProfileManager>();
    await profileManager.fetchProfile();
    setState(() {
      currentStudent = profileManager.loggedInStudent;
    });

    return api.getRelatedTickets(currentStudent!.username);
  }

  Future<void> refreshTickets() async {
    print("Refreshing tickets");
    setState(() {
      futureTickets = _fetchTickets();
    });
    return futureTickets
        .then((_) => null); // Return a Future<void> for onRefresh
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: FutureBuilder<List<Ticket>>(
              future: futureTickets,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.done) {
                  if (snapshot.hasData) {
                    List<Ticket> tickets = _filterTickets(snapshot.data!);
                    print("Tickets fetched: ${snapshot.data}}");
                    tickets
                        .sort((a, b) => b.createdAt!.compareTo(a.createdAt!));

                    if (tickets.isEmpty) {
                      return RefreshIndicator(
                        onRefresh: refreshTickets,
                        child: ListView(
                          physics: const AlwaysScrollableScrollPhysics(),
                          padding: const EdgeInsets.all(0),
                          children: [
                            SizedBox(
                              height: MediaQuery.of(context).size.height / 2,
                              child: const Center(
                                child: Text(
                                  'No tickets found',
                                  style: TextStyle(
                                    color: Colors.black,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }

                    return RefreshIndicator(
                      onRefresh: refreshTickets,
                      child: ListView.builder(
                        itemCount: tickets.length,
                        itemBuilder: (context, index) {
                          Ticket ticket = tickets[index];
                          return Card(
                            child: InkWell(
                              onTap: () {
                                api.markTicketAsRead(ticket.ticketId!);
                                Get.to(TicketChatPage(
                                  ticket: ticket,
                                  currentStudent: currentStudent,
                                ));
                              },
                              child: ListTile(
                                title: Text(
                                  ticket.subject,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w400,
                                    color: Colors.black,
                                  ),
                                ),
                                subtitle: Text(
                                  'Created At: ${DateFormat('yyyy-MM-dd').format(ticket.createdAt!.toLocal())}',
                                ),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: <Widget>[
                                    if (ticket.notifyClient)
                                      Container(
                                        margin: const EdgeInsets.only(right: 8),
                                        width: 10,
                                        height: 10,
                                        decoration: const BoxDecoration(
                                          color: Colors.blue,
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                    const SizedBox(width: 5),
                                    Text(
                                      ticket.ticketStatus,
                                      style: TextStyle(
                                        color:
                                            ticket.ticketStatus.toLowerCase() ==
                                                    'resolved'
                                                ? Colors.green
                                                : Colors.red,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    );
                  } else if (snapshot.hasError) {
                    return Center(child: Text("Error: ${snapshot.error}"));
                  }
                }
                return const Center(child: CircularProgressIndicator());
              },
            ),
          ),
        ],
      ),
    );
  }
}
