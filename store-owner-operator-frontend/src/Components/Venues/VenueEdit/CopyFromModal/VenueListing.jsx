import React, { useContext, useEffect, useState } from "react";
import checkFormErrors from "../../../../FunctionsAndContexts/checkFormErrors";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary, Alert,
  Button,
  capitalize,
  FormGroup,
} from "@mui/material";
import VenueToggleAllChecks from "./VenueToggleAllChecks";
import VenueInfoItem from "./VenueInfoItem";
import Amenities from "../../Amenities/Amenities";
import AveragePrice from "../../AveragePrice/AveragePrice";
import { FormAndFormErrorsContext } from "../../../../FunctionsAndContexts/FormAndFormErrorsContext";
import ButtonStyles from "../../../../utilities/ButtonStyles";
import ImageCarousel from "../../../ImageCarousel/ImageCarousel";
import FirebaseFunctions from "../../../../FunctionsAndContexts/FirebaseFunctions";
import ConfirmModalV2 from "../../../CommonComponents/Modal/ConfirmModalV2";
import DayBusinessHours from "../../../BusinessHours/DayBusinessHours";
import HolidayDatesSection from "../../../BusinessHours/HolidayDatesSection";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FieldLabel from "../../../CommonComponents/Form/FieldLabel";
import ButtonClassSets from "../../../../utilities/ButtonClassSets";
import UnsavedChangesContext from "../../../../FunctionsAndContexts/UnsavedChangesContext";
import SnackbarContext from "../../../../FunctionsAndContexts/SnackbarContext";

