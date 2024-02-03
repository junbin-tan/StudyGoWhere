import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate, Navigate } from "react-router-dom";
import PublicLanding from "./Pages/PublicLandingLogin";
import PrivateRoute from "./Helpers/PrivateRoute";

import SidebarComponent from "./Components/SidebarComponent";
import AdminListingPage from "./Pages/AdminListingPage";
import DashboardPage from "./Pages/DashboardPage";
import CreateAdminPage from "./Pages/CreateAdminPage";
import EditAdminPage from "./Pages/EditAdminPage";
import SubscriptionTypeListingPage from "./Pages/SubscriptionTypeListing/SubscriptionTypeListingPage";
import CreateSubscriptionTypePage from "./Pages/SubscriptionTypeListing/CreateSubscriptionTypePage";
import EditSubscriptionTypeListingPage from "./Pages/SubscriptionTypeListing/EditSubscriptionTypeListingPage";
import VenueListingPage from "./Pages/VenueListing/VenueListingPage";
import ViewMyProfilePage from "./Pages/ViewMyProfilePage";
import ViewVenuePage from "./Pages/VenueListing/ViewVenuePage";

import OwnerListingPage from "./Pages/OwnerListing/OwnerListingPage";
import ViewOwnerPage from "./Pages/OwnerListing/ViewOwnerPage";
import VoucherListingPage from "./Pages/VoucherListing/VoucherListingPage";
import VoucherListingDetailsPage from "./Pages/VoucherListing/VoucherListingDetailsPage";

import useToken from "./Helpers/useToken";
import useEncodedToken from "./Helpers/useEncodedToken";
import { LoginTokenContext } from "./Helpers/LoginTokenContext";
import StudentListing from "./Pages/StudentPage";
import UserSupport from "./Pages/UserSupportPage";
import EditTicketPage from "./Pages/EditTicketPage";
import ReviewPage from "./Pages/ReviewPage";
import AdvertisementListingPage from "./Pages/AdvertisementListing/AdvertisementListingPage";
import ViewAdvertisementDetailPage from "./Pages/AdvertisementListing/ViewAdvertisementDetailPage";
import TransactionWrapped from "./Pages/TransactionWrapped";
import ViewTransactionPage from "./Components/Transaction/ViewTransactionPage";
import WalletWrapped from "./Pages/WalletWrapped";
const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, setToken } = useToken();
  const { encodedToken, setEncodedToken } = useEncodedToken();

  useEffect(() => {
    if (!token || token.role !== "Admin" || token.exp < Date.now() / 1000) {
      navigate("/login");
    }
  }, [token, location, navigate]);
  return (
    <LoginTokenContext.Provider value={[token, setToken, encodedToken, setEncodedToken]}>
      <div className="flex">
        {location.pathname !== "/login" && <SidebarComponent className="flex-none w-64" />}
        <main className={location.pathname !== "/login" ? "flex-1 overflow-x-hidden" : "w-full"}>
          <Routes>
            <Route path="/login" element={<PublicLanding />} />
            <Route path="/" element={<PrivateRoute><AdminListingPage /></PrivateRoute>} />
            {/* <Route path="/home" element={<PrivateRoute><DashboardPage /></PrivateRoute>} /> */}
            <Route path="/admin" element={<PrivateRoute><AdminListingPage /></PrivateRoute>} />
            <Route path="/createadmin" element={<PrivateRoute><CreateAdminPage /></PrivateRoute>} />
            <Route path="/editadmin/:adminId" element={<PrivateRoute><EditAdminPage /></PrivateRoute>} />
            <Route path="/subscriptiontype" element={<PrivateRoute><SubscriptionTypeListingPage/></PrivateRoute>} />
            <Route path="/createSubscriptionType" element={<PrivateRoute><CreateSubscriptionTypePage/></PrivateRoute>} />
            <Route path="/editSubscriptionType/:subTypeId" element={<PrivateRoute><EditSubscriptionTypeListingPage /></PrivateRoute>} />
            <Route path="/viewmyprofilepage" element={<PrivateRoute><ViewMyProfilePage /></PrivateRoute>} />
            <Route path="/venuelistingpage" element={<PrivateRoute><VenueListingPage /></PrivateRoute>} />
            <Route path="/viewvenue/:venueId" element={<PrivateRoute><ViewVenuePage /></PrivateRoute>} />
            <Route path="/student" element={<PrivateRoute><StudentListing/></PrivateRoute>} />
            <Route path="/user-support" element={<PrivateRoute><UserSupport /></PrivateRoute>} />
            <Route path="/respondTicket/:ticketId" element={<PrivateRoute><EditTicketPage /></PrivateRoute>} />
            <Route path="/ownerlistingpage" element={<PrivateRoute><OwnerListingPage /></PrivateRoute>} />
            <Route path="/reviews" element={<PrivateRoute><ReviewPage /></PrivateRoute>} />
            <Route path="/viewowner/:ownerId" element={<PrivateRoute><ViewOwnerPage /></PrivateRoute>} />
            <Route path="/advertisementlistingpage" element={<PrivateRoute><AdvertisementListingPage /></PrivateRoute>} />
            <Route path="/verifyAdvert/:advertId" element={<PrivateRoute><ViewAdvertisementDetailPage /></PrivateRoute>} />
            <Route path="/viewVoucherListingPage" element={<PrivateRoute><VoucherListingPage /></PrivateRoute>} />
            <Route path="/viewVoucherListingDetails/:voucherListingId" element={<PrivateRoute><VoucherListingDetailsPage /></PrivateRoute>} />
            <Route path="/transactions" element={<PrivateRoute><TransactionWrapped /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/admin" />} />
            <Route path="/transactions/:scope/:transactionId" element={<PrivateRoute><ViewTransactionPage /></PrivateRoute>} />
            <Route path="/wallet" element={<PrivateRoute><WalletWrapped /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </LoginTokenContext.Provider>
  );
};

export default App;
