// TODO: THIS IS AN EXAMPLE PAGE FROM OUR 3106 PROJECT
// Edit as you see fit
// this is the original one:
// https://github.com/birdseed322/IS3106WeddingPlannerFrontEnd/blob/main/wedding-planner/src/routes/EndPoints.jsx
// or https://pastebin.com/FXX85t0r

import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Component to handle routing. Take note of the format of the pathing and how to add a Route (url endpoint). Login component is created as an example.

import { LoginTokenContext } from "./FunctionsAndContexts/LoginTokenContext";
import PublicLanding from "./Pages/PublicLanding";
import Venues from "./Pages/Venues";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import useToken from "./FunctionsAndContexts/useToken";
import useEncodedToken from "./FunctionsAndContexts/useEncodedToken";
import { OwnerVenuesContext } from "./FunctionsAndContexts/OwnerVenuesContext";
import { Wallet } from "@mui/icons-material";
import WalletDetails from "./Pages/WalletDetails";
import DummyOwner from "./utilities/DummyOwner";
import WalletTopUp from "./Components/WalletDetails/WalletTopUp";
import UserSupport from "./Pages/UserSupport";
import ViewMyProfile from "./Pages/ViewMyProfile";
import FetchOwnerInfoAPI from "./FunctionsAndContexts/FetchOwnerInfoAPI";
import VenueEditPage from "./Pages/VenueEditPage";
import AddVenuePage from "./Pages/AddVenuePage";
import Subscription from "./Pages/Subscription";
import VenueReview from "./Pages/VenueReview";
import ViewAllVoucherListingsPage from "./Pages/ViewAllVoucherListingsPage";
import AddVoucherListingPage from "./Pages/AddVoucherListingPage";
import VenueDashboard from "./Pages/VenueDashboard";
import { OperatorUserContext } from "./FunctionsAndContexts/OperatorUserContext";
import DummyOperator from "./utilities/DummyOperator";
import Advertisements from "./Pages/Advertisements";
import AddAdvertisementPage from "./Pages/AddAdvertisementPage";
import ViewAdvertisementPage from "./Pages/ViewAdvertisementPage";
import EditVoucherListingPage from "./Pages/EditVoucherListingPage";
import RedeemVoucher from "./Pages/RedeemVoucher";
import TestingPage from "./Pages/TestingPage";
import WalletWithdraw from "./Components/WalletDetails/WalletWithdraw";
import VenueBookingSchedule from "./Pages/VenueBookingSchedule";
import KDS from "./Components/KDS/KDS";
import ViewTransactionPage from "./Components/Transaction/ViewTransactionPage";
import AddTableType from "./Pages/AddTableType";
import Menus from "./Pages/Menus";
import AddMenu from "./Pages/AddMenu";
import EditMenuContentPage from "./Pages/EditMenuContentPage";
import EditTableType from "./Pages/EditTableType";

