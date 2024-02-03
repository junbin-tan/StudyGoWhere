import React, { useContext, useEffect, useState } from "react";
import PageStructure from "../Components/PageStructure/PageStructure";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link, useNavigate, useParams } from "react-router-dom";
import FetchOwnerInfoAPI from "../FunctionsAndContexts/FetchOwnerInfoAPI";
import VenueDetailsV2 from "../Components/Venues/VenueEdit/VenueDetailsV2";
import {
  CalendarMonth,
  Engineering,
  FormatListBulleted,
  InsertPhoto,
} from "@mui/icons-material";
import useFormWrapper from "../FunctionsAndContexts/useFormWrapper";
import VenueBusinessHours from "../Components/Venues/VenueEdit/VenueBusinessHours";
import ErrorModal from "../Components/CommonComponents/Modal/ErrorModal";
import getAllLeafKeysDeep from "../utilities/getAllLeafKeysDeep";
import SuccessModal from "../Components/CommonComponents/Modal/SuccessModal";
import AddVenueImages from "../Components/AddVenue/AddVenueImages";
import { Breadcrumbs, Button } from "@mui/material";
import ButtonClassSets from "../utilities/ButtonClassSets";
import checkFormErrors from "../FunctionsAndContexts/checkFormErrors";
import VenueOperator from "../Components/Venues/VenueEdit/VenueOperator";
import { FormAndFormErrorsContext } from "../FunctionsAndContexts/FormAndFormErrorsContext";
import SnackbarContext from "../FunctionsAndContexts/SnackbarContext";
import CopyFromToBar from "../Components/Venues/VenueEdit/CopyFromToBar";

