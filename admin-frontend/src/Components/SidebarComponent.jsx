import React, { useState, useEffect, useContext } from "react";
import studylogowhite from "../Resources/studylogowhite.png";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import EditProfileButton from "./Admin/EditProfileButton";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import LogoutButton from "./Admin/LogoutButton";
import Api from "../Helpers/Api";
import useEncodedToken from "../Helpers/useEncodedToken";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import DiscountIcon from "@mui/icons-material/Discount";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { ReactComponent as SGWIcon } from "../Resources/sgw-icon-white.svg";
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import useToken from "../Helpers/useToken";
const SidebarComponent = () => {
  const [open, setOpen] = useState(0);
  const { encodedToken } = useEncodedToken();
  const {token} = useToken();
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    Api.getAdminByToken(encodedToken)
      .then((response) => response.json())
      .then((data) => setAdmin(data))
      .catch((error) => console.error("Error fetching admin:", error));
  }, [encodedToken]);

  //   useEffect(() => {
  //     const handleRefresh = () => {
  //         Api.getAdminByToken(encodedToken)
  //             .then((response) => response.json())
  //             .then((data) => setAdmin(data))
  //             .catch((error) => console.error("Error fetching admin:", error));
  //     };

  //     window.addEventListener('refreshSidebar', handleRefresh);

  //     return () => {
  //         window.removeEventListener('refreshSidebar', handleRefresh);
  //     };
  // }, [encodedToken]);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div className="w-64 h-screen bg-gray-800 px-3 py-4 flex flex-col justify-between sticky top-0">
      <div>
        <div className="mt-5 ml-3 flex items-center text-xl font-semibold text-white mb-12">
          <SGWIcon className="h-12 w-12 mr-2" />
          StudyGoWhere
        </div>
        <ul className="space-y-2 font-medium">
          {/* <Link to="/home">
            <li className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group mb-1">
              <DashboardIcon />
              <span className="ml-3">Dashboard</span>
            </li>
          </Link> */}
          <Link to={"/admin"}>
            <li className="flex items-center p-2  rounded-lg text-white hover:bg-gray-700 group mb-1">
              <AdminPanelSettingsIcon />
              <span className="ml-3">Admins</span>
            </li>
          </Link>

          <li className="p-0">
            <div
              className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group mb-1"
              onClick={() => handleOpen(1)}
            >
              <LoyaltyIcon />
              <span className="ml-3">Subscriptions</span>
              <ChevronDownIcon
                className={`mx-auto h-4 w-4 transition-transform ${
                  open === 1 ? "rotate-180" : ""
                }`}
              />
            </div>
            {open === 1 && (
              <ul className="ml-4">
                <Link to="/ownerlistingpage">
                  <li className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group mb-1">
                    <ChevronRightIcon className="h-3 w-5" />
                    <span className="ml-3 text-sm">Subscribers</span>
                  </li>
                </Link>
                <Link to="/subscriptiontype">
                  <li className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group mb-1">
                    <ChevronRightIcon className="h-3 w-5" />
                    <span className="ml-3 text-sm">Subcription types</span>
                  </li>
                </Link>
              </ul>
            )}
          </li>
          <Link to={"/user-support"}>
            <li className="flex items-center p-2  rounded-lg text-white hover:bg-gray-700 group mb-1">
              <SupportAgentIcon />
              <span className="ml-3">User Support</span>
            </li>
          </Link>
        </ul>

        <Link to={"/venuelistingpage"}>
          <li className="flex items-center p-2  rounded-lg text-white hover:bg-gray-700 group mb-1">
            <LocationCityIcon />
            <span className="ml-3">Venues</span>
          </li>
        </Link>
        <Link to={"/student"}>
          <li className="flex items-center p-2  rounded-lg text-white hover:bg-gray-700 group mb-1">
            <InsertEmoticonIcon />
            <span className="ml-3">Students</span>
          </li>
        </Link>

        <Link to={"/ownerlistingpage"}>
          <li className="flex items-center p-2  rounded-lg text-white hover:bg-gray-700 group mb-1">
            <AccountBoxIcon />
            <span className="ml-3">Owners</span>
          </li>
        </Link>
        <Link to={"/viewVoucherListingPage"}>
          <li className="flex items-center p-2  rounded-lg text-white hover:bg-gray-700 group mb-1">
            <DiscountIcon />
            <span className="ml-3">Voucher Listings</span>
          </li>
        </Link>
        <Link to={"/reviews"}>
          <li className="flex items-center p-2  rounded-lg text-white hover:bg-gray-700 group mb-1">
            <RateReviewIcon />
            <span className="ml-3">Review</span>
          </li>
        </Link>

        <Link to={"/advertisementlistingpage"}>
          <li className="flex items-center p-2  rounded-lg text-white hover:bg-gray-700 group mb-1">
            <AdsClickIcon />
            <span className="ml-3">Advertisements</span>
          </li>
        </Link>
        <Link to={"/transactions"}>
          <li className="flex items-center p-2  rounded-lg text-white hover:bg-gray-700 group mb-1">
            <ReceiptIcon />
            <span className="ml-3">All Transactions</span>
          </li>
        </Link>
        {token?.sub === "FINANCE" && <Link to={"/wallet"}>
          <li className="flex items-center p-2  rounded-lg text-white hover:bg-gray-700 group mb-1">
            <AccountBalanceWalletIcon />
            <span className="ml-3">Wallet</span>
          </li>
        </Link>}
      </div>
      <div className="text-white ml-2 flex flex-col">
        <div className="ml-2 mb-3 text-lg">
          <span className="font-medium">
            User:{" "}
            <span className="text-teal-400">{admin?.username || "user"}</span>
          </span>
        </div>
        <div className="mb-2 ml-2">
          <EditProfileButton />
        </div>
        <div className="text-white ml-2">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
