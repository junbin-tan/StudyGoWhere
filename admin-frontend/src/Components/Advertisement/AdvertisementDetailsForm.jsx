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
import Api from "../../Helpers/Api";
import { useNavigate } from "react-router-dom";
import useEncodedToken from "../../Helpers/useEncodedToken";
import { ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import storage from "../../firebase";

const AdvertisementDetailsForm = ({ adData }) => {
  const { encodedToken } = useEncodedToken();
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");



  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  console.log(adData);

  const [advertDetails, setAdvertDetails] = useState({
    billableId: 1,
    billablePrice: 0,
    adCreatorUsername: "",
    name: "",
    advertisementStatus: "",
    budgetLeft: 0,
    costPerImpression: 0,
    description: "",
    startDate: "",
    endDate: "",
    image: "",
    rejectionReason: "",
  });

  const handleChange = (e) => {
    setAdvertDetails({
      ...advertDetails,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (adData) {
      setAdvertDetails({
        billableId: adData.billableId,
        billablePrice: adData.billablePrice,
        adCreatorUsername: adData.adCreatorUsername,
        name: adData.name,
        advertisementStatus: adData.advertisementStatus,
        budgetLeft: adData.budgetLeft,
        costPerImpression: adData.costPerImpression,
        description: adData.description,
        startDate: adData.startDate,
        endDate: adData.endDate,
        image: adData.image,
        rejectionReason: adData.rejectionReason,
      });
    }
  }, [adData]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageRef = ref(storage, advertDetails.image);
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
        setImageError(false); 
      } catch (error) {
        console.error("Error fetching image URL:", error);
        setImageError(true); 
      }
    };
  
    fetchImage();
  }, [advertDetails]);
  

  console.log(advertDetails);
  const handleRejectAdvertisement = async () => {
    const updatedAdvertDetails = {
      ...advertDetails,
      advertisementStatus: "REJECTED",
    };

    try {
      const response = await Api.updateAdvertisementById(
        adData.billableId,
        updatedAdvertDetails,
        encodedToken
      );
      if (response.ok) {
        setAdvertDetails(updatedAdvertDetails);
        setOpenSnackbar(true);
        setSnackbarMessage("Advertisement has been REJECTED.");
      } else {
        console.error("Failed to update advertisement status.");
      }
    } catch (error) {
      console.error("Error updating advertisement status:", error);
    }
  };

  const handleActivateAdvertisement = async () => {
    const updatedAdvertDetails = {
      ...advertDetails,
      advertisementStatus: "ACTIVATED",
    };

    try {
      const response = await Api.updateAdvertisementById(
        adData.billableId,
        updatedAdvertDetails,
        encodedToken
      );
      if (response.ok) {
        setAdvertDetails(updatedAdvertDetails);
        setOpenSnackbar(true);
        setSnackbarMessage("Advertisement has been ACTIVATED.");
      } else {
        console.error("Failed to update advertisement status.");
      }
    } catch (error) {
      console.error("Error updating advertisement status:", error);
    }
  };

  return (
    <div>
      <div className="w-screen rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            <span className="text-gray-700">
              Advertisement Name: {advertDetails.name}
            </span>
          </h1>
          {/* <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}> */}
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                Name
              </label>
              <p className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5 block w-full">
                {advertDetails.name}
              </p>
            </div>

            <div>
              <label
                htmlFor="description "
                className="block mb-2 text-sm font-medium "
              >
                Description
              </label>
              <p className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5 block w-full">
                {advertDetails.description}
              </p>
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="block mb-2 text-sm font-medium "
              >
                Start Date
              </label>
              <p className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5 block w-full">
                {advertDetails.startDate}
              </p>
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block mb-2 text-sm font-medium "
              >
                End Date
              </label>
              <p className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5 block w-full">
                {advertDetails.endDate}
              </p>
            </div>

            <div>
              <label
                htmlFor="adCreatorUsername"
                className="block mb-2 text-sm font-medium "
              >
                Creator Username
              </label>
              <p className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5 block w-full">
                {advertDetails.adCreatorUsername}
              </p>
            </div>

            {/* <div>
              <label
                htmlFor="image"
                className="block mb-2 text-sm font-medium "
              >
                Image
              </label>
              <p className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5 block w-full">
                {advertDetails.image}
              </p>
            </div> */}
            <div>
              <label
                htmlFor="image"
                className="block mb-2 text-sm font-medium "
              >
                Image
              </label>
              {imageUrl ? (
                <img src={imageUrl} alt="Advertisement" />
              ) : imageError ? (
                <p className="text-red-500">No image found</p>
              ) : (
                <p>Loading image...</p>
              )}
            </div>

            <div>
              <label
                htmlFor="advertisementStatus"
                className="block mb-2 text-sm font-medium "
              >
                Advertisement Status
              </label>
              <p className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5 block w-full">
                {advertDetails.advertisementStatus}
              </p>
            </div>

            <div>
              <label
                htmlFor="rejectionReason"
                className="block mb-2 text-sm font-medium "
              >
                Rejection Reason
              </label>
              <input
                type="text"
                name="rejectionReason"
                value={advertDetails.rejectionReason}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder="Please write any details here"
                required
                disabled={["ACTIVATED", "REJECTED"].includes(
                  advertDetails.advertisementStatus
                )}
              />
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                type="button"
                className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  ["ACTIVATED", "REJECTED"].includes(
                    advertDetails.advertisementStatus
                  )
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-primary-300"
                }`}
                onClick={handleActivateAdvertisement}
                disabled={["ACTIVATED", "REJECTED"].includes(
                  advertDetails.advertisementStatus
                )}
              >
                Activate
              </button>
              <button
                type="button"
                className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  ["ACTIVATED", "REJECTED"].includes(
                    advertDetails.advertisementStatus
                  )
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300"
                }`}
                onClick={handleRejectAdvertisement}
                disabled={["ACTIVATED", "REJECTED"].includes(
                  advertDetails.advertisementStatus
                )}
              >
                Reject
              </button>
            </div>
          </div>
          {/* </form> */}
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

export default AdvertisementDetailsForm;
