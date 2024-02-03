import React, { createContext, useContext, useEffect, useState } from "react";
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
import VenueImages from "../Components/Venues/VenueEdit/VenueImages";
import ConfirmModalV2 from "../Components/CommonComponents/Modal/ConfirmModalV2";
import useFormWrapper from "../FunctionsAndContexts/useFormWrapper";
import VenueBusinessHours from "../Components/Venues/VenueEdit/VenueBusinessHours";
import ErrorModal from "../Components/CommonComponents/Modal/ErrorModal";
import getAllLeafKeysDeep from "../utilities/getAllLeafKeysDeep";
import SuccessModal from "../Components/CommonComponents/Modal/SuccessModal";
import checkFormErrors from "../FunctionsAndContexts/checkFormErrors";
import VenueOperator from "../Components/Venues/VenueEdit/VenueOperator";
import SellIcon from "@mui/icons-material/Sell";
import VenueVoucherListing from "../Components/Venues/VenueEdit/VenueVoucherListing";
import { Alert, Breadcrumbs } from "@mui/material";
import Amenities from "../Components/Venues/Amenities/Amenities";
import AveragePrice from "../Components/Venues/AveragePrice/AveragePrice";
import PrevNextVenueBar from "../Components/Venues/PrevNextVenueBar/PrevNextVenueBar";
import { FormAndFormErrorsContext } from "../FunctionsAndContexts/FormAndFormErrorsContext";
import CopyFromToBar from "../Components/Venues/VenueEdit/CopyFromToBar";
import UnsavedChangesContext from "../FunctionsAndContexts/UnsavedChangesContext";
import SnackbarContext from "../FunctionsAndContexts/SnackbarContext";
import Snackbar from "@mui/material/Snackbar";
import ButtonClassSets from "../utilities/ButtonClassSets";
export default function VenueEditPage() {
  const { id, pageName } = useParams();
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);
  const [thisVenue, setThisVenue] = useState(null);
  const [paths, setPaths] = useState([]); // may change this later on depending on implementation
  const [triggerReload, setTriggerReload] = useState(false); // this is for reloading owner data

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorHeader, setErrorHeader] = useState("Error");
  const [errorMessage, setErrorMessage] = useState("Error");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const navigate = useNavigate();

  // +== CODE FOR HANDLING TAB VALUES
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // actually can handle navigate in here also, but we will just use the Link to do it
  };
  // -== END CODE FOR HANDLING TAB VALUES

  const fetchAndRefreshOwnerData = () => {
    FetchOwnerInfoAPI.getOwner(encodedToken).then((response) => {
      if (response.status === 200) {
        setOwnerData(response.data);
        setThisVenue(response.data.venues.find((v) => v.venueId == id));
        // setPaths(
        //     response.data.venues.find((v) => v.venueId == id).images
        // );
      }
    });
  };
  // REFRESHING OF OWNER DATA &
  useEffect(() => {
    fetchAndRefreshOwnerData();
  }, [id]);

  // == STOP USER FROM LEAVING if he has unsaved changes

  const hasUnsavedChangesCallback = () => {
    return hasUnsavedChanges;
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => {
      console.log(
        "beforeUnloadHandler is called, hasUnsavedChanges is: ",
        hasUnsavedChangesCallback()
      );
      if (hasUnsavedChangesCallback()) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [hasUnsavedChanges]);

  //  SETTING OF TAB VALUE BASED ON URL
  useEffect(() => {
    // we will keep this for now even though its duplicating the fetch call in SideBar
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

  // === useEffect to update form data when thisVenue changes
  useEffect(() => {
    if (thisVenue == null) {
      return;
    }
    const updatedForm = form.setObj({
      ...thisVenue,
      operator: {
        ...thisVenue.operator,
        username: thisVenue.operator?.username ?? "",
        password: "",
      },
    });
    // form.setKeyValue("operator.password", "", updatedForm);
    // ^ this does not trigger rerender of form?
    // had to do some code-arm-twisting to get the above to work
    // react setStates are batched, so the actual form is not updated yet when we call setKeyValue
    setPaths(thisVenue?.images);
  }, [thisVenue]);

  // === FORM & FORM SUBMITTING CODE ===

  const form = useFormWrapper(false);

  const formErrors = useFormWrapper({
    venueId: false,
    venueName: false,
    address: {
      addressId: false,
      address: false,
      postalCode: false,
      latitude: false,
      longitude: false,
    },
    phoneNumber: false,
    description: false,
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

      if (value.length > 255) {
        errorType = "tooLong";
      } else if (!isValidPassword) {
        errorType = "invalid";
      } else {
        errorType = false;
      }
      if (value.trim() == "") {
        errorType = false;
      }
      console.log(value.trim());
      formErrors.setKeyValue(name, errorType);
    }

    console.log("Has unsaved changes: ", hasUnsavedChanges);
    setHasUnsavedChanges(true);

    // console.log(
    //   "Errors Check: " +
    //     "name: " +
    //     name +
    //     ", value: " +
    //     value +
    //     ", error: " +
    //     formErrors.getKeyValue(name)
    // );
    // console.log(
    //   "note that the above error may be outdated by 1 step, since setError is async"
    // );
  };

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
        "Error saving venue info, there are incorrect values in fields:\n " +
          errorKeysString
      );
      setIsErrorModalOpen(true);
      return;
    }

    try {
      const response = await FetchOwnerInfoAPI.updateVenue(
        encodedToken,
        form.getObj()
      );
      console.log("successful request, sent venue is:", form.getObj());
      console.log("successful response:", response);
      setIsSuccessModalOpen(true); // Show success modal
      setHasUnsavedChanges(false); // after saving, set unsaved changes to 0
    } catch (error) {
      console.log("error object: ", error);
      console.log("form sent is: ", form.getObj());
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

  // console.log("here")
  // console.log(form.getObj())
  // console.log(form.setKeyValue)
  // console.log(form.setObj)
  // !== END OF FORM & FORM SUBMITTING CODE ===

  // !== BREADCRUMBS CODE ===
  function ActiveLastBreadcrumb({ name }) {
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
            className="text-lightgray-100"
            to={`/venues/${id}`}
          >
            {name}
          </Link>
          <Link
            underline="hover"
            className="text-custom-yellow"
            to={`/venues/${id}/details`}
            aria-current="page"
          >
            Edit {name} {hasUnsavedChanges ? "(Unsaved Changes)" : ""}
          </Link>
        </Breadcrumbs>
      </div>
    );
  }

  return (
    <>
      <FormAndFormErrorsContext.Provider value={{ form, formErrors }}>
        <PageStructure
          title={`Edit ${thisVenue?.venueName}`}
          breadcrumbs={<ActiveLastBreadcrumb name={thisVenue?.venueName} />}
        >
          {/*take note of ownerData here, maybe will have unexpected edge cases*/}
          <PrevNextVenueBar
            thisVenueId={id} // the form might not load/fetch fast enough, so we use the id from the URL
            ownerVenuesList={ownerData.venues}
            pageName={pageName}
          />
          <UnsavedChangesContext.Provider
            value={{ hasUnsavedChanges, setHasUnsavedChanges }}
          >
            <SnackbarContext.Provider
              value={{
                setSnackbarOpen,
                setSnackbarSeverity,
                setSnackbarMessage,
              }}
            >
              <CopyFromToBar hasUnsavedChanges={hasUnsavedChanges} />
            </SnackbarContext.Provider>
          </UnsavedChangesContext.Provider>
          <form onSubmit={handleSubmit}>
            {/* have to use MUI's own centered prop to centre items in Tabs, but otherwise the rest is fine */}
            <Tabs
              className="flex flex-row items-center"
              centered
              value={tabValue}
              onChange={handleTabChange}
              aria-label="icon label tabs example"
            >
              <Link
                to={`/venues/${id}/details`}
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
                to={`/venues/${id}/business-hours`}
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
                to={`/venues/${id}/images`}
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
                to={`/venues/${id}/venue-operator`}
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
              {/* <Link to={`/venues/${id}/voucher-listing`} className="flex flex-auto max-w-md" onClick={() => setTabValue(4)}>
                        <Tab icon={<SellIcon />} label="VOUCHER LISTING" className="flex-auto max-w-md" value={4}/>
                    </Link> */}
              {/*<Tab icon={<PersonPinIcon />} label="VENUE LOCATION" className="flex-auto max-w-md"/>*/}
            </Tabs>

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
                  />
                ) : (
                  ""
                )}

                {pageName === "business-hours" ? (
                  <VenueBusinessHours
                    formData={form.getObj()}
                    handleFormChange={handleFormChange}
                  />
                ) : (
                  ""
                )}
                {pageName === "voucher-listing" ? (
                  <VenueVoucherListing
                    formData={form.getObj()}
                    encodedToken={encodedToken}
                  />
                ) : (
                  ""
                )}

                {pageName === "images" ? (
                  <VenueImages
                    setTriggerReload={setTriggerReload}
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
                  />
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </form>
          <SuccessModal
            open={isSuccessModalOpen}
            onClose={() => {
              setIsSuccessModalOpen(false);
              window.location.reload();
            }}
            headerText={"Success!"}
            bodyText={"Information successfully updated"}
            closeButtonCallbackFn={() => {
              setIsSuccessModalOpen(false);
              window.location.reload();
            }}
          />
          <ConfirmModalV2
            open={isSuccessModalOpen}
            onClose={() => {
              setIsSuccessModalOpen(false);
              window.location.reload();
            }}
            headerText={"Success!"}
            bodyText={"Information successfully updated"}
            confirmButtonCallbackFn={() => {
              setIsSuccessModalOpen(false);
              window.location.reload();
            }}
            renderBackButton={false}
            confirmButtonClassName={ButtonClassSets.primary}
          ></ConfirmModalV2>
          <ErrorModal
            open={isErrorModalOpen}
            onClose={() => setIsErrorModalOpen(false)}
            headerText={errorHeader}
            bodyText={errorMessage}
            closeButtonCallbackFn={() => setIsErrorModalOpen(false)}
          />

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </PageStructure>
      </FormAndFormErrorsContext.Provider>
    </>
  );
}
