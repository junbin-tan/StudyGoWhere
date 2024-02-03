import { Link, useParams } from "react-router-dom";
import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";
import PageStructure from "../Components/PageStructure/PageStructure";
import { OperatorUserContext } from "../FunctionsAndContexts/OperatorUserContext";
import { FetchAndReturnUser } from "../FunctionsAndContexts/FetchAndReturnUser";
import { Breadcrumbs, Button } from "@mui/material";
import PrevNextVenueBar from "../Components/Venues/PrevNextVenueBar/PrevNextVenueBar";
import ScheduleNavigationTabs from "../Components/Venues/VenueBookingSchedule/ScheduleNavigationTabs";
import DaySchedules from "../Components/Venues/VenueBookingSchedule/DaySchedules/DaySchedules";
import DayScheduleGenerator from "../Components/Venues/VenueBookingSchedule/DayScheduleGenerator/DayScheduleGenerator";
import TableTypes from "../Components/TableType/TableTypes";
import { dayScheduleTemplatesReducer } from "../Components/Venues/VenueBookingSchedule/DaySchedules/helpers/DayScheduleTemplatesReducer";
import { venueScheduleReducer } from "../Components/Venues/VenueBookingSchedule/DaySchedules/helpers/VenueScheduleReducer";
import { VenueContext } from "../Components/Venues/VenueBookingSchedule/DaySchedules/helpers/VenueContext";
import SnackbarTopCenter from "../Components/CommonComponents/Snackbar/SnackbarTopCenter";
import SnackbarContext from "../FunctionsAndContexts/SnackbarContext";

export default function VenueBookingSchedule() {
  const { id, pageName } = useParams();
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  // the || {} is to prevent the useContext from returning undefined; similar to using &&
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext) || {};
  const { operatorData, setOperatorData } =
    useContext(OperatorUserContext) || {};

  const [thisVenue, setThisVenue] = useState(null);
  const [venueScheduleState, dispatchVenueSchedule] = useReducer(
    venueScheduleReducer,
    null
  );


  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // UseEffect to fetch ownerData or operatorData on page load and id change
  useEffect(() => {
    if (token.role == "Owner") {
      try {
        FetchAndReturnUser.owner(encodedToken).then((ownerData) =>
          setOwnerData(ownerData)
        );
      } catch (err) {
        console.log(err.message); // request failed somehow
      }
    } else if (token.role == "Operator") {
      try {
        FetchAndReturnUser.operator(encodedToken).then((fetchedOperator) => {
          setOperatorData(fetchedOperator);
          console.log(
            "operatorData is (called from same fn as setOperator): ",
            fetchedOperator
          );
        });
      } catch (err) {
        console.log(err.message); // request failed somehow
      }
    }
  }, [id]);

  // UseEffects to set thisVenue from ownerData/operatorData that was fetched
  useEffect(() => {
    if (ownerData && !(ownerData instanceof Promise) && ownerData.userId != 0) {
      // flow of ownerData value is (null -> Promise -> {...ownerdata})
      // when Promise resolves, the ownerData value changes and this useEffect is triggered again
      // console.log("HELLOO ownerdata is: ", ownerData)
      // console.log(ownerData.venues)

      console.log("ownerData logging", ownerData);

      const extractedVenue = ownerData.venues.find((v) => v.venueId == id);
      setThisVenue(extractedVenue);
      dispatchVenueSchedule({
        type: "SET_VENUE_SCHEDULE",
        payload: extractedVenue.venueSchedule,
      });
    }
  }, [ownerData]);
  useEffect(() => {
    console.log("operatorData logging", operatorData);
    if (operatorData && !(operatorData instanceof Promise)) {
      // if (operatorData.venue.venueId == id) setThisVenue(operatorData.venue); // operator only has 1 venue
      console.log("setting this venue", operatorData.venue);
      setThisVenue(operatorData.venue);
    }
  }, [operatorData]);

  // Setting up reducers for each major tab subpage

  // const [templatesState, dispatchTemplatesState] =
  //     useReducer(dayScheduleTemplatesReducer, {selected: null, dayOfWeekTemplates: null, dayOfWeekTemplatesObject: null});

  // !== BREADCRUMBS CODE ===
  // if ownerData is undefined (means its operator) then we don't render the breadcrumbs
  function ActiveLastBreadcrumb({ name }) {
    return (
      <div role="presentation">
        {ownerData ? (
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
              to={`/venues/${id}/booking-schedule`}
              aria-current="page"
            >
              Booking Schedule
            </Link>
          </Breadcrumbs>
        ) : (
          <> </>
        )}
      </div>
    );
  }
  // !== END OF BREADCRUMBS CODE ===

  return (
    <PageStructure
      title={`${thisVenue?.venueName}'s Booking Schedule`}
      breadcrumbs={ActiveLastBreadcrumb({ name: thisVenue?.venueName })}
    >
      {ownerData && (
        <PrevNextVenueBar ownerVenuesList={ownerData.venues} thisVenueId={id} />
      )}

      <ScheduleNavigationTabs />

      <VenueContext.Provider value={{ thisVenue, setThisVenue }}>
        <SnackbarContext.Provider value={{openSnackbar, setOpenSnackbar, snackbarMessage, setSnackbarMessage, snackbarSeverity, setSnackbarSeverity}}>
          {venueScheduleState && (
              <>
                {pageName == "day-schedules" && (
                    <DaySchedules
                        venueScheduleState={venueScheduleState}
                        dispatchVenueSchedule={dispatchVenueSchedule}
                    />
                )}
                {pageName == "day-schedule-generator" && (
                    <DayScheduleGenerator
                        venueScheduleState={venueScheduleState}
                        dispatchVenueSchedule={dispatchVenueSchedule}
                    />
                )}
                {pageName == "table-types" && (
                    <TableTypes venueData={thisVenue} thisVenueId={id} />
                )}
              </>
          )}
          <SnackbarTopCenter open={openSnackbar} setOpen={setOpenSnackbar} message={snackbarMessage} severity={snackbarSeverity} />
        </SnackbarContext.Provider>
      </VenueContext.Provider>
    </PageStructure>
  );
}
