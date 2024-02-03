import { Snackbar, Alert } from "@mui/material";

import React, { useState, useContext, useRef } from "react";
import { TextField } from "@mui/material";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import FetchOwnerInfoAPI from "../../FunctionsAndContexts/FetchOwnerInfoAPI";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import BodyCard from "../CommonComponents/Card/BodyCard";
import FieldLabel from "../CommonComponents/Form/FieldLabel";
import FieldInfo from "../CommonComponents/Form/FieldInfo";
import ButtonClassSets from "../../utilities/ButtonClassSets";

const CreateVoucherListingForm = ({ formData }) => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const formRef = useRef();
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const initialVoucherState = {
    description: "",
    voucherValue: 0,
    voucherCost: 0,
    voucherStock: 0,
    validityPeriodInDays: 0,
    enabled: "",
    voucherListingDelistDate: "",
    voucherName: "",
  };

  const [voucherListingDetail, setVoucherListingDetail] =
    useState(initialVoucherState);

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
    setVoucherListingDetail((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    const fieldsToValidate = [
      "description",
      "voucherValue",
      "voucherCost",
      "voucherStock",
      "validityPeriodInDays",
      "enabled",
      "voucherListingDelistDate",
      "voucherName",
    ];

    for (const field of fieldsToValidate) {
      if (!voucherListingDetail[field]) {
        return false;
      }
    }
    return true;
  };

  console.log(voucherListingDetail);
  const handleButtonClick = async () => {
    try {
      const response = await FetchOwnerInfoAPI.createVoucherListingForOwner(
        voucherListingDetail,
        encodedToken
      );
      console.log(response);

      setVoucherListingDetail(initialVoucherState);
      setOpenSnackbar(true);
      setSnackbarMessage("Voucher Listing Created");
      // formRef.current.reset();
    } catch (error) {
      console.error("An error occurred while fetching owner info:", error);
    }
  };

  return (
    <BodyCard>
      <div className="flex flex-col gap-8 xl:gap-10">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">Enter New Voucher Details</h2>
          <FieldInfo>
            Create new vouchers for special promotions. <br />
            Customize name, description, value, cost, expiration dates, validity
            period, and voucher amount.
          </FieldInfo>
        </div>

        <div className="flex flex-col ">
          <FieldLabel htmlFor={"voucherName"}>Voucher Name</FieldLabel>
          <TextField
            className=""
            id={"voucherName"}
            name="voucherName"
            required
            onChange={handleInputChange}
            value={voucherListingDetail.voucherName}
          />
        </div>

        <div className="flex flex-col ">
          <FieldLabel htmlFor={"description"}>Voucher Description</FieldLabel>
          <TextField
            className=""
            id={"description"}
            name="description"
            multiline
            minRows={3}
            required
            onChange={handleInputChange}
            value={voucherListingDetail.description}
          />
        </div>

        <div className="flex flex-col ">
          <FieldLabel htmlFor={"voucherValue"}>Voucher Value</FieldLabel>
          <FieldInfo>
            This represents the monetary worth of each voucher.
          </FieldInfo>
          <TextField
            className=""
            id={"voucherValue"}
            name="voucherValue"
            type="number"
            required
            onChange={handleInputChange}
            value={voucherListingDetail.voucherValue}
          />
        </div>

        <div className="flex flex-col ">
          <FieldLabel htmlFor={"voucherCost"}>Voucher Cost</FieldLabel>
          <FieldInfo>
            This represents the amount a student is required to pay for each
            voucher.
          </FieldInfo>
          <TextField
            className=""
            id={"voucherCost"}
            name="voucherCost"
            type="number"
            required
            onChange={handleInputChange}
            value={voucherListingDetail.voucherCost}
          />
        </div>

        <div className="flex flex-col ">
          <FieldLabel htmlFor={"voucherStock"}>Voucher Stock</FieldLabel>
          <FieldInfo>Total available vouchers for purchase.</FieldInfo>
          <TextField
            className=""
            id={"voucherStock"}
            name="voucherStock"
            type="number"
            required
            onChange={handleInputChange}
            value={voucherListingDetail.voucherStock}
          />
        </div>

        <div className="flex flex-col ">
          <FieldLabel htmlFor={"validityPeriodInDays"}>
            Voucher Validity Period
          </FieldLabel>
          <FieldInfo>
            The number of days the voucher remains valid after date of purchase.
          </FieldInfo>

          <div className="flex flex-row items-center">
            <TextField
              className=""
              id={"validityPeriodInDays"}
              name="validityPeriodInDays"
              type="number"
              required
              onChange={handleInputChange}
              value={voucherListingDetail.validityPeriodInDays}
            />
            <p className="px-6">days</p>
          </div>
        </div>

        <div className="flex flex-col ">
          <FieldLabel htmlFor={"enabled"}>Voucher Enabled</FieldLabel>
          <FieldInfo>
            This determines whether the voucher is available for purchase.
          </FieldInfo>
          <select
            className="border border-solid border-gray-300 rounded-md py-5 px-3 w-64"
            id={"enabled"}
            name="enabled"
            required
            onChange={handleInputChange}
            value={voucherListingDetail.enabled}
          >
            <option value="" disabled>
              Select enabled status
            </option>
            <option value="TRUE">True</option>
            <option value="FALSE">False</option>
          </select>
        </div>

        <div className="flex flex-col ">
          <FieldLabel htmlFor={"voucherListingDelistDate"}>
            Voucher Delist Date
          </FieldLabel>
          <FieldInfo>
            The date when the voucher will no longer be purchasable by students.
          </FieldInfo>
          <input
            type="date"
            id="voucherListingDelistDate"
            name="voucherListingDelistDate"
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
            value={voucherListingDetail.voucherListingDelistDate}
            className="border border-solid border-gray-300 rounded-md py-5 px-3 w-64"
          />
        </div>

        <div className="flex flex-row justify-end">
          <button
            onClick={handleButtonClick}
            className={`p-2 text-white rounded-md mt-4 ${
              isFormValid() ? ButtonClassSets.primary : ButtonClassSets.disabled
            }`}
            disabled={!isFormValid()}
          >
            Submit Voucher Listing
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
    </BodyCard>
  );
};

export default CreateVoucherListingForm;
