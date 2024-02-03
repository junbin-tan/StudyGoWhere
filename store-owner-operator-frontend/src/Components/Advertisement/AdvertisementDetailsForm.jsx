import React, { useState, useContext, useRef, useEffect } from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { v4 as uuidv4 } from "uuid";
import Api from "../../FunctionsAndContexts/Api";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";

const AdvertisementDetailsForm = ({ adData }) => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const markAdAsCompleted = async () => {
    try {
      let response = await Api.markAdvertisementAsCompleted(
        adData.billableId,
        encodedToken
      );

      if (response.ok) {
        setOpenSnackbar(true);
        setSnackbarMessage("Advertisement has been marked as COMPLETE.");
        setTimeout(() => {
          window.location.reload(); // This will refresh the page after 4 seconds
        }, 4000);
      } else {
        const data = await response.json();
        setOpenSnackbar(true);
        setSnackbarMessage(
          data.message || "Error updating advertisement status"
        );
      }
    } catch (error) {
      setOpenSnackbar(true);
      setSnackbarMessage("An error occurred. Please try again.");
    }
  };

  if (!adData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mx-auto w-full">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
        Advertisement Details
      </h2>
      <div className="flex flex-col">
        <div className="flex flex-wrap -mx-2">
          <div className="w-1/2 px-2">
            {/* <p className="mb-2">
              <span className="font-medium">Creator Username:</span>{" "}
              {adData.adCreatorUsername}
            </p> */}
            <p className="mb-2">
              <span className="font-medium">Advertisment Name:</span>{" "}
              {adData.name}
            </p>
            <p className="mb-2">
              <span className="font-medium">Description:</span>{" "}
              {adData.description}
            </p>

            <p className="mb-2">
              <span className="font-medium">Advertisement ID:</span>{" "}
              {adData.billableId}
            </p>
            <p className="mb-2">
              <span className="font-medium">Total Budget:</span> $
              {adData.billablePrice / 100}
            </p>
            <p className="mb-2">
              <span className="font-medium">Budget Left:</span> $
              {adData.budgetLeft}
            </p>
            <p className="mb-2">
              <span className="font-medium">Cost Per Impression:</span> $
              {adData.costPerImpression}
            </p>
          </div>
          <div className="w-1/2 px-2">
            <p className="mb-2">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`inline-block px-2 py-1 rounded ${
                  adData.advertisementStatus === "ACTIVATED"
                    ? "bg-green-200 text-green-700"
                    : adData.advertisementStatus === "REJECTED"
                    ? "bg-red-200 text-red-700"
                    : adData.advertisementStatus === "COMPLETED"
                    ? "bg-yellow-200 text-yellow-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {adData.advertisementStatus}
              </span>
            </p>

            <p className="mb-2">
              <span className="font-medium">Start Date:</span>{" "}
              {adData.startDate}
            </p>
            <p className="mb-2">
              <span className="font-medium">End Date:</span> {adData.endDate}
            </p>
            <p className="mb-2">
              <span className="font-medium">Impressions Left:</span>{" "}
              {adData.impressionsLeft}
            </p>
            <p className="mb-2">
              <span className="font-medium">Impression Count:</span>{" "}
              {adData.impressionCount}
            </p>

            <p className="mb-2">
              <span className="font-medium">Reach Count:</span>{" "}
              {adData.reachCount}
            </p>
          </div>

          {adData.advertisementStatus === "REJECTED" && (
            <div className="w-1/2 px-2 bg-red-100 border border-red-300 p-4 rounded-lg">
              <p className="mb-2 text-red-600 font-semibold">
                <span className="font-medium">Rejection Reason:</span>{" "}
                {adData.rejectionReason}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          {(adData.advertisementStatus === "PENDING" ||
            adData.advertisementStatus === "ACTIVATED") && (
            <button
              onClick={markAdAsCompleted}
              className="bg-blue-500 hover:bg-blue-600 w-60 text-white font-bold py-2 px-4 rounded"
            >
              Mark as Complete
            </button>
          )}
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
  );
};

export default AdvertisementDetailsForm;
