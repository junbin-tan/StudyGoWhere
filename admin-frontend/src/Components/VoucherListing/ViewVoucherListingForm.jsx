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
import { useParams } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";
import Api from "../../Helpers/Api";
import { useNavigate } from "react-router-dom";
import useEncodedToken from "../../Helpers/useEncodedToken";

const ViewVoucherListingForm = ({ vcListing }) => {
  const { encodedToken } = useEncodedToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { voucherListingId } = useParams();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (vcListing) {
      setVcListingDetails(vcListing);
      setLoading(false);
    }
  }, [vcListing]);

  const [vcListingDetails, setVcListingDetails] = useState({
    id: "",
    description: "",
    voucherValue: 0,
    voucherCost: 0,
    voucherStock: 0,
    enabled: "",
    voucherListingDelistDate: "",
    voucherName: "",
  });

  useEffect(() => {
    setVcListingDetails(vcListing);
  }, [vcListing]);

  const handleToggleActivation = () => {
    Api.activateVoucher(voucherListingId, encodedToken).then((response) => {
      if (response.ok) {
        console.log("Voucher action successfully");
        setOpenSnackbar(true);
        setSnackbarMessage("Voucher Listing details has been updated");
        fetchVoucherDetails();
      } else {
        console.error("Error");
      }
    });
  };

  const fetchVoucherDetails = () => {
    Api.getVoucherListingById(voucherListingId, encodedToken)
      .then((response) => response.json())
      .then((data) => {
        setVcListingDetails({
          id: data?.id || "",
          description: data?.description || "",
          voucherValue: data?.voucherValue || 0,
          voucherCost: data?.voucherCost || 0,
          voucherStock: data?.voucherStock || 0,
          enabled: data?.enabled || false,
          voucherListingDelistDate: data?.voucherListingDelistDate || "",
          voucherName: data?.voucherName || "",
          adminBanned: data?.adminBanned || "",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching voucher details:", error);
      });
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <Typography variant="h6">Loading...</Typography>
    </div>
  ) : (
    <div className="w-screen rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
          <span className="text-gray-700">
            Voucher Name: {vcListingDetails.voucherName}
          </span>
        </h1>
        <div className="space-y-4 md:space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Description
            </label>
            <Typography className="text-gray-900">
              {vcListingDetails.description}
            </Typography>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Voucher Value
            </label>
            <Typography className="text-gray-900">
              ${vcListingDetails.voucherValue}
            </Typography>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Voucher Cost
            </label>
            <Typography className="text-gray-900">
              ${vcListingDetails.voucherCost}
            </Typography>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Voucher Stock
            </label>
            <Typography className="text-gray-900">
              {vcListingDetails.voucherStock}
            </Typography>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              User Enabled
            </label>
            <Typography className="text-gray-900">
              {vcListingDetails.enabled ? "Yes" : "No"}
            </Typography>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Delist Date
            </label>
            <Typography className="text-gray-900">
              {vcListingDetails.voucherListingDelistDate}
            </Typography>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Admin Banned
            </label>
            <Typography className="text-gray-900">
              {vcListingDetails.adminBanned ? "Yes" : "No"}
            </Typography>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleToggleActivation}
              className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                vcListingDetails.adminBanned
                  ? "bg-blue-700 hover:bg-blue-800 focus:ring-primary-300"
                  : "bg-red-600 hover:bg-red-700 focus:ring-red-300"
              }`}
            >
              {vcListingDetails.adminBanned ? "Unban Voucher" : "Ban Voucher"}
            </button>
          </div>
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

export default ViewVoucherListingForm;
