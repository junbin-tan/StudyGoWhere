import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Helpers/Api";
import useEncodedToken from "../../Helpers/useEncodedToken";

const ViewVenueForm = ({ venue }) => {
  const { encodedToken } = useEncodedToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const deleteVenue = async () => {
    try {
      let response = await Api.deleteVenue(venue.venueId, encodedToken);
      if (response.ok) {
        setOpenSnackbar(true);
        setSnackbarMessage("Venue has been deleted");
      } else {
        console.error("Error deleting venue ");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [venueDetails, setVenueDetails] = useState({
    venueId: "",
    name: "",
    description: "",
    phone: "",
    venueCrowdLevel: "",
    venueStatus: "",
    address: "",
    addressName: "",
  });

  useEffect(() => {
    if (venue) {
      setVenueDetails({
        venueId: venue?.venueId || "",
        name: venue?.venueName || "",
        description: venue?.description || "",
        phone: venue?.phoneNumber || "",
        venueCrowdLevel: venue?.venueCrowdLevel || "",
        venueStatus: venue?.venueStatus || "",
        address: venue?.address || [],
        addressName: venue?.address?.address || "", // Added null check here
      });
      setLoading(false); // Set loading to false when venue data is available
    }
  }, [venue]);

  console.log(venueDetails);

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <Typography variant="h6">Loading...</Typography>
    </div>
  ) : (
    <div>
      <div className="w-screen rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            <span className="text-gray-700">{venue?.venueName || ""}</span>
          </h1>

          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium ">
              Venue Name
            </label>
            <input
              type="text"
              name="name"
              value={venueDetails.name || ""}
              className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400  sm:text-sm rounded-lg block w-full p-2.5 "
              placeholder=""
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium "
            >
              Description
            </label>
            <input
              type="text"
              name="description"
              value={venueDetails.description || ""}
              className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400  sm:text-sm rounded-lg block w-full p-2.5 "
              placeholder=""
              required
            />
          </div>

          <div>
            <label
              htmlFor="venueCrowdLevel"
              className="block mb-2 text-sm font-medium "
            >
              Crowd Level
            </label>
            <input
              type="text"
              name="venueCrowdLevel"
              value={venueDetails.venueCrowdLevel || ""}
              className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400  sm:text-sm rounded-lg block w-full p-2.5 "
              placeholder=""
              required
            />
          </div>

          <div>
            <label
              htmlFor="venueStatus"
              className="block mb-2 text-sm font-medium "
            >
              Venue Status
            </label>
            <input
              type="text"
              name="venueStatus"
              value={venueDetails.venueStatus}
              className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400  sm:text-sm rounded-lg block w-full p-2.5 "
              placeholder=""
              required
            />
          </div>

          <div>
            <label
              htmlFor="                value={venueDetails.phone}
                "
              className="block mb-2 text-sm font-medium "
            >
              Phone number
            </label>
            <input
              type="number"
              name="                value={venueDetails.phone}
                "
              value={venueDetails.phone || ""}
              className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400  sm:text-sm rounded-lg block w-full p-2.5 "
              placeholder=""
              required
            />
          </div>

          <div>
            <label
              htmlFor="addressName"
              className="block mb-2 text-sm font-medium "
            >
              Address Name
            </label>
            <input
              type="text"
              name="addressName"
              value={venueDetails.addressName || ""}
              className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400  sm:text-sm rounded-lg block w-full p-2.5 "
              placeholder=""
              required
            />
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="block mb-2 text-sm font-medium "
            >
              Address Postal Code
            </label>
            <input
              type="number"
              name="postalCode"
              value={venueDetails.address.postalCode || ""}
              className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400  sm:text-sm rounded-lg block w-full p-2.5 "
              placeholder=""
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button" // This is important, so it doesn't submit the form
              onClick={deleteVenue}
              className="mr-4 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Delete Venue
            </button>
          </div>
        </div>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default ViewVenueForm;
