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
import Api from "../../Helpers/Api";
import { useNavigate } from "react-router-dom";
import useEncodedToken from "../../Helpers/useEncodedToken";

const EditSubscriptionTypeForm = ({ subType }) => {
  const { encodedToken } = useEncodedToken();
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const deleteSubscriptionType = async () => {
    try {
      let response = await Api.deleteSubscriptionType(
        subType.subscriptionTypeId,
        encodedToken
      );
      if (response.ok) {
        navigate("/subscriptiontype");
      } else {
        const data = await response.json();
        console.error("Error deleting Subscription type:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [subTypeDetails, setSubTypeDetails] = useState({
    subscriptionTypeId: 1,
    subscriptionTypeName: "",
    subscriptionTypeVenueLimit: 0,
    subscriptionTypePrice: 0,
    subscriptionTypeDuration: 0,
    subscriptionTypeDetails: "",
    subscriptionTypeStatusEnum: "ACTIVATED",
  });

  const [subTypeCopyDetails, setSubTypeCopyDetails] = useState({
    subscriptionTypeName: "",
    subscriptionTypePrice: 0,
    subscriptionTypeDuration: 0,
    subscriptionTypeDetails: 0,
    subscriptionTypeStatusEnum: "",
    subscriptionTypeVenueLimit: 0,
  });

  useEffect(() => {
    setSubTypeDetails({
      subscriptionTypeId: subType?.subscriptionTypeId || 99,
      subscriptionTypeName: subType?.subscriptionTypeName || "",
      subscriptionTypePrice: subType?.subscriptionTypePrice || 0,
      subscriptionTypeDuration: subType?.subscriptionTypeDuration || 0,
      subscriptionTypeDetails: subType?.subscriptionTypeDetails || "",
      subscriptionTypeStatusEnum: subType?.subscriptionTypeStatusEnum || "",
      subscriptionTypeVenueLimit: subType?.subscriptionTypeVenueLimit || 0,
    });
    setSubTypeCopyDetails({
      subscriptionTypeName: subType?.subscriptionTypeName || "",
      subscriptionTypePrice: subType?.subscriptionTypePrice || 0,
      subscriptionTypeDuration: subType?.subscriptionTypeDuration || 0,
      subscriptionTypeDetails: subType?.subscriptionTypeDetails || "",
      subscriptionTypeStatusEnum: subType?.subscriptionTypeStatusEnum || "",
      subscriptionTypeVenueLimit: subType?.subscriptionTypeVenueLimit || 0,
    });
  }, [subType]);

  const handleChange = (e) => {
    setSubTypeDetails({
      ...subTypeDetails,
      [e.target.name]: e.target.value,
    });
  };

  console.log(subTypeDetails);

  const updateSubscriptionType = async () => {
    try {
      let response = await Api.updateSubscriptionType(
        subType.subscriptionTypeId,
        subTypeDetails,
        encodedToken
      );
      const data = await response.json();
      if (response.ok) {
        setOpenSnackbar(true);
        setSnackbarMessage("Subscription Type has been updated");
      } else {
        console.error("Error updating Subcription type:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateSubscriptionType(); // Call the async function here
  };

  return (
    <div>
      <div className="w-screen rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            <span className="text-gray-700">
              Subcription Type: {subTypeCopyDetails.subscriptionTypeName}
            </span>
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="subscriptionTypeName"
                className="block mb-2 text-sm font-medium "
              >
                Name
              </label>
              <input
                type="text"
                name="subscriptionTypeName"
                value={subTypeDetails.subscriptionTypeName}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder="e.g. Gold Subscription"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subscriptionTypeVenueLimit"
                className="block mb-2 text-sm font-medium "
              >
                Venue limit
              </label>
              <input
                type="number"
                name="subscriptionTypeVenueLimit"
                value={subTypeDetails.subscriptionTypeVenueLimit}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder="5"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subscriptionTypePrice"
                className="block mb-2 text-sm font-medium "
              >
                Subscription Monthly Price
              </label>
              <input
                type="number"
                name="subscriptionTypePrice"
                value={subTypeDetails.subscriptionTypePrice}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder=""
                required
              />
            </div>
            <div>
              <label
                htmlFor="subscriptionTypeDuration"
                className="block mb-2 text-sm font-medium "
              >
                Subscription Duration - Days
              </label>
              <input
                type="number"
                name="subscriptionTypeDuration"
                value={subTypeDetails.subscriptionTypeDuration}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder=""
                required
              />
            </div>

            <div>
              <label
                htmlFor="subscriptionTypeDetails"
                className="block mb-2 text-sm font-medium "
              >
                Subscription Details
              </label>
              <input
                type="text"
                name="subscriptionTypeDetails"
                value={subTypeDetails.subscriptionTypeDetails}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder=""
                required
              />
            </div>

            <div className="relative">
              <label
                htmlFor="subscriptionTypeStatusEnum"
                className="block mb-1 text-sm font-medium "
              >
                Subscription Type Status
              </label>
              <select
                name="subscriptionTypeStatusEnum"
                value={subTypeDetails.subscriptionTypeStatusEnum}
                onChange={handleChange}
                className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 shadow-sm"
                required
              >
                <option value="ACTIVATED">ACTIVATED</option>
                <option value="DEACTIVATED">DEACTIVATED</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="button" // This is important, so it doesn't submit the form
                onClick={deleteSubscriptionType}
                className="mr-4 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Delete Subscription Type
              </button>
              <button
                type="submit"
                className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Update details
              </button>
            </div>
          </form>
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

export default EditSubscriptionTypeForm;