export default function AddVenuePage() {
  const { pageName } = useParams();
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);
  const [thisVenue, setThisVenue] = useState(null);
  const [paths, setPaths] = useState([]); // may change this later on depending on implementation
  const [triggerReload, setTriggerReload] = useState(false); // this is for reloading owner data

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorHeader, setErrorHeader] = useState("Error");
  const [errorMessage, setErrorMessage] = useState("Error");

  // This snackbar stuff is for the copyFrom feature
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  // +== CODE FOR HANDLING TAB VALUES
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  // -== END CODE FOR HANDLING TAB VALUES

  const fetchAndRefreshOwnerData = () => {};

  // SETTING OF TAB VALUE BASED ON URL
  useEffect(() => {
    if (pageName == "images") {
      setTabValue(2);
    } else if (pageName == "business-hours") {
      setTabValue(1);
    } else if (pageName == "details") {
      setTabValue(0);
    } else if (pageName == "venue-operator") {
      setTabValue(3);
    } else {
      setTabValue(0);
    }
  }, [pageName]);

  // === FORM & FORM SUBMITTING CODE ===

  const form = useFormWrapper({
    venueId: null,
    venueName: "",
    address: {
      addressId: null,
      address: "",
      postalCode: "",
      latitude: 1.3521, // singapore's latLng
      longitude: 103.8198,
    },
    phoneNumber: "",
    description: "",
    averagePrice: null,
    venueStatus: "DEACTIVATED",
    venueCrowdLevel: "GREEN",
    images: [],

    businessHours: {
      businessHoursId: null,
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
      holidays: [],
    },

    operator: {
      username: "",
      password: "",
      // dont set these initial values to null, even though if you disable operator, it will be null
      // this is because of the tempUsernames in the VenueOperator component, which is set to this as an initial value
      // if it is null, when it calls handleChange, the trim method will kaboom
    },
    // reviews: thisVenue?.reviews,
  });

  // in EditVenue, all of the fields were false by default (as they had to have been valid to be even persisted)
  // here, we have to selectively set the fields to true or false depending on whether they are required or not
  const formErrors = useFormWrapper({
    venueId: false,
    venueName: "empty",
    address: {
      addressId: false,
      address: "empty",
      postalCode: "empty",
      latitude: false,
      longitude: false,
    },
    phoneNumber: "empty",
    description: "empty",
    averagePrice: "empty",
    amenities: [],
    venueStatus: false, // we can take out a few of these that have no need to validate
    venueCrowdLevel: false,
    images: false,

    businessHours: {
      businessHoursId: false,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
      holidays: false,
    },

    operator: {
      username: false,
      password: false,
    },
  });
  const handleFormChange = (event) => {
    // can override event.target if we handling form change programmatically
    // postal code from selection of address on gmaps is 1 example
    const { name, value } = event.target;
    form.setKeyValue(name, value);

    console.log("name: " + name + ", value: " + value);

    // --- ERROR CHECKING ---
    // we do custom checking for operator.password, because in AddVenue it CANNOT BE EMPTY while in EditVenue it can
    if (name != "operator.password") {
      checkFormErrors(name, value, formErrors.setKeyValue);
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
      const isValidPassword = passwordRegex.test(value);
      let errorType = false;
      if (value.trim() == "") {
        errorType = "empty";
      } else if (value.length > 255) {
        errorType = "tooLong";
      } else if (!isValidPassword) {
        errorType = "invalid";
      } else {
        errorType = false;
      }

      formErrors.setKeyValue(name, errorType);
    }

    console.log(
      "Errors Check: " +
        "name: " +
        name +
        ", value: " +
        value +
        ", error: " +
        formErrors.getKeyValue(name)
    );
    // more form error handling if needed
  };

  // the usage of this is for convenience, we can dont use also?
  const handleSubmit = async (e) => {
    e.preventDefault();
    // do check on errors: cos Submit form can be called from other tabs, but it doesnt check the fields in Details
    let errorsFound = [];
    getAllLeafKeysDeep(formErrors.getObj()).map((key, index) => {
      console.log("going thru key: " + key);
      if (formErrors.getKeyValue(key)) {
        console.log("error found in " + key);
        errorsFound.push(key);
      }
    });

    if (errorsFound.length != 0) {
      let errorKeysString = "";
      errorsFound.map((key, index) => {
        if (index != errorsFound.length - 1) {
          errorKeysString += key + ", \n";
        } else {
          errorKeysString += key;
        }
      });
      setErrorMessage(
        "Error creating new venue, there are incorrect values in fields:\n " +
          errorKeysString
      );
      setIsErrorModalOpen(true);
      return;
    }

    try {
      const response = await FetchOwnerInfoAPI.createVenue(
        encodedToken,
        form.getObj()
      );
      console.log("Successful createVenue call, response: ", response);

      const createdVenue = response.data;
      console.log("createdVenue is: ", createdVenue)
      if (response.data.images.length > 0) {
        const updateDisplayImageResponse =
          await FetchOwnerInfoAPI.updateVenueDisplayImagePath(
            encodedToken,
            createdVenue.venueId,
            createdVenue.images[0]
          );
        console.log(
          "Successful updateVenueDisplayImagePath call, response: ",
          updateDisplayImageResponse
        );
      }
      setIsSuccessModalOpen(true); // Show success modal
    } catch (error) {
      console.log("error object: ", error);
      if (error.response.status == 409) {
        setErrorHeader("Error: Operator Username already taken");
        setErrorMessage(
          "Operator username is already taken! Please use another username."
        );
        setIsErrorModalOpen(true);
      } else {
        setErrorHeader("Error");
        setErrorMessage("Error sending the request: " + error);
        setIsErrorModalOpen(true);
      }
    }
  };

  // !== END OF FORM & FORM SUBMITTING CODE ===

  // === BREADCRUMBS ===
  function ActiveLastBreadcrumb() {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/venues">
            Home
          </Link>
          <Link underline="hover" className="text-lightgray-100" to="/venues">
            Venues
          </Link>
          <Link
            underline="hover"
            className="text-custom-yellow"
            href="/add-venue"
            aria-current="page"
          >
            Add new venue
          </Link>
        </Breadcrumbs>
      </div>
    );
  }
  // !== END OF BREADCRUMBS ===

  return (
    <>
      <FormAndFormErrorsContext.Provider value={{ form, formErrors }}>
        <PageStructure
          title={"Add a Venue"}
          breadcrumbs={<ActiveLastBreadcrumb />}
        >
          {/* have to use MUI's own centered prop to centre items, but otherwise the rest is fine */}
          <SnackbarContext.Provider value={{setSnackbarOpen, setSnackbarSeverity, setSnackbarMessage}}>
            <CopyFromToBar renderParts={{copyFrom: true}} />
          </SnackbarContext.Provider>
          <form onSubmit={handleSubmit}>
            <Tabs
              className="flex flex-row items-center"
              centered
              value={tabValue}
              onChange={handleTabChange}
              aria-label="icon label tabs example"
            >
              <Link
                to={`/add-venue/details`}
                className="flex flex-auto max-w-md"
                onClick={() => setTabValue(0)}
              >
                <Tab
                  icon={<FormatListBulleted />}
                  label="VENUE DETAILS"
                  className="flex-auto max-w-md"
                  value={0}
                />
              </Link>
              <Link
                to={`/add-venue/business-hours`}
                className="flex flex-auto max-w-md"
                onClick={() => setTabValue(1)}
              >
                <Tab
                  icon={<CalendarMonth />}
                  label="BUSINESS HOURS"
                  className="flex-auto max-w-md"
                  value={1}
                />
              </Link>
              <Link
                to={`/add-venue/images`}
                className="flex flex-auto max-w-md"
                onClick={() => setTabValue(2)}
              >
                <Tab
                  icon={<InsertPhoto />}
                  label="IMAGES"
                  className="flex-auto max-w-md"
                  value={2}
                />
              </Link>
              <Link
                to={`/add-venue/venue-operator`}
                className="flex flex-auto max-w-md"
                onClick={() => setTabValue(3)}
              >
                <Tab
                  icon={<Engineering />}
                  label="VENUE OPERATOR"
                  className="flex-auto max-w-md"
                  value={3}
                />
              </Link>
              {/*<Tab icon={<PersonPinIcon />} label="VENUE LOCATION" className="flex-auto max-w-md"/>*/}
            </Tabs>

            {/*  Here in the main body, I'm able to reuse both VenueDetailsV2 and VenueBusinessHours component.  */}
            {/*  Unfortunately, the AddVenueImages requires minor tweaking as upload images sent a requests to backend in Edit Venue */}

            {form.getObj() ? (
              <>
                {pageName === undefined || pageName === "details" ? (
                  <VenueDetailsV2
                    handleChange={handleFormChange}
                    formData={form.getObj()}
                    setFormData={form.setObj}
                    setFormKeyValue={form.setKeyValue}
                    formErrorsData={formErrors.getObj()} // setFormErrorsKeyValue={formErrors.setKeyValue}
                    encodedToken={encodedToken}
                    hasSubmitButton={false}
                    showStatuses={false}
                    hasDeleteButton={false}
                  />
                ) : (
                  ""
                )}

                {pageName === "business-hours" ? (
                  <VenueBusinessHours
                    formData={form.getObj()}
                    handleFormChange={handleFormChange}
                    hasSubmitButton={false}
                  />
                ) : (
                  ""
                )}

                {pageName === "images" ? (
                  <AddVenueImages
                    formData={form.getObj()}
                    setFormData={form.setObj}
                    paths={form.getObj()?.images}
                    encodedToken={encodedToken}
                  />
                ) : (
                  ""
                )}

                {pageName === "venue-operator" ? (
                  <VenueOperator
                    formData={form.getObj()}
                    setFormKeyValue={form.setKeyValue}
                    formErrorsData={formErrors.getObj()}
                    handleChange={handleFormChange}
                    encodedToken={encodedToken}
                    hasSubmitButton={false}
                    isAddingVenue={true}
                  />
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}

            {/* added Submit button outside here, instead of inside each page like in the Edit scenario*/}
            <div className={"flex justify-center"}>
              <Button type="submit" className={ButtonClassSets.dynamicDelete}>
                Submit all sections and create venue
              </Button>
            </div>
          </form>
          <SuccessModal
            open={isSuccessModalOpen}
            onClose={() => {
              setIsSuccessModalOpen(false)
              navigate("/venues");
            }}
            headerText={"Success!"}
            bodyText={"Information successfully updated"}
            closeButtonCallbackFn={() => {
              setIsSuccessModalOpen(false);
              navigate("/venues");
            }}
          />
          <ErrorModal
            open={isErrorModalOpen}
            onClose={() => setIsErrorModalOpen(false)}
            headerText={errorHeader}
            bodyText={errorMessage}
            closeButtonCallbackFn={() => setIsErrorModalOpen(false)}
          />
        </PageStructure>
      </FormAndFormErrorsContext.Provider>
    </>
  );
}
