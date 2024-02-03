import { Snackbar, Alert } from "@mui/material";

import React, { useState, useContext, useRef, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import FetchOwnerInfoAPI from "../../FunctionsAndContexts/FetchOwnerInfoAPI";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import BodyCard from "../CommonComponents/Card/BodyCard";
import FieldLabel from "../CommonComponents/Form/FieldLabel";
import FieldInfo from "../CommonComponents/Form/FieldInfo";
import ButtonClassSets from "../../utilities/ButtonClassSets";

const AddTableTypeForm = () => {
  const { id } = useParams();
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

  const initialTableTypeState = {
    name: "",
    description: "",
    basePrice: 0,
    pricePerHalfHour: 0,
    seats: 0,
  };

  const [tableTypeDetail, setTableTypeDetail] = useState(initialTableTypeState);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (
      ["basePrice", "pricePerHalfHour", "seats"].includes(name) &&
      Number(value) < 0
    ) {
      return;
    }

    if (name === "basePrice" || name === "pricePerHalfHour") {
      setTableTypeDetail((prevDetails) => ({
        ...prevDetails,
        [name]: Number(value * 100),
      }));
      return;
    }

    setTableTypeDetail((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const isFormValid = () => {
    return (
      tableTypeDetail.name.length > 0 &&
      tableTypeDetail.description.length > 0 &&
      tableTypeDetail.basePrice > 0 &&
      tableTypeDetail.pricePerHalfHour > 0 &&
      tableTypeDetail.seats > 0
    );
  };

  const handleButtonClick = async () => {
    try {
      const response = await FetchOwnerInfoAPI.createTableType(
        encodedToken,
        tableTypeDetail,
        id
      );
      console.log(response);

      setTableTypeDetail(initialTableTypeState);
      setOpenSnackbar(true);
      setSnackbarMessage("Table Type Created Successfully");
    } catch (error) {
      console.error("An error occurred while fetching owner info:", error);
    }
  };

  return (
    <BodyCard>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">
            Enter New Table Type Details
          </h2>
          <FieldInfo>Create a new table type for your venue</FieldInfo>
        </div>
        <div className="flex flex-col">
          <FieldLabel>Table Type Name</FieldLabel>

          <TextField
            name="name"
            className="w-96"
            variant="outlined"
            onChange={handleInputChange}
            value={tableTypeDetail.name}
            required
          />
        </div>
        <div className="flex flex-col ">
          <FieldLabel>Seats</FieldLabel>
          <FieldInfo>Number of seats for this table type</FieldInfo>

          <TextField
            name="seats"
            variant="outlined"
            className="w-96"
            required
            onChange={handleInputChange}
            value={tableTypeDetail.seats}
          />
        </div>
        <div className="flex flex-col">
          <FieldLabel>Table Type Description</FieldLabel>

          <TextField
            name="description"
            variant="outlined"
            required
            multiline
            className="w-96"
            minRows={2}
            onChange={handleInputChange}
            value={tableTypeDetail.description}
          />
        </div>
        <div className="flex flex-col">
          <FieldLabel>Base Price</FieldLabel>
          <FieldInfo>This is the base price of this seat type.</FieldInfo>

          <TextField
            name="basePrice"
            variant="outlined"
            className="w-96"
            required
            onChange={handleInputChange}
            value={tableTypeDetail.basePrice / 100}
          />
        </div>
        <div className="flex flex-col">
          <FieldLabel>Price Per Half Hour</FieldLabel>
          <FieldInfo>
            This is the price per half hour on top of base price of this seat
            type.
          </FieldInfo>

          <TextField
            name="pricePerHalfHour"
            variant="outlined"
            className="w-96"
            required
            onChange={handleInputChange}
            value={tableTypeDetail.pricePerHalfHour / 100}
          />
        </div>
      </div>
      <div className="flex flex-row justify-end mr-10">
        <Button
          onClick={handleButtonClick}
          className={`p-2 text-white rounded-md mt-6 ${
            isFormValid() ? ButtonClassSets.primary : ButtonClassSets.disabled
          }`}
          disabled={!isFormValid()}
        >
          Create New Table Type
        </Button>
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

export default AddTableTypeForm;
