import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:student_frontend/model/transaction.dart';

class UserPreferences {
  static late SharedPreferences _preferences;

  static const _keyUsername = 'username';
  static const _keyToken = 'token';
  static const _keyFirstTimeLaunch = 'first_time_launch';

  // Temporary transaction store until backend is done
  static const _keyTransactions = 'transactions';

  static Future init() async =>
      _preferences = await SharedPreferences.getInstance();

  static Future setUsername(String username) async =>
      await _preferences.setString(_keyUsername, username);

  static String? getUsername() => _preferences.getString(_keyUsername);

  static Future setToken(String token) async =>
      await _preferences.setString(_keyToken, token);

  static String? getToken() => _preferences.getString(_keyToken);

  static Future setFirstTimeLaunch(bool value) async =>
      await _preferences.setBool(_keyFirstTimeLaunch, value);

  static bool? getFirstTimeLaunch() =>
      _preferences.getBool(_keyFirstTimeLaunch);

  static Future setTransactions(
      String studentId, List<Transaction> transactions) async {
    String jsonTransactions =
        json.encode(transactions.map((t) => t.toMap()).toList());
    await _preferences.setString(
        _keyTransactions + studentId, jsonTransactions);
  }

  static Future addTransaction(
      String studentId, Transaction transaction) async {
    List<Transaction>? existingTransactions = getTransactions(studentId);
    existingTransactions ??= [];
    existingTransactions.add(transaction);
    await setTransactions(studentId, existingTransactions);
  }

  static List<Transaction>? getTransactions(String studentId) {
    String? jsonTransactions =
        _preferences.getString(_keyTransactions + studentId);
    if (jsonTransactions == null) return null;

    List<Map<String, dynamic>> decodedTransactions =
        (json.decode(jsonTransactions) as List)
            .map((item) => item as Map<String, dynamic>)
            .toList();

    return decodedTransactions
        .map((jsonT) => Transaction.fromMap(jsonT))
        .toList();
  }
}
