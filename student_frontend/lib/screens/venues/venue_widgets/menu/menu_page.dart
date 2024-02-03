import 'package:flutter/material.dart';
import 'package:student_frontend/model/menu.dart';
import 'package:student_frontend/model/menu_item.dart';
import 'package:student_frontend/model/menu_item_quantity.dart';
import 'package:student_frontend/model/menu_section.dart';
import 'package:student_frontend/model/transaction_dto.dart';
import 'package:student_frontend/screens/venues/venue_widgets/menu/item_aggregate.dart';
import 'package:student_frontend/services/api.dart';
import 'package:student_frontend/services/colors_list.dart';

class MenuPage extends StatefulWidget {
  final Menu menu;
  final String venueOwnerUsername;
  final int studentId;

  MenuPage(
      {Key? key,
      required this.menu,
      required this.venueOwnerUsername,
      required this.studentId})
      : super(key: key);

  @override
  _MenuPageState createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  final Map<int, int> cart = {};
  final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();
  ColorsList colorsList = ColorsList();
  API api = API();
  TransactionDTO? latestTransaction;

  void addToCart(int menuItemId) {
    setState(() {
      if (cart.containsKey(menuItemId)) {
        cart[menuItemId] = cart[menuItemId]! + 1;
      } else {
        cart[menuItemId] = 1;
      }
    });
  }

  void removeFromCart(int menuItemId) {
    setState(() {
      if (cart.containsKey(menuItemId)) {
        if (cart[menuItemId] == 1) {
          cart.remove(menuItemId);
        } else {
          cart[menuItemId] = cart[menuItemId]! - 1;
        }
      }
    });
  }

  MenuItem findMenuItemById(int menuItemId) {
    for (var section in widget.menu.menuSections) {
      for (var item in section.menuItems) {
        if (item.menuItemId == menuItemId) {
          return item;
        }
      }
    }
    throw Exception('Menu item not found');
  }

  int getTotalCartItems() {
    return cart.values
        .fold(0, (previousValue, quantity) => previousValue + quantity);
  }

  double calculateTotalAmount() {
    double total = 0.0;
    for (var entry in cart.entries) {
      MenuItem item = findMenuItemById(entry.key);
      total += item.sellingPrice * entry.value;
    }
    return total;
  }

