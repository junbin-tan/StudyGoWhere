import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as SGWIcon } from "../../Assets/image/sgw-icon-white.svg";

const Navbar = () => {
  return (
    <>
      <div className="relative flex flex-row justify-between px-6 py-10 text-lightgray-80 align-middle lg:px-36 items-center z-100">
        <Link to={"/"}>
          <div className="flex flex-row gap-4 items-center">
            {" "}
            <SGWIcon className="w-16 h-16" />
            <div className="flex flex-col">
              <p className="study-go-where-icon-font text-2xl">StudyGoWhere</p>
              <p className="">For Business</p>
            </div>
          </div>
        </Link>
        <div className="flex flex-row gap-3 items-start p-0 space-x-4 md:gap-6 lg:gap-16">
          {/* need to override text style from Link */}
          <Link
            to="/"
            className="text-lg hover:font-medium hover:text-custom-yellow ease-in duration-200"
          >
            About
          </Link>
          <Link
            to="/"
            className="text-lg hover:font-medium hover:text-custom-yellow ease-in duration-200"
          >
            Subscription Plan
          </Link>
          <Link
            to="/"
            className="text-lg hover:font-medium hover:text-custom-yellow ease-in duration-200"
          >
            Contact Us
          </Link>
          <Link
            to="/sign-up"
            className="text-lg hover:font-medium hover:text-custom-yellow ease-in duration-200"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="text-lg hover:font-medium hover:text-custom-yellow ease-in duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
