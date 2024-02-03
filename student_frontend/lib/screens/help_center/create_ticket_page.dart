import 'package:flutter/material.dart';
import 'package:student_frontend/services/api.dart';
import 'package:student_frontend/model/ticket.dart';
import 'package:student_frontend/widgets/brown_styled_button.dart';

enum TicketCategory { ACCOUNT, FINANCE, BOOKING, VOUCHER, OTHERS }

class CreateTicketPage extends StatefulWidget {
  const CreateTicketPage({super.key});

  @override
  _CreateTicketPageState createState() => _CreateTicketPageState();
}

class _CreateTicketPageState extends State<CreateTicketPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _subjectController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final List<String> _images = [];
  TicketCategory? _selectedCategory;

  Future<void> _createTicket() async {
    if (_formKey.currentState!.validate()) {
      try {
        Ticket newTicket = Ticket(
          ticketId: 0,
          subject: _subjectController.text,
          description: _descriptionController.text,
          images: _images,
          ticketStatus: "UNRESOLVED",
          ticketCategory: _selectedCategory!.toString().split('.').last,
          notifyClient: false,
          notifyAdmin: true,
        );

        print('Sending createTicket request');
        Ticket createdTicket = await API().createTicket(newTicket);
        print('Response received: ${createdTicket.toJsonString()}');

        // Clear form
        _subjectController.clear();
        _descriptionController.clear();

        // Dismiss keyboard if open
        FocusScope.of(context).unfocus();

        // Show snackbar success
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Ticket created successfully'),
            backgroundColor: Colors.green,
          ),
        );

        // Close the dialog if still open after 1 second
        Future.delayed(Duration(seconds: 1), () {
          Navigator.of(context).pop();
        });
      } catch (e, stacktrace) {
        print('Error while creating ticket: $e');
        print('Stacktrace: $stacktrace');

        // Show snackbar error
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Error creating ticket'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              children: [
                TextFormField(
                  controller: _subjectController,
                  decoration: const InputDecoration(labelText: 'Subject'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a subject';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20.0),
                DropdownButtonFormField<TicketCategory>(
                  value: _selectedCategory,
                  onChanged: (TicketCategory? newValue) {
                    setState(() {
                      _selectedCategory = newValue;
                    });
                  },
                  validator: (value) {
                    if (value == null) {
                      return 'Please select a category';
                    }
                    return null;
                  },
                  items: TicketCategory.values.map((TicketCategory category) {
                    return DropdownMenuItem<TicketCategory>(
                      value: category,
                      child: Text(category.toString().split('.').last),
                    );
                  }).toList(),
                  decoration: const InputDecoration(labelText: 'Category'),
                ),
                const SizedBox(height: 20.0),
                TextFormField(
                  controller: _descriptionController,
                  decoration: const InputDecoration(labelText: 'Description'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a description';
                    }
                    return null;
                  },
                  maxLines: 2,
                ),
                const SizedBox(height: 20.0),
                BrownStyledButton(
                  text: "Create Ticket",
                  onPressed: _createTicket,
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