export default function VenueListing({
  venue,
  preselectedFields = {},
  accordionsOpen,
  handleAccordionChange,
    handleConfirmButton,
}) {
  const [selectedFields, setSelectedFields] = useState(preselectedFields);
  const { form, formErrors } = useContext(FormAndFormErrorsContext);
  const [imageDownloadURLs, setImageDownloadURLs] = useState();
  const [displayImageDownloadURLs, setDisplayImageDownloadURLs] = useState();
  // the function to convert returns a list, so i name DisplayImageDownloadURLs as plural
  // even though there's only one image

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // If UnsavedChangesContext is not passed in, use empty object as default so that setHasUnsavedChanges is undefined
  const {setHasUnsavedChanges} = useContext(UnsavedChangesContext) || {};
  const {setSnackbarOpen, setSnackbarSeverity, setSnackbarMessage} = useContext(SnackbarContext);

  useEffect(() => {
    FirebaseFunctions.convertPathsToDownloadURLs(venue.images).then(
      (downloadURLs) => setImageDownloadURLs(downloadURLs)
    );
    FirebaseFunctions.convertPathsToDownloadURLs([venue.displayImagePath]).then(
      (downloadURLs) => {
        console.log("downloadURLs is:", downloadURLs);
        setDisplayImageDownloadURLs(downloadURLs);
      }
    );
  }, [venue]);
  const replaceVenueFormData = () => {
    let copyOfFormData = { ...form.getObj() };
    let copyOfFormErrorsData = {...formErrors.getObj()};
    try {
      // this represents the current venue that is being edited, thus the form
      Object.keys(selectedFields)
        .filter((key) => selectedFields[key]) // only perform this on the "true" ones
        .forEach((key) => {
          if (key == "address") {
            // copy address object and set addressId to null (so that it will be created as a new address)
            copyOfFormData["address"] = {
              ...venue["address"],
              addressId: copyOfFormData.address.addressId,
            }; // i mean we can use venue[key] here, but this is clearer

            // UPDATING FORM ERRORS
            // we have to manually update form errors here because we are directly updating formData,
            // and not using handleChange in user input like normal
            checkFormErrors(
              "address.address",
              venue.address.address,
              formErrors.setKeyValue
            );
            // yes I am aware how ridiculous venue.address.address is, but there's no going back now; horrible design decisions were made
            checkFormErrors(
              "address.postalCode",
              venue.address.postalCode,
              formErrors.setKeyValue
            );

            console.log("formErrors object: ", formErrors.getObj())
            return;
          }

          if (key == "businessHours") {
            copyOfFormData["businessHours"] = {
              ...venue["businessHours"],
              businessHoursId: copyOfFormData.businessHours.businessHoursId,
            };
            // We don't have a legit businessHours error checking yet
            // checkFormErrors("businessHours", "placeholder",formErrors.setKeyValue);
            return;
          }
          // == IMAGES STUFF ==
          // * Actually we can just copy directly, so for images/displayImage it goes to the last if statement
          // if (key == "images") {
          //     // do images stuff
          //     return;
          // }
          //
          if (key == "displayImagePath") {
            copyOfFormData["displayImagePath"] = venue["displayImagePath"];


            // DONT DO ANYTHING IF DISPLAY IMAGE IS EMPTY, IF NOT WE WILL PUSH NULL OR EMPTY STRING VALUE INTO ARRAY
            if (copyOfFormData["displayImagePath"] == "" || copyOfFormData["displayImagePath"] == null) {
              return;
            }

            if (
              !copyOfFormData.images.includes(
                copyOfFormData["displayImagePath"]
              )
            ) {
              copyOfFormData.images.push(copyOfFormData["displayImagePath"]);
            }
            return;
          }

          // for the rest of the "1-level/non-object value" keys, can just copy directly
          if (selectedFields[key] === true) {
            copyOfFormData[key] = venue[key];
            // checkFormErrors(key, venue[key], formErrors.setKeyValue);
            // ^^ this doesnt work because it doesnt update formerrors until the end of forEach
            copyOfFormErrorsData[key] = false; // when copying theres going to be no error anyway
            console.log("formErrors object: ", formErrors.getObj())
          }
        });

      if (setHasUnsavedChanges != undefined) setHasUnsavedChanges(true);

      console.log("copyOfFormData", copyOfFormData)
      formErrors.setObj(copyOfFormErrorsData)
      form.setObj(copyOfFormData);

      // don't send request to backend yet. let user confirm first with save button
      // set some snackbar to open
    } catch (e) {
      // probably upload to firebase error. not sure if setting form data will rollback, but not a big issue
      console.log(e);
    }
  };
  const handleCheck = (e) => {
    console.log("e.target.value:", e.target.value);
    const fieldSelected = e.target.value;
    const copyOfSelectedFields = {
      ...selectedFields,
      [e.target.value]: !selectedFields[e.target.value],
    };
    console.log("copyOfSelectedFields", copyOfSelectedFields);
    setSelectedFields(copyOfSelectedFields);
  };

  const changeChecked = (checkedKey) => {
    const fakeEvent = { target: { value: checkedKey } };
    handleCheck(fakeEvent);
  };

  // There is a small bug: If you open the accordion while the image is still loading, when it loads,
  // the accordion will close itself
  return (
    <Accordion
      expanded={accordionsOpen[venue.venueId] || false}
      onChange={() => handleAccordionChange(venue.venueId)}
      key={venue.venueId}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <FieldLabel>{venue.venueName}</FieldLabel>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          <div className="flex flex-col gap-4">
            <VenueToggleAllChecks
              selectedFields={selectedFields}
              setSelectedFields={setSelectedFields}
            />

            <VenueInfoItem
              value={"venueName"}
              checked={selectedFields.venueName}
              handleOnClick={() => changeChecked("venueName")}
            >
              <p>{venue.venueName}</p>
            </VenueInfoItem>
            <VenueInfoItem
              value={"description"}
              checked={selectedFields.description}
              handleOnClick={() => changeChecked("description")}
            >
              <p>{venue.description}</p>
            </VenueInfoItem>

            <VenueInfoItem
              value={"address"}
              checked={selectedFields.address}
              handleOnClick={() => changeChecked("address")}
            >
              <p>{venue.address.address}</p>
              <p>{venue.address.postalCode}</p>
            </VenueInfoItem>
            {/*override label here because the default would be PhoneNumber without a space*/}
            <VenueInfoItem
              value={"phoneNumber"}
              checked={selectedFields.phoneNumber}
              handleOnClick={() => changeChecked("phoneNumber")}
            >
              <p>{venue.phoneNumber}</p>
            </VenueInfoItem>
            <VenueInfoItem
              value={"images"}
              checked={selectedFields.images}
              handleOnClick={() => changeChecked("images")}
            >
              <ImageCarousel downloadURLs={imageDownloadURLs} />
            </VenueInfoItem>
            <VenueInfoItem
              value={"displayImagePath"}
              label={"Display Image"}
              checked={selectedFields.displayImagePath}
              handleOnClick={() => changeChecked("displayImagePath")}
            >
              <ImageCarousel downloadURLs={displayImageDownloadURLs} />
            </VenueInfoItem>
            <VenueInfoItem
              value={"amenities"}
              checked={selectedFields.amenities}
              handleOnClick={() => changeChecked("amenities")}
            >
              <Amenities
                selectedAmenities={venue.amenities}
                clickable={false}
              />
            </VenueInfoItem>
            <VenueInfoItem
              value={"averagePrice"}
              checked={selectedFields.averagePrice}
              handleOnClick={() => changeChecked("averagePrice")}
            >
              <AveragePrice
                selectedAveragePrice={venue.averagePrice}
                clickable={false}
              />
            </VenueInfoItem>
            <VenueInfoItem
              value={"businessHours"}
              checked={selectedFields.businessHours}
              handleOnClick={() => changeChecked("businessHours")}
            >
              <h2>Regular Business Hours</h2>
              <div className="flex flex-col gap-2">
                {Object.keys(venue.businessHours).map((key, index) => {
                  if (key == "holidays") return; // skip holidays
                  if (key == "businessHoursId") return; // skip businessHoursId
                  const day = capitalize(key);
                  const timeRangeList = venue.businessHours[key];
                  return (
                    <DayBusinessHours
                      key={day}
                      day={day}
                      timeRangeList={timeRangeList}
                    />
                  );
                })}
              </div>
              <h2>Holiday Dates</h2>
              <div>
                <HolidayDatesSection
                  dateRangeList={venue.businessHours.holidays}
                  addonFlexClassNames={"items-start"}
                />
              </div>
            </VenueInfoItem>
          </div>

          {/* I encapsulated the checking all fields method inside this component to make the file tidier,
                             so we have to pass in selectedFields and setSelected fields as a result*/}
        </FormGroup>
        {/*<Button variant={"contained"} onClick={() => console.log("copyofform:", {...form.getObj()})} style={ButtonStyles.selected}>*/}
        {/*    console log copy of formdata*/}
        {/*</Button>*/}
      </AccordionDetails>
      <AccordionActions>
        <Button
          type={"button"}
          variant={"contained"}
          onClick={() => setConfirmModalOpen(true)}
          className={ButtonClassSets.primary}
        >
          Copy Selected Fields
        </Button>
        <ConfirmModalV2
          open={confirmModalOpen}
          headerText={"Are you sure you want to copy the selected fields?"}
          bodyText={
            <>
              <p>This will replace the current fields this venue has.</p>
              <p>
                If you wish to revert to the venue's previous fields, simply
                leave the page without saving.
              </p>
            </>
          }
          confirmButtonCallbackFn={() => {
            replaceVenueFormData();
            setConfirmModalOpen(false);
            handleConfirmButton();
            setSnackbarOpen(true);
            setSnackbarSeverity("success");
            setSnackbarMessage("Successfully copied selected fields!");
          }}
          confirmButtonStyle={ButtonStyles.selected}
          backButtonCallbackFn={() => setConfirmModalOpen(false)}
          onClose={() => setConfirmModalOpen(false)}
        />
      </AccordionActions>


    </Accordion>
  );
}
