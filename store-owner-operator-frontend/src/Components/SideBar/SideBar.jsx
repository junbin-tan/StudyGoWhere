import React, { useState, useRef, useEffect, useContext } from "react";
import VenueDropdown from "./Dropdown/VenueDropdown";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, Divider } from "@mui/material";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import profilePic from "../../Assets/image/profile_1.jpeg";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import ButtonStyles from "../../utilities/ButtonStyles";
import { OperatorUserContext } from "../../FunctionsAndContexts/OperatorUserContext";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import FetchOwnerInfoAPI from "../../FunctionsAndContexts/FetchOwnerInfoAPI";
import { RiComputerLine, RiCoupon3Line } from "react-icons/ri";
import { BiSupport, BiLogOut } from "react-icons/bi";
import { FaWallet } from "react-icons/fa";
import WalletIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { AiOutlineUser } from "react-icons/ai";
import { NewspaperOutlined } from "@mui/icons-material";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { MdRedeem, MdSpaceDashboard } from "react-icons/md";
import "./SideBar.css";
import { ReactComponent as SGWIcon } from "../../Assets/image/sgw-icon-white.svg";
import TextClassSets from "../../utilities/TextClassSets";
import { IoMdDoneAll } from "react-icons/io";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { RiAdvertisementLine } from "react-icons/ri";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const SideBar = ({ onPageChange }) => {
  const [propic, setPropic] = useState(profilePic);
  const [currentPage, setCurrentPage] = useState(window.location.pathname);
  const location = useLocation();

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location]);
  const sidebarRef = useRef(null);

  const navigate = useNavigate();

  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  // the || {} is to prevent the useContext from returning undefined; similar to using &&
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext) || {};
  const { operatorData, setOperatorData } =
    useContext(OperatorUserContext) || {};

  // Fetch owner profile picture useEffect
  useEffect(() => {
    async function fetchData() {
      if (ownerData == undefined) return;
      try {
        const url = await getDownloadURL(
          ref(storage, "/user-images/" + ownerData?.userId)
        );
        setPropic(url);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [ownerData]);
  const logoutOnClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("encodedToken");
    navigate("/");
    window.location.reload(); // reloads the page so the logged out version is shown
  };

  // this venueData is passed in, not referenced from toplevel
  const generateVenueLinks = (venueData) => {
    if (venueData == null) return "";
    return venueData.map((venue) => (
      <>
        <a
          key={venue.venueId}
          href={`/venues/${venue.venueId}`}
          className={`${
            currentPage.split("/")[2] === `${venue.venueId}`
              ? TextClassSets.sidebarLinkActive
              : ""
          } ${TextClassSets.sidebarVenue}`}
        >
          {venue.venueName}
        </a>
      </>
    ));
  };

  // Conditional rendering based on whether it is "Owner" or "Operator"

  if (token.role === "Owner") {
    return (
      <>
        <div className="min-h-fit">
          <div className="flex flex-col py-10 px-6 w-250">
            <div className="flex flex-col gap-8 text-white">
              <div className="study-go-where-icon-font px-3 text-2xl py-3 mb-4 text-white flex flex-col items-center">
                <SGWIcon className="h-24 w-24 " />
                StudyGoWhere
              </div>
              <div className="nav flex flex-col">
                <div className="nav flex flex-col gap-6">
                  {/* <div className={TextClassSets.sidebarLink}>
                    <MdOutlineSpaceDashboard size="1.5em" /> Dashboard
                  </div> */}
                  <VenueDropdown
                    icon={<StorefrontOutlinedIcon size="1.5rem" />}
                    title="Venues"
                    linkTo="/"
                    className={`${
                      currentPage === `/` ? TextClassSets.sidebarLinkActive : ""
                    } ${TextClassSets.sidebarLink}
                 overflow-y-hidden `}
                  >
                    {generateVenueLinks(ownerData.venues)}
                  </VenueDropdown>
                  <a href="/vouchers">
                    <div
                      className={`${
                        currentPage === `/vouchers`
                          ? TextClassSets.sidebarLinkActive
                          : ""
                      } + ${TextClassSets.sidebarLink}`}
                    >
                      <RiCoupon3Line size="1.5em" /> Manage Vouchers
                    </div>
                  </a>
                  <a href="/redeem-voucher">
                    <div
                      className={`${
                        currentPage === `/redeem-voucher`
                          ? TextClassSets.sidebarLinkActive
                          : ""
                      } ${TextClassSets.sidebarLink}`}
                    >
                      {/*<MdRedeem size="1.5em" /> Redeem Vouchers*/}
                      <IoMdDoneAll size={"1.5em"} /> Redeem Vouchers
                    </div>
                  </a>
                  <a href="/user-support">
                    <div
                      className={`${
                        currentPage === `/user-support`
                          ? TextClassSets.sidebarLinkActive
                          : ""
                      } ${TextClassSets.sidebarLink}`}
                    >
                      <BiSupport size="1.5rem" /> User Support
                    </div>
                  </a>
                  <a href="/subscription">
                    <div
                      className={`${
                        currentPage === `/subscription`
                          ? TextClassSets.sidebarLinkActive
                          : ""
                      } ${TextClassSets.sidebarLink}`}
                    >
                      <NewspaperOutlined size="1.5rem" /> Subscription
                    </div>
                  </a>
                  <a href="/wallet">
                    <div
                      className={`${
                        currentPage === `/wallet`
                          ? TextClassSets.sidebarLinkActive
                          : ""
                      } ${TextClassSets.sidebarLink}`}
                    >
                      <WalletIcon sx={{ fontSize: "1.5rem" }} />
                      My Wallet
                    </div>
                  </a>
                  <a href="/advertisements">
                    <div
                      className={`${
                        currentPage === `/advertisements`
                          ? TextClassSets.sidebarLinkActive
                          : ""
                      } ${TextClassSets.sidebarLink}`}
                    >
                      <RiAdvertisementLine size="1.5rem" /> Advertisements
                    </div>
                  </a>
                  <a href="/menus">
                    <div
                      className={`${
                        currentPage === `/menus`
                          ? TextClassSets.sidebarLinkActive
                          : ""
                      } ${TextClassSets.sidebarLink}`}
                    >
                      <MenuBookIcon size="1.5rem" /> Menus
                    </div>
                  </a>
                  <a
                    className={TextClassSets.sidebarLink}
                    href="/"
                    onClick={logoutOnClick}
                  >
                    <BiLogOut size="1.5rem" />
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (token.role === "Operator") {
    return (
      <>
        <div className="min-h-fit">
          <div className="flex flex-col py-10 px-6 w-250">
            <div className="flex flex-col gap-8 text-white">
              <div className="study-go-where-icon-font px-3 text-2xl py-3 mb-4 text-white flex flex-col items-center">
                <SGWIcon className="h-24 w-24 " />
                StudyGoWhere
              </div>
              <div className="nav flex flex-col gap-3">
                <div className="nav flex flex-col gap-3">
                  <a href="/">
                    <div className={TextClassSets.sidebarLink}>
                      <MdOutlineSpaceDashboard size="1.5em" /> Dashboard
                    </div>
                  </a>
                  <a href="/redeem-voucher">
                    <div
                      className={`${
                        currentPage === `/redeem-voucher`
                          ? TextClassSets.sidebarLinkActive
                          : ""
                      } ${TextClassSets.sidebarLink}`}
                    >
                      {/*<MdRedeem size="1.5em" /> Redeem Vouchers*/}
                      <IoMdDoneAll size={"1.5em"} /> Redeem Vouchers
                    </div>
                  </a>
                  <a href="/kds">
                    <div className={TextClassSets.sidebarLink}>
                      <RiComputerLine size="1.5em" /> Kitchen Display System
                    </div>
                  </a>
                  <a href="/user-support">
                    <div
                      className={`${
                        currentPage === `/user-support`
                          ? TextClassSets.sidebarLinkActive
                          : ""
                      } ${TextClassSets.sidebarLink}`}
                    >
                      <BiSupport size="1.5rem" /> User Support
                    </div>
                  </a>
                  <a
                    className={TextClassSets.sidebarLink}
                    href="/"
                    onClick={logoutOnClick}
                  >
                    <BiLogOut size="1.5rem" />
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default SideBar;
