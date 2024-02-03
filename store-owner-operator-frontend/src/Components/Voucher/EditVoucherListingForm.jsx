import { Snackbar, Alert } from "@mui/material";
import { TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import React from "react";
import { useState, useEffect, useContext } from "react";
import Api from "../../FunctionsAndContexts/FetchOwnerInfoAPI";
import { useNavigate } from "react-router-dom";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import BodyCard from "../CommonComponents/Card/BodyCard";
import { RiCoupon3Line } from "react-icons/ri";
import FormClassSets from "../../utilities/FormClassSets";
import ButtonClassSets from "../../utilities/ButtonClassSets";

const EditVoucherListingForm = ({ vcListing }) => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { voucherListingId } = useParams();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const [vcListingDetails, setVcListingDetails] = useState({
    voucherListingId: 0,
    validityPeriodInDays: 0,
    description: "",
    voucherValue: 0,
    voucherCost: 0,
    voucherStock: 0,
    enabled: "",
    voucherListingDelistDate: "",
    voucherName: "",
    adminBanned: "",
  });

  // useEffect(() => {
  //   setVcListingDetails({
  //       voucherListingId:  vcListing?.voucherListingId||0,
  //       validityPeriodInDays: vcListing?.validityPeriodInDays||0,
  //       description: vcListing?.description||"",
  //       voucherValue: vcListing?.voucherValue||0,
  //       voucherCost: vcListing?.voucherCost||0,
  //       voucherStock: vcListing?.voucherStock||0,
  //       enabled: vcListing?.enabled?.toString() || "",
  //       voucherListingDelistDate: vcListing?.voucherListingDelistDate||"",
  //       voucherName: vcListing?.voucherName||"",
  //       adminBanned: vcListing?.adminBanned||"",
  //   });

  // }, [vcListing]);

  useEffect(() => {
    Api.getVoucherListingById(voucherListingId, encodedToken)
      .then((response) => response.json())
      .then((data) => {
        setVcListingDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching voucher listing details:", error);
      });
  }, [voucherListingId]);
  console.log("bleh" + vcListingDetails);
  useEffect(() => {
    setVcListingDetails({
      voucherListingId: vcListing?.voucherListingId || 0,
      validityPeriodInDays: vcListing?.validityPeriodInDays || 0,
      description: vcListing?.description || "",
      voucherValue: vcListing?.voucherValue || 0,
      voucherCost: vcListing?.voucherCost || 0,
      voucherStock: vcListing?.voucherStock || 0,
      enabled: vcListing?.enabled?.toString() || "",
      voucherListingDelistDate: vcListing?.voucherListingDelistDate || "",
      voucherName: vcListing?.voucherName || "",
      adminBanned: vcListing?.adminBanned || "",
    });
  }, [vcListing]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (
      [
        "voucherValue",
        "voucherCost",
        "voucherStock",
        "validityPeriodInDays",
      ].includes(name) &&
      Number(value) < 0
    ) {
      return;
    }
    setVcListingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleButtonClick = async () => {
    try {
      const response = await Api.updateVoucherListing(
        vcListingDetails.voucherListingId,
        vcListingDetails,
        encodedToken
      );
      console.log(response);

      setOpenSnackbar(true);
      setSnackbarMessage("Voucher Listing Updated");
    } catch (error) {
      console.error("An error occurred while updating data", error);
    }
  };

  const deleteVoucherListing = async () => {
    try {
      let response = await Api.deleteVoucherListing(
        vcListingDetails.voucherListingId,
        encodedToken
      );
      if (response.ok) {
        navigate("/vouchers");
      } else {
        const data = await response.json();
        console.error("Error deleting Subscription type:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log(vcListingDetails);
  return (
    <BodyCard>
      <div className={FormClassSets.formSpacing}>
        <h2 className="text-lg font-semibold">Voucher Listing</h2>

        {vcListingDetails.adminBanned && (
          <div className="col-span-3 bg-red-200 text-red-700 p-3 rounded-md">
            This voucher has been banned by the admin.
          </div>
        )}
        <div className={FormClassSets.fieldSpacing}>
          <p className="font-semibold">Voucher Name</p>
          <TextField
            className=""
            name="voucherName"
            required
            onChange={handleInputChange}
            value={vcListingDetails.voucherName}
            disabled={vcListingDetails.adminBanned}
          />
        </div>

        <div className={FormClassSets.fieldSpacing}>
          <p className="font-semibold">Voucher Description</p>
          <TextField
            className=""
            name="description"
            required
            onChange={handleInputChange}
            disabled={vcListingDetails.adminBanned}
            value={vcListingDetails.description}
          />
        </div>

        <div className={FormClassSets.fieldSpacing}>
          <p className="font-semibold">Voucher Value</p>
          <p className="text-sm text-gray-80 ">
            This represents the monetary worth of each voucher.
          </p>
          <TextField
            className=""
            name="voucherValue"
            type="number"
            required
            onChange={handleInputChange}
            value={vcListingDetails.voucherValue}
            disabled={vcListingDetails.adminBanned}
          />
        </div>

        <div className={FormClassSets.fieldSpacing}>
          <p className="font-semibold">Voucher Cost</p>
          <p className="text-sm text-gray-80 ">
            This represents the amount a student is required to pay for each
            voucher.
          </p>
          <TextField
            className=""
            name="voucherCost"
            type="number"
            required
            onChange={handleInputChange}
            value={vcListingDetails.voucherCost}
            disabled={vcListingDetails.adminBanned}
          />
        </div>

        <div className={FormClassSets.fieldSpacing}>
          <p className="font-semibold">Voucher Stock</p>
          <p className="text-sm text-gray-80 ">
            Total available vouchers for purchase.
          </p>
          <TextField
            className=""
            name="voucherStock"
            type="number"
            required
            onChange={handleInputChange}
            value={vcListingDetails.voucherStock}
            disabled={vcListingDetails.adminBanned}
          />
        </div>

        <div className={FormClassSets.fieldSpacing}>
          <p className="font-semibold">Voucher Validity Period</p>
          <p className="text-sm text-gray-80 ">
            The number of days the voucher remains valid after date of purchase.
          </p>
          <div className="flex flex-row items-center">
            <TextField
              className=""
              name="validityPeriodInDays"
              type="number"
              required
              onChange={handleInputChange}
              value={vcListingDetails.validityPeriodInDays}
              disabled={vcListingDetails.adminBanned}
            />
            <p className="px-6">days</p>
          </div>
        </div>
        <div className={FormClassSets.fieldSpacing}>
          <p className="font-semibold">Voucher Enabled</p>
          <p className="text-sm text-gray-80 ">
            This determines whether the voucher is available for purchase.
          </p>
          <select
            className="flex flex-auto border border-solid border-gray-300 rounded-md py-5 px-3 w-64"
            name="enabled"
            required
            onChange={handleInputChange}
            value={vcListingDetails.enabled}
            disabled={vcListingDetails.adminBanned}
          >
            <option value="" disabled>
              Select enabled status
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>

        <div className={FormClassSets.fieldSpacing}>
          <p className="font-semibold">Voucher Delist Date</p>
          <p className="text-sm text-gray-80 ">
            The date when the voucher will no longer be purchasable by students.
          </p>
          <input
            type="date"
            id="datePicker"
            name="voucherListingDelistDate"
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
            value={vcListingDetails.voucherListingDelistDate}
            className="flex flex-auto border border-solid border-gray-300 rounded-md py-5 px-3 w-64"
          />
        </div>

        <div className="flex flex-row gap-2 items-center justify-end mt-12">
          <button
            onClick={deleteVoucherListing}
            className={ButtonClassSets.danger}
          >
            Delete
          </button>

          <button
            onClick={handleButtonClick}
            disabled={vcListingDetails.adminBanned}
            className={` ${
              vcListingDetails.adminBanned
                ? ButtonClassSets.disabled
                : ButtonClassSets.primary
            }`}
          >
            Update details
          </button>
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
    </BodyCard>
  );
};

export default EditVoucherListingForm;