function EndPoints() {
  // for debugging, clear localStorage
  // localStorage.clear();

  const { token, setToken } = useToken();
  const { encodedToken, setEncodedToken } = useEncodedToken();
  const [ownerData, setOwnerData] = useState(DummyOwner);
  const [operatorData, setOperatorData] = useState(undefined);
  const [venueData, setVenueData] = useState([]);
  const [walletData, setWalletData] = useState({});
  // useEffect(() => {
  //   FetchOwnerInfoAPI.getOwner(encodedToken).then((response) => {
  //     if (response.status == 200) setOwnerData(response.data);
  //   }).catch(error => {
  //     console.log("error in fetching owner");
  //   })
  // }, []);
  if (
    !token ||
    (token.role !== "Owner" && token.role !== "Operator") ||
    token.exp < Date.now() / 1000
  ) {
    return (
      <LoginTokenContext.Provider
        value={[token, setToken, encodedToken, setEncodedToken]}
      >
        <BrowserRouter>
          <Routes>
            <Route index element={<PublicLanding />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PublicLanding />} index />
            {/*<Route path="aboutuspage" element={<AboutUs />} />*/}
          </Routes>
        </BrowserRouter>
      </LoginTokenContext.Provider>
    );
  } else if (token.role === "Owner") {
    return (
      <LoginTokenContext.Provider
        value={[token, setToken, encodedToken, setEncodedToken]}
      >
        <OwnerVenuesContext.Provider value={{ ownerData, setOwnerData }}>
          <BrowserRouter>
            <Routes>
              {/* the index shld redirect somewhere else but for now lets put it as Venues*/}
              <Route index element={<Venues />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venues/:id" element={<VenueDashboard />} />
              <Route path="/venues/:id/:pageName" element={<VenueEditPage />} />
              <Route path="/venues/:id/reviews" element={<VenueReview />} />
              <Route
                path="/venues/:id/booking-schedule"
                element={<Navigate to={"day-schedules"} />}
              />
              <Route
                path="/venues/:id/booking-schedule/:pageName"
                element={<VenueBookingSchedule />}
              />
              <Route
                path="/venues/:id/add-table-type"
                element={<AddTableType />}
              />
              <Route
                path="/venues/:id/booking-schedule/table-types/edit-table-type/:tableTypeId"
                element={<EditTableType />}
              />
              <Route path="/add-venue" element={<AddVenuePage />} />
              <Route path="/add-venue/:pageName" element={<AddVenuePage />} />
              <Route path="/wallet" element={<WalletDetails />} />
              <Route path="/wallet/:pageName" element={<WalletDetails />} />
              <Route
                path="/transactions/:transactionId"
                element={<ViewTransactionPage />}
              />

              <Route path="/user-support" element={<UserSupport />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/advertisements" element={<Advertisements />} />
              <Route
                path="/add-advertisement"
                element={<AddAdvertisementPage />}
              />
              <Route
                path="/viewAdvertisementDetails/:id"
                element={<ViewAdvertisementPage />}
              />

              <Route
                path="/vouchers"
                element={<ViewAllVoucherListingsPage />}
              />
              <Route
                path="/editVoucherListing/:voucherListingId"
                element={<EditVoucherListingPage />}
              />
              <Route path="/ViewMyProfile" element={<ViewMyProfile />} />
              <Route
                path="/createVoucherListing"
                element={<AddVoucherListingPage />}
              />
              <Route path="/" element={<Venues />} />
              <Route path="/redeem-voucher" element={<RedeemVoucher />} />
              <Route path="/testing" element={<TestingPage />} />
              <Route path="/menus" element={<Menus />} />
              <Route path="/add-menu" element={<AddMenu />} />
              <Route path="/edit-menu/:id" element={<EditMenuContentPage />} />
            </Routes>
          </BrowserRouter>
        </OwnerVenuesContext.Provider>
      </LoginTokenContext.Provider>
    );
  } else if (token.role === "Operator") {
    return (
      <LoginTokenContext.Provider
        value={[token, setToken, encodedToken, setEncodedToken]}
      >
        <OperatorUserContext.Provider value={{ operatorData, setOperatorData }}>
          <BrowserRouter>
            <Routes>
              <Route index element={<VenueDashboard />} />
              <Route path="/venue" element={<VenueDashboard />} />
              <Route
                path="/venue/booking-schedule"
                element={<Navigate to={"day-schedules"} />}
              />
              <Route
                path="/venue/booking-schedule/:pageName"
                element={<VenueBookingSchedule />}
              />
              <Route path="/venue/reviews" element={<VenueReview />} />
              <Route path="/user-support" element={<UserSupport />} />
              <Route
                path="/vouchers"
                element={<ViewAllVoucherListingsPage />}
              />

              {/*  SIGNIFICANT distinction is that the path is "venue" instead of "venues"*/}
              {/*  since operator only has 1 venue anyway*/}

              <Route path="/redeem-voucher" element={<RedeemVoucher />} />
              <Route path="/testing" element={<TestingPage />} />
              <Route path="/kds" element={<KDS />}/>
            </Routes>
          </BrowserRouter>
        </OperatorUserContext.Provider>
      </LoginTokenContext.Provider>
    );
  }
  return "helloooo this part won't be reached xD";
}

export default EndPoints;
