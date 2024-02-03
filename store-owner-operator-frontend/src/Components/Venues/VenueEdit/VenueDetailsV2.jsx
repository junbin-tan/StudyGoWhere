import React, { useEffect, useState } from "react";
import AddressMap from "../AddressMap";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FetchOwnerInfoAPI from "../../../FunctionsAndContexts/FetchOwnerInfoAPI";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Button, Divider, TextareaAutosize, TextField } from "@mui/material";
import AddressAutocomplete from "../AddressAutocomplete";
import ButtonStyles from "../../../utilities/ButtonStyles";
import ConfirmModalV2 from "../../CommonComponents/Modal/ConfirmModalV2";
import { useNavigate } from "react-router-dom";
import Amenities from "../Amenities/Amenities";
import AveragePrice from "../AveragePrice/AveragePrice";
import CopyFromToBar from "./CopyFromToBar";
import { HorizontalRule, Label } from "@mui/icons-material";
import HorizontalLine from "../../CommonComponents/Line/HorizontalLine";
import BodyCard from "../../CommonComponents/Card/BodyCard";
import FieldLabel from "../../CommonComponents/Form/FieldLabel";
import ButtonClassSets from "../../../utilities/ButtonClassSets";
import {AiFillDelete} from "react-icons/ai";

export default function VenueDetailsV2({
  formData,
  setFormData,
  setFormKeyValue,
  formErrorsData,
  handleChange,
  encodedToken,
  hasSubmitButton = true,
  hasDeleteButton = true,
  customBottomComponent, // in the future if we wanna override the "bottom bar" (with the buttons)
}) {
  // useEffect(() => {
  //     if (selectedCrowdLevel && selectedLatLng && formData) {
  //         setFormData({ ...formData, address: { ...formData["address"],
  //                 address: selectedAddress, latitude: selectedLatLng.lat, longitude: selectedLatLng.lng } });
  //     }
  // }, [selectedAddress, selectedLatLng])

  // useEffect(() => {
  //     setSelectedAddress(formData?.address?.address);
  //     setSelectedLatLng({lat: formData?.address?.latitude, lng: formData?.address?.longitude});
  //     setSelectedCrowdLevel(formData?.venueCrowdLevel);
  // }, [formData])

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const navigate = useNavigate();

  if (!formData) return <></>;
  return (
    <>
      <BodyCard>
        {/*<Button onClick={() => console.log(formErrorsData)}> Log formErrors</Button>*/}
        {/*<Button onClick={() => console.log(formData)}> Log formData</Button>*/}
        <div className="flex flex-col gap-8 xl:gap-10">
          <div className="flex flex-col">
            <FieldLabel htmlFor={"venueName"}>Venue Name</FieldLabel>
            <TextField
              className="max-w-lg"
              id={"venueName"}
              name="venueName"
              required
              value={formData.venueName}
              onChange={handleChange}
              error={formErrorsData.venueName}
              helperText={formErrorsData.venueName && "Cannot have no name"}
            />
          </div>

          <HorizontalLine />

          <div className="flex flex-col">
            {/* needs a custom setPostalCode method because can't use handleChange here */}
            <AddressAutocomplete
              passedHandleChange={handleChange}
              selectedAddress={formData?.address?.address}
              setSelectedAddress={(addressString) =>
                setFormKeyValue("address.address", addressString)
              }
              addressError={formErrorsData?.address?.address}
              selectedLatLng={{
                lat: formData?.address?.latitude,
                lng: formData?.address?.longitude,
              }}
              setSelectedLatLng={(latLng) => {
                setFormKeyValue("address.latitude", latLng.lat);
                setFormKeyValue("address.longitude", latLng.lng);
              }}
              // All this Postal Code stuff is needed because of bad programming
              // I could have done it like the way I did for address & latlng; but this works and
              // I don't want to mess anything up.
              selectedPostalCode={formData?.address?.postalCode}
              setSelectedPostalCode={(postalCodeString) => {
                setFormData({
                  ...formData,
                  address: {
                    ...formData["address"],
                    postalCode: postalCodeString,
                  },
                });
              }}
              handlePostalCodeChange={(event) =>
                handleChange({
                  target: {
                    name: "address.postalCode",
                    value: event.target.value,
                  },
                })
              }
              postalCodeError={formErrorsData.address.postalCode}
              // setPostalCodeError = {((bool) => {
              //     setFormErrors({...formErrors, addressPostalCode: bool})
              // })}
            />
          </div>

          <div className="flex flex-col items-center">
            <AddressMap
              selectedLatLng={{
                lat: formData?.address?.latitude,
                lng: formData?.address?.longitude,
              }}
              setSelectedLatLng={(latLng) => {
                setFormKeyValue("address.latitude", latLng.lat);
                setFormKeyValue("address.longitude", latLng.lng);
              }}
            />
          </div>

          <HorizontalLine />

          <div className="flex flex-col">
            <FieldLabel htmlFor={"phoneNumber"}>Phone number</FieldLabel>
            <TextField
              className="max-w-lg"
              id={"phoneNumber"}
              name={"phoneNumber"}
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              error={formErrorsData.phoneNumber}
              helperText={
                formErrorsData.phoneNumber && "Phone number must be 8 digits"
              }
            />
          </div>

          <HorizontalLine />

          <div className="flex flex-col">
            <FieldLabel htmlFor={"description"}>Description</FieldLabel>
            <TextField
              className="max-w-lg"
              id={"description"}
              name="description"
              required
              multiline
              minRows={3} // Set a minimum number of rows to start with
              placeholder="Enter description here..."
              value={formData.description}
              onChange={handleChange}
              // InputProps={{ inputComponent: TextareaAutosize }}
              error={formErrorsData.description}
              helperText={
                formErrorsData.description == "empty"
                  ? "Description is empty!"
                  : formErrorsData.description == "tooLong"
                  ? "Description is too long! Must be less than 510 characters"
                  : ""
              }
            />
          </div>

          {/* not sure what to put in htmlFor, since AveragePrice is not considered an input field */}
          <div className="flex flex-col">
            <FieldLabel>Average Price</FieldLabel>
            <AveragePrice
              selectedAveragePrice={formData.averagePrice}
              handleAveragePriceChange={(clickedAvgPrice) => {
                handleChange({
                  target: { name: "averagePrice", value: clickedAvgPrice },
                });
              }}
            />
          </div>

          <div className="flex flex-col">
            <FieldLabel>Amenities</FieldLabel>
            <Amenities
              selectedAmenities={formData.amenities}
              handleAmenitiesChange={(changedSelectedAmenities) => {
                handleChange({
                  target: {
                    name: "amenities",
                    value: changedSelectedAmenities,
                  },
                });
              }}
            />
          </div>

          <HorizontalLine />

          {hasSubmitButton && (
            <div className="col-span-3 grid md:grid-cols-3 items-center">
              <div className="col-span-1">
                {hasDeleteButton && (
                  <Button
                    onClick={() =>
                      setIsConfirmDeleteModalOpen(!isConfirmDeleteModalOpen)
                    }
                    type={"button"} // shouldn't need this as the default is "button", but just in case
                    variant="contained"
                    className={ButtonClassSets.danger}
                  >
                    <AiFillDelete />
                    Delete venue
                  </Button>
                )}
              </div>
              <div className="col-span-1">
                {/* this is for logging data, and also good for spacing the buttons out xD */}
                {/*<Button type="button" onClick={() => console.log(formData)} variant="contained" style={ButtonStyles.default}>*/}
                {/*    Log form data*/}
                {/*</Button>*/}
              </div>
              <div className="col-span-1 justify-self-end">
                <Button
                  type="submit"
                  variant="contained"
                  className={ButtonClassSets.primary}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </BodyCard>

      {/* MODALS */}
      {/* Delete Venue Modal*/}
      <ConfirmModalV2
        open={isConfirmDeleteModalOpen}
        headerText="Are you sure you want to delete this venue?"
        bodyText="This process is irreversible!"
        confirmButtonClassName={ButtonClassSets.danger}
        confirmButtonText="Confirm delete"
        backButtonCallbackFn={() => setIsConfirmDeleteModalOpen(false)}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        confirmButtonCallbackFn={() => {
          FetchOwnerInfoAPI.deleteVenueById(
            encodedToken,
            formData.venueId
          ).then((res) => {
            if (res.status === 200) navigate("/venues");
          });
        }}
      />
    </>
  );
}
