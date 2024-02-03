import 'package:flutter/material.dart';

class HelpCenterSearchBar extends StatefulWidget {
  final String hintText;
  final ValueChanged<String>? onTextChanged;
  final Function(String) onSearch;
  final String initialQuery;

  const HelpCenterSearchBar({
    Key? key,
    required this.hintText,
    this.onTextChanged,
    required this.onSearch,
    this.initialQuery = '',
  }) : super(key: key);

  @override
  _HelpCenterSearchBarState createState() => _HelpCenterSearchBarState();
}

class _HelpCenterSearchBarState extends State<HelpCenterSearchBar> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialQuery);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 10.0),
      child: TextField(
        controller: _controller,
        onChanged: widget.onTextChanged,
        onSubmitted: (query) {
          widget.onSearch(query);
        },
        decoration: InputDecoration(
          hintText: widget.hintText,
          hintStyle: TextStyle(
            color: Colors.black.withOpacity(0.5),
            fontSize: 14.0,
            fontWeight: FontWeight.w400,
          ),
          prefixIcon: Icon(Icons.search, color: Colors.brown[800]!),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(20),
            borderSide: BorderSide.none,
          ),
          contentPadding: const EdgeInsets.symmetric(vertical: 10.0),
          filled: true,
          fillColor: Colors.white,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