  Future<bool> showConfirmationDialog(
      BuildContext context, double totalPrice) async {
    return await showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Confirm Purchase'),
            content: Text(
                'The total amount is \$${totalPrice.toStringAsFixed(2)}. Do you want to proceed?'),
            actions: <Widget>[
              TextButton(
                  onPressed: () => Navigator.of(context).pop(false),
                  style: TextButton.styleFrom(
                    foregroundColor: colorsList.blueHomePage,
                  ),
                  child: const Text('Cancel')),
              TextButton(
                  onPressed: () => Navigator.of(context).pop(true),
                  style: TextButton.styleFrom(
                    foregroundColor: colorsList.blueHomePage,
                  ),
                  child: const Text('Confirm')),
            ],
          ),
        ) ??
        false;
  }

  Future<void> checkout(int payerWalletId, String receiverUsername) async {
    double totalAmount = calculateTotalAmount();

    bool confirm = await showConfirmationDialog(context, totalAmount);
    if (!confirm) return;

    print("Checkout payer ID: $payerWalletId");
    print("Checkout receiver: $receiverUsername");

    List<MenuItemQuantity> menuItemAndQuantities = cart.entries
        .map((entry) => MenuItemQuantity(
              menuItemId: entry.key,
              quantity: entry.value,
            ))
        .toList();

    try {
      var transactionDTO = await api.createTransactionForMultipleItems(
        menuItemAndQuantities,
        payerWalletId,
        receiverUsername,
      );

      print("Transaction created successfully");
      print(transactionDTO.toString());

      // Clear the cart
      setState(() {
        latestTransaction = transactionDTO;
        cart.clear();
      });

      // Close drawer
      Navigator.of(context).pop();
    } catch (e) {
      print("Error during checkout: $e");
    }
  }

  Drawer buildCartDrawer() {
    MenuItem findMenuItemById(int menuItemId) {
      for (var section in widget.menu.menuSections) {
        for (var item in section.menuItems) {
          if (item.menuItemId == menuItemId) {
            return item;
          }
        }
      }
      throw Exception('Menu item not found');
    }

    return Drawer(
      child: Column(
        children: [
          Expanded(
            child: cart.isNotEmpty
                ? ListView(
                    padding: EdgeInsets.zero,
                    children: [
                      UserAccountsDrawerHeader(
                        decoration:
                            BoxDecoration(color: colorsList.blueHomePage),
                        accountName: const Text(
                          'Your Cart',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        accountEmail:
                            const Text('Check your cart before checkout'),
                        currentAccountPicture: CircleAvatar(
                          backgroundColor: Colors.white,
                          child: Icon(
                            Icons.shopping_cart_checkout_rounded,
                            size: 30.0,
                            color: colorsList.blueHomePage,
                          ),
                        ),
                      ),
                      for (var entry in cart.entries) ...[
                        ListTile(
                          title: Text(
                            findMenuItemById(entry.key).menuItemName,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          subtitle: Text('Quantity: ${entry.value}'),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove_circle_outline),
                                onPressed: () {
                                  removeFromCart(entry.key);
                                },
                              ),
                              Text(entry.value.toString()),
                              IconButton(
                                icon: const Icon(Icons.add_circle_outline),
                                onPressed: () {
                                  addToCart(entry.key);
                                },
                              ),
                            ],
                          ),
                        ),
                        const Divider(),
                      ],
                    ],
                  )
                : const Center(
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Text(
                        'There are currently no items in your cart',
                        style: TextStyle(
                          fontSize: 16.0,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
          ),
          if (cart.isNotEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(8.0),
              child: ElevatedButton(
                onPressed: () {
                  checkout(widget.studentId, widget.venueOwnerUsername);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: colorsList.blueHomePage,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
                child: const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    'Proceed to Checkout',
                    style: TextStyle(fontSize: 16.0),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Future<void> showLatestOrderDialog(BuildContext context) async {
    if (latestTransaction == null) return;

    // Create a map for aggregation
    final Map<String, ItemAggregate> aggregatedItems = {};

    for (var detail in latestTransaction!.transactionDetails) {
      for (var item in detail.billables) {
        double itemPriceInDollars =
            item.billablePrice / 100; // Convert to dollars
        if (!aggregatedItems.containsKey(item.billableName)) {
          aggregatedItems[item.billableName] =
              ItemAggregate(quantity: 1, totalPrice: itemPriceInDollars);
        } else {
          var existing = aggregatedItems[item.billableName]!;
          aggregatedItems[item.billableName] = ItemAggregate(
              quantity: existing.quantity + 1,
              totalPrice: existing.totalPrice + itemPriceInDollars);
        }
      }
    }

    List<Widget> transactionDetailsWidgets =
        aggregatedItems.entries.map((entry) {
      return ListTile(
        title: Text(entry.key),
        subtitle: Text('Quantity: ${entry.value.quantity}'),
        trailing: Text('\$${entry.value.totalPrice.toStringAsFixed(2)}'),
      );
    }).toList();

    // Now show the dialog with aggregated items
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Latest Order'),
          content: SingleChildScrollView(
            child: ListBody(
              children: [
                Text('Transaction ID: ${latestTransaction!.transactionId}'),
                Text(
                    'Total Price: \$${(latestTransaction!.totalPrice / 100).toStringAsFixed(2)}'), // Convert to dollars
                const Divider(),
                ...transactionDetailsWidgets,
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: Text(
                'Close',
                style: TextStyle(color: colorsList.blueHomePage),
              ),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    const double imageWidth = 110.0;
    const double imageHeight = 110.0;
    const double cardHeight = 135.0;
    ColorsList colorsList = ColorsList();

    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: Text(
          widget.menu.menuName,
          style: const TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w700,
            fontFamily: 'Montserrat',
          ),
        ),
        automaticallyImplyLeading: false,
        actions: [
          if (latestTransaction != null)
            IconButton(
              icon: const Icon(
                Icons.receipt_outlined,
                color: Colors.black,
              ),
              onPressed: () => showLatestOrderDialog(context),
            ),
          Stack(
            alignment: Alignment.center,
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart_outlined),
                color: Colors.black,
                onPressed: () {
                  if (scaffoldKey.currentState != null) {
                    if (scaffoldKey.currentState!.isDrawerOpen) {
                      Navigator.of(context).pop();
                    } else {
                      scaffoldKey.currentState!.openDrawer();
                    }
                  }
                },
              ),
              if (getTotalCartItems() > 0)
                Positioned(
                  left: 11,
                  top: 11,
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 14,
                      minHeight: 14,
                    ),
                    child: Text(
                      '${getTotalCartItems()}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 8,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      drawer: buildCartDrawer(),
      body: ListView.builder(
        itemCount: widget.menu.menuSections.length,
        itemBuilder: (context, sectionIndex) {
          MenuSection section = widget.menu.menuSections[sectionIndex];
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: 16.0, vertical: 16.0),
                child: Text(
                  section.menuSectionName,
                  style: TextStyle(
                    fontSize: 20,
                    color: colorsList.blueHomePage,
                    fontFamily: 'Montserrat',
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              ...section.menuItems.map((MenuItem item) {
                print("IM GONNA TRY TO CALL THIS: ${item.imageURL}");
                return Stack(
                  children: [
                    SizedBox(
                      height: cardHeight,
                      child: Card(
                        margin: const EdgeInsets.all(6.0),
                        child: Row(
                          children: [
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 8.0),
                              child: ClipRRect(
                                borderRadius: const BorderRadius.all(
                                  Radius.circular(16.0),
                                ),
                                child: item.imageURL != ""
                                    ? Image.network(
                                        item.imageURL,
                                        width: imageWidth,
                                        height: imageHeight,
                                        fit: BoxFit.cover,
                                      )
                                    : null,
                              ),
                            ),
                            Expanded(
                              child: Padding(
                                padding: const EdgeInsets.fromLTRB(
                                    16.0, 8.0, 8.0, 8.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      item.menuItemName,
                                      style: const TextStyle(
                                        fontFamily: 'Montserrat',
                                        fontWeight: FontWeight.w500,
                                        fontSize: 14,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      "\$${(item.sellingPrice).toStringAsFixed(2)}",
                                      style: const TextStyle(
                                        fontFamily: 'Montserrat',
                                        fontWeight: FontWeight.w700,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    Positioned(
                      right: 20,
                      bottom: 20,
                      child: cart.containsKey(item.menuItemId)
                          ? Container(
                              decoration: BoxDecoration(
                                color: colorsList.blueHomePage,
                                borderRadius: BorderRadius.circular(15),
                              ),
                              constraints: const BoxConstraints(
                                minWidth: 38,
                                minHeight: 38,
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  InkWell(
                                    onTap: () =>
                                        removeFromCart(item.menuItemId),
                                    child: Container(
                                      width: 35,
                                      alignment: Alignment.center,
                                      child: const Icon(Icons.remove,
                                          color: Colors.white, size: 25),
                                    ),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 6.0),
                                    child: Text(
                                      cart[item.menuItemId].toString(),
                                      style:
                                          const TextStyle(color: Colors.white),
                                    ),
                                  ),
                                  InkWell(
                                    onTap: () => addToCart(item.menuItemId),
                                    child: Container(
                                      width: 35,
                                      alignment: Alignment.center,
                                      child: const Icon(Icons.add,
                                          color: Colors.white, size: 25),
                                    ),
                                  ),
                                ],
                              ),
                            )
                          : FloatingActionButton(
                              onPressed: () => addToCart(item.menuItemId),
                              backgroundColor: colorsList.blueHomePage,
                              mini: true,
                              child: const Icon(Icons.add, size: 23),
                            ),
                    ),
                  ],
                );
              }).toList(),
            ],
          );
        },
      ),
    );
  }
}
