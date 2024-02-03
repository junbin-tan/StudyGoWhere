import 'package:flutter/material.dart';

class PriceRatingSlider extends StatefulWidget {
  final double initialMin;
  final double initialMax;
  final ValueChanged<RangeValues> onChanged;

  PriceRatingSlider({
    required this.onChanged,
    this.initialMin = 1,
    this.initialMax = 5,
  });

  @override
  _PriceRatingSliderState createState() => _PriceRatingSliderState();
}

class _PriceRatingSliderState extends State<PriceRatingSlider> {
  late RangeValues _currentRangeValues;

  @override
  void initState() {
    super.initState();
    _currentRangeValues = RangeValues(widget.initialMin, widget.initialMax);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        RangeSlider(
          values: _currentRangeValues,
          onChanged: (RangeValues values) {
            setState(() {
              _currentRangeValues = values;
            });
            widget.onChanged(_currentRangeValues);
          },
          min: 1,
          max: 5,
          divisions: 4,
          activeColor: Colors.brown[500],
          inactiveColor: Colors.brown[100],
          overlayColor: MaterialStateProperty.resolveWith(
              (states) => Colors.brown.withOpacity(0.2)),
        ),
        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Align(
                alignment: Alignment(-0.4, 0.0),
                child: Text("\$", style: TextStyle(fontSize: 12)),
              ),
            ),
            Expanded(
              child: Align(
                alignment: Alignment(-0.1, 0.0),
                child: Text("\$\$", style: TextStyle(fontSize: 12)),
              ),
            ),
            Expanded(
              child: Align(
                alignment: Alignment(0.0, 0.0),
                child: Text("\$\$\$", style: TextStyle(fontSize: 12)),
              ),
            ),
            Expanded(
              child: Align(
                alignment: Alignment(0.2, 0.0),
                child: Text("\$\$\$\$", style: TextStyle(fontSize: 12)),
              ),
            ),
            Expanded(
              child: Align(
                alignment: Alignment(0.5, 0.0),
                child: Text("\$\$\$\$\$", style: TextStyle(fontSize: 12)),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
