import 'package:flutter/material.dart';
import 'package:flutter_login/flutter_login.dart';
import 'package:get/get.dart';
import './login_signup_page.dart';

class LandingPage extends StatefulWidget {
  @override
  _LandingPageState createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  int _currentPage = 0;

  PageController _pageController = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        physics: const BouncingScrollPhysics(),
        onPageChanged: (int page) {
          setState(() {
            _currentPage = page;
          });
        },
        children: [
          _buildPage(
            content:
                'Find the best cafes near you for a peaceful study session.',
            imagePath: 'assets/intro_page1.png',
            actionButtons: _buildIntroScreenType1(),
          ),
          _buildPage(
            content: 'Share and explore favorite study spots with peers.',
            imagePath: 'assets/intro_page2.png',
            actionButtons: _buildIntroScreenType1(),
          ),
          _buildPage(
            content: 'Discover student-friendly cafes and exclusive deals.',
            imagePath: 'assets/intro_page3.png',
            actionButtons: _buildIntroScreenType2(),
          ),
        ],
      ),
    );
  }

  Widget _buildPageIndicator() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List<Widget>.generate(3, (int index) {
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 2.0),
          height: 7.5,
          width: 7.5,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: _currentPage == index ? Colors.black : Colors.grey,
          ),
        );
      }),
    );
  }

  Widget _buildIntroScreenType1() {
    return Column(
      children: [
        const SizedBox(height: 10.0),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.brown,
            foregroundColor: Colors.white,
            side: const BorderSide(color: Colors.black, width: 0.5),
            minimumSize: const Size(200, 35),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          onPressed: () {
            if (_currentPage < 2) {
              _pageController.animateToPage(_currentPage + 1,
                  duration: const Duration(milliseconds: 500),
                  curve: Curves.easeOut);
            } else {
              Get.to(LoginSignupPage(initialAuthMode: AuthMode.signup));
            }
          },
          child: const Text('Next'),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: Colors.brown,
            side: const BorderSide(color: Colors.black, width: 0.5),
            minimumSize: const Size(200, 35),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          onPressed: () {
            Get.to(LoginSignupPage(initialAuthMode: AuthMode.signup));
          },
          child: const Text('Skip'),
        ),
      ],
    );
  }

  Widget _buildIntroScreenType2() {
    return Column(
      children: [
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.brown,
            foregroundColor: Colors.white,
            side: const BorderSide(color: Colors.black, width: 0.5),
            minimumSize: const Size(200, 35),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          onPressed: () {
            Get.to(LoginSignupPage(initialAuthMode: AuthMode.signup));
          },
          child: const Text('Get Started'),
        ),
        Padding(
          // This is Because TextButton has invisible padding, making the entire row not centered
          padding: const EdgeInsets.only(left: 13.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Already have an account?',
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.black,
                  )),
              TextButton(
                onPressed: () {
                  Get.to(LoginSignupPage(initialAuthMode: AuthMode.signup));
                },
                child: const Text(
                  'Log In',
                  style: TextStyle(
                      color: Colors.brown,
                      fontSize: 12,
                      decoration: TextDecoration.underline),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPage({
    required String content,
    required String imagePath,
    required Widget actionButtons,
  }) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Image.asset(
          imagePath,
          height: 200.0,
        ),
        const SizedBox(height: 30.0),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Text(
            content,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
        ),
        const SizedBox(height: 40.0),
        _buildPageIndicator(),
        const SizedBox(height: 40.0),
        actionButtons,
      ],
    );
  }
}
