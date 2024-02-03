import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:student_frontend/services/sgw_colors.dart';
import 'package:student_frontend/widgets/price_rating.dart';

class ServiceHours extends StatelessWidget {
  final Map<String, dynamic>? serviceHours;
  static TextStyle dayOfTheWeekTextStyle = TextStyle(
      fontFamily: 'Montserrat',
      fontWeight: FontWeight.w400,
      color: SGWColors.mainBodyColor,
      fontSize: 14);
  static TextStyle selectedDayOfTheWeekTextStyle = TextStyle(
      fontFamily: 'Montserrat',
      fontWeight: FontWeight.w700,
      color: SGWColors.themeColor.withOpacity(0.5),
      fontSize: 14);
  String getCurrentDayOfWeek() {
    final now = DateTime.now();
    final dayOfWeek = now.weekday;

    switch (dayOfWeek) {
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      case 7:
        return 'Sunday';
      default:
        return 'Unknown';
    }
  }

  const ServiceHours({super.key, this.serviceHours});

  @override
  Widget build(BuildContext context) {
    String todayDay = getCurrentDayOfWeek();
    return serviceHours != null
        ? IntrinsicHeight(
            child: Container(
              child: Column(
                children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(
                        "Monday",
                        style: todayDay != "Monday"
                            ? dayOfTheWeekTextStyle
                            : selectedDayOfTheWeekTextStyle,
                      ),
                      Container(
                        constraints: BoxConstraints(maxWidth: 200),
                        child: Text(
                          serviceHours?['mon'],
                          softWrap: true,
                          style: todayDay != "Monday"
                              ? dayOfTheWeekTextStyle
                              : selectedDayOfTheWeekTextStyle,
                        ),
                      )
                    ],
                  ),
                  SizedBox(height: 5),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(
                        "Tuesday",
                        style: todayDay != "Tuesday"
                            ? dayOfTheWeekTextStyle
                            : selectedDayOfTheWeekTextStyle,
                      ),
                      Container(
                        constraints: BoxConstraints(maxWidth: 200),
                        child: Text(
                          serviceHours?['tue'],
                          softWrap: true,
                          style: todayDay != "Tuesday"
                              ? dayOfTheWeekTextStyle
                              : selectedDayOfTheWeekTextStyle,
                        ),
                      )
                    ],
                  ),
                  SizedBox(height: 5),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(
                        "Wednesday",
                        style: todayDay != "Wednesday"
                            ? dayOfTheWeekTextStyle
                            : selectedDayOfTheWeekTextStyle,
                      ),
                      Container(
                        constraints: BoxConstraints(maxWidth: 200),
                        child: Text(
                          serviceHours?['wed'],
                          softWrap: true,
                          style: todayDay != "Wednesday"
                              ? dayOfTheWeekTextStyle
                              : selectedDayOfTheWeekTextStyle,
                        ),
                      )
                    ],
                  ),
                  SizedBox(height: 5),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(
                        "Thursday",
                        style: todayDay != "Thursday"
                            ? dayOfTheWeekTextStyle
                            : selectedDayOfTheWeekTextStyle,
                      ),
                      Container(
                        constraints: BoxConstraints(maxWidth: 200),
                        child: Text(
                          serviceHours?['thu'],
                          softWrap: true,
                          style: todayDay != "Thursday"
                              ? dayOfTheWeekTextStyle
                              : selectedDayOfTheWeekTextStyle,
                        ),
                      )
                    ],
                  ),
                  SizedBox(height: 5),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(
                        "Friday",
                        style: todayDay != "Friday"
                            ? dayOfTheWeekTextStyle
                            : selectedDayOfTheWeekTextStyle,
                      ),
                      Container(
                        constraints: BoxConstraints(maxWidth: 200),
                        child: Text(
                          serviceHours?['fri'],
                          softWrap: true,
                          style: todayDay != "Friday"
                              ? dayOfTheWeekTextStyle
                              : selectedDayOfTheWeekTextStyle,
                        ),
                      )
                    ],
                  ),
                  SizedBox(height: 5),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(
                        "Saturday",
                        style: todayDay != "Saturday"
                            ? dayOfTheWeekTextStyle
                            : selectedDayOfTheWeekTextStyle,
                      ),
                      Container(
                        constraints: BoxConstraints(maxWidth: 200),
                        child: Text(
                          serviceHours?['sat'],
                          softWrap: true,
                          style: todayDay != "Saturday"
                              ? dayOfTheWeekTextStyle
                              : selectedDayOfTheWeekTextStyle,
                        ),
                      )
                    ],
                  ),
                  SizedBox(height: 5),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(
                        "Sunday",
                        style: todayDay != "Sunday"
                            ? dayOfTheWeekTextStyle
                            : selectedDayOfTheWeekTextStyle,
                      ),
                      Container(
                        constraints: BoxConstraints(maxWidth: 180),
                        child: Text(
                          serviceHours?['sun'],
                          softWrap: true,
                          style: todayDay != "Sunday"
                              ? dayOfTheWeekTextStyle
                              : selectedDayOfTheWeekTextStyle,
                        ),
                      )
                    ],
                  ),
                ],
              ),
            ),
          )
        : Center(child: Text("WAIT"));
  }
}
