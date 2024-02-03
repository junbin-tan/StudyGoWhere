import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:student_frontend/model/message.dart';
import 'package:student_frontend/model/student.dart';
import 'package:student_frontend/model/ticket.dart';
import 'package:student_frontend/screens/help_center/help_center_page.dart';
import 'package:student_frontend/services/api.dart';
import 'package:student_frontend/services/colors_list.dart';

class TicketChatPage extends StatefulWidget {
  final Ticket ticket;
  final Student? currentStudent;

  const TicketChatPage(
      {super.key, required this.ticket, required this.currentStudent});

  @override
  _TicketChatPageState createState() => _TicketChatPageState();
}

class _TicketChatPageState extends State<TicketChatPage> {
  late Future<List<Message>> messagesFuture;
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  Timer? _refreshTimer;

  @override
  void initState() {
    super.initState();
    messagesFuture = _loadMessages();
    _initTimer();
    WidgetsBinding.instance!.addPostFrameCallback((_) => _scrollToBottom());
  }

  void _initTimer() {
    _refreshTimer = Timer.periodic(const Duration(seconds: 10), (timer) {
      checkForNewMessages();
    });
  }

  Future<void> checkForNewMessages() async {
    final newMessagesFuture = _loadMessages();
    final currentMessages = await messagesFuture;
    final newMessages = await newMessagesFuture;

    if (isMessageListDifferent(currentMessages, newMessages)) {
      setState(() {
        messagesFuture = newMessagesFuture;
      });
      WidgetsBinding.instance!.addPostFrameCallback((_) => _scrollToBottom());
    }
  }

  bool isMessageListDifferent(
      List<Message> currentMessages, List<Message> newMessages) {
    if (currentMessages.length != newMessages.length) {
      return true;
    }

    for (int i = 0; i < currentMessages.length; i++) {
      if (currentMessages[i].messageId != newMessages[i].messageId) {
        return true;
      }
    }

    return false;
  }

  Future<List<Message>> _loadMessages() async {
    List<Message> originalList =
        await API().fetchMessages(widget.ticket.ticketId!);
    return originalList.reversed.toList();
  }

  Future<void> _sendMessage() async {
    if (_messageController.text.isNotEmpty) {
      await API().postMessage(widget.ticket.ticketId!, _messageController.text);
      _messageController.clear();

      setState(() {
        messagesFuture = _loadMessages();
      });
      _scrollToBottom();
    }
  }

  void _scrollToBottom() {
    _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
  }

  void dispose() {
    _refreshTimer?.cancel();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    ColorsList colorsList = ColorsList();
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        appBar: AppBar(
            iconTheme: IconThemeData(color: Colors.black),
            title: Text(widget.ticket.subject,
                style: TextStyle(color: Colors.black)),
            centerTitle: true,
            backgroundColor: Colors.transparent,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () {
                Get.back();
              },
            )),
        body: Column(
          children: [
            const Divider(height: 1),
            Expanded(
              child: FutureBuilder<List<Message>>(
                future: messagesFuture,
                builder: (BuildContext context,
                    AsyncSnapshot<List<Message>> snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(child: Text('Error: ${snapshot.error}'));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return const Center(child: Text('No messages available.'));
                  }

                  final messages = snapshot.data!;

                  return ListView.builder(
                    reverse: true,
                    controller: _scrollController,
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final message = messages[index];
                      final isFromCurrentStudent =
                          message.sender == widget.currentStudent?.username;
                      final timestamp = DateFormat('dd-MM-yyyy HH:mm')
                          .format(message.createdAt);

                      return Align(
                        alignment: isFromCurrentStudent
                            ? Alignment.centerRight
                            : Alignment.centerLeft,
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Tooltip(
                            message: timestamp,
                            child: Material(
                              color: isFromCurrentStudent
                                  ? Colors.green
                                  : Colors.blue,
                              borderRadius: BorderRadius.circular(10),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(
                                    vertical: 10, horizontal: 15),
                                child: Text(
                                  message.message,
                                  style: const TextStyle(color: Colors.white),
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      decoration: const InputDecoration(
                        hintText: 'Type your message...',
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.send),
                    onPressed: _sendMessage,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
