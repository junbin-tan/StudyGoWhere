import ScheduleHelperFunctions from "../ScheduleHelperFunctions";
import TableTypeDayAvailabilityListing from "../TableTypeDayAvailabilityListing";
import EmptyInterval from "./EmptyInterval";
import TTDA_BookingsSideBar, {
  MemoizedTTDA_BookingsSideBar,
} from "./TTDA_BookingsSideBar";
import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TimeHeaderInterval from "./TimeHeaderInterval";
import DayScheduleClassSets from "./DayScheduleClassSets";
import ButtonClassSets from "../../../../utilities/ButtonClassSets";
import { Button } from "@mui/material";
import ConfirmModalV2 from "../../../CommonComponents/Modal/ConfirmModalV2";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { useParams } from "react-router-dom";
import FetchOwnerInfoAPI from "../../../../FunctionsAndContexts/FetchOwnerInfoAPI";
import { LoginTokenContext } from "../../../../FunctionsAndContexts/LoginTokenContext";
import { VenueContext } from "./helpers/VenueContext";
import DayScheduleAPI from "./helpers/DayScheduleAPI";
import SnackbarTopCenter from "../../../CommonComponents/Snackbar/SnackbarTopCenter";
import FieldLabel from "../../../CommonComponents/Form/FieldLabel";
import { FaPlus } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
// this daySchedule prop can be an actual DaySchedule or a DayScheduleTemplate
// need to have options to show bookings thats already made for the day also
export default function DaySchedule({
  daySchedule,
  isTemplate = false,
  dispatch,
  dayjsDate,
}) {
  const leftSideWidth = "w-1/4 ";

  const [bookingsSideBarState, setBookingsSideBarState] = useState({
    isOpen: false,
    isTransitioning: false,
    tableTypeDayAvailability: undefined,
  });

  const [selectedBooking, setSelectedBooking] = useState(undefined);

  const [newTTDAModalOpen, setNewTTDAModalOpen] = useState(false);
  const [newTTDATableType, setNewTTDATableType] = useState(undefined);
  // set newTTDATableType to an object so it doesnt rerender everytime the value is changedd

  const { id } = useParams();
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { thisVenue, setThisVenue } = useContext(VenueContext);
  // useEffect(() => {
  //     FetchOwnerInfoAPI.getVenueById(encodedToken, id).then((venue) => setVenue(venue));
  // }, [])

  const [newScheduleSnackbarOpen, setNewScheduleSnackbarOpen] = useState(false);
  const [newScheduleSnackbarMessage, setNewScheduleSnackbarMessage] =
    useState("");
  const [newScheduleSnackbarSeverity, setNewScheduleSnackbarSeverity] =
    useState("success");

  function DayScheduleContainer({ children, ...rest }) {
    return (
      <div
        {...rest}
        style={{
          border: "var(--gray-70) solid 1px",
          minHeight: "640px",
        }}
      >
        {" "}
        {children}{" "}
      </div>
    );
  }
  // for now the 30 min thing is unmodifiable
  // just a reminder if we want to make interval customisable
  function DayScheduleTimeHeaders({ children, ...rest }) {
    return (
      <div
        id={"DayScheduleTimeHeaders"}
        {...rest}
        className="h-10 flex flex-row"
      >
        <div
          id={"AvailabilityTitleHeader"}
          className={
            "shrink-0 " +
            leftSideWidth +
            "px-3 py-2 font-bold border border-gray-300 "
          }
        >
          Table Type Availabilities
        </div>

        <div
          id={"TimeHeaders"}
          className={"flex-auto grid grid-cols-48 overflow-visible"}
        >
          {Array(48)
            .fill(null)
            .map((_, index) => {
              return (
                <TimeHeaderInterval
                  key={index}
                  index={index}
                  colorOne={DayScheduleClassSets.timeHeader.colorOne}
                  colorTwo={DayScheduleClassSets.timeHeader.colorTwo}
                >
                  {index % 4 == 0
                    ? ScheduleHelperFunctions.indexToTimeString(index)
                    : ""}
                </TimeHeaderInterval>
              );
            })}
        </div>
      </div>
    );
  }

  const handleNewTTDAConfirm = () => {
    console.log("confirm button clicked");
    if (isTemplate) {
      dispatch({
        type: "CREATE_NEW_TTDA",
        payload: {
          tableType: newTTDATableType,
          dayScheduleTemplateId: daySchedule.id,
          isTemplate: isTemplate,
        },
      });
    } else {
      dispatch({
        type: "CREATE_NEW_TTDA",
        payload: {
          tableType: newTTDATableType,
          dayScheduleId: daySchedule.id,
          isTemplate: isTemplate,
        },
      });
    }
    setNewTTDAModalOpen(false);
  };

  const handleNewDaySchedule = () => {
    DayScheduleAPI.createNewDaySchedule(
      encodedToken,
      id,
      dayjsDate.format("YYYY-MM-DD")
    )
      .then((response) => {
        console.log("response from create new day schedule", response);
        dispatch({
          type: "UPDATE_STATE_WITH_RESPONSE_DATA_(DS_OR_DST)",
          payload: { daySchedule: response.data, isTemplate: isTemplate },
        });
        setNewScheduleSnackbarOpen(true);
        setNewScheduleSnackbarSeverity("success");
        setNewScheduleSnackbarMessage("New day schedule created successfully!");
      })
      .catch((error) => {
        console.log("error from create new day schedule", error);
        setNewScheduleSnackbarOpen(true);
        setNewScheduleSnackbarSeverity("error");
        setNewScheduleSnackbarMessage("Could not create new day schedule!");
      });
  };

  return (
    <DayScheduleContainer className={"relative flex flex-col"}>
      <DayScheduleTimeHeaders />

      {daySchedule ? (
        <>
          <div
            id="TableTypeDayAvailabilityListings"
            style={{ background: "lightgrey" }}
          >
            {daySchedule.tableTypeDayAvailabilities.map(
              (tableTypeDayAvailability) => {
                return (
                  <TableTypeDayAvailabilityListing
                    key={tableTypeDayAvailability.id}
                    daySchedule={daySchedule}
                    tableTypeDayAvailability={tableTypeDayAvailability}
                    setBookingsSideBarState={setBookingsSideBarState}
                    selectedBooking={selectedBooking}
                    isTemplate={isTemplate}
                    dispatch={dispatch}
                  />
                );
              }
            )}
          </div>

          <div
            id="EmptySpaceFiller"
            className="flex flex-row bg-amber-300 flex-auto"
          >
            <div
              id={"EmptyLeftSide"}
              className={leftSideWidth + " flex flex-row"}
            >
              <Button
                variant={"contained"}
                className={ButtonClassSets.primary + " text-sm flex flex-auto"}
                onClick={() => {
                  setNewTTDAModalOpen(true);
                }}
              >
                <MdEventAvailable className={"text-3xl"} />
                Create new Table Type Day Availability
              </Button>
            </div>
            <div
              id={"EmptyRightSide"}
              className={"grid grid-cols-48 flex-auto bg-amber-500"}
            >
              {Array(48)
                .fill(null)
                .map((_, index) => {
                  return <EmptyInterval key={index} index={index} />;
                })}
            </div>
          </div>

          <AnimatePresence>
            {!(isTemplate || !bookingsSideBarState.isOpen) && (
              <TTDA_BookingsSideBar
                // bookingsSideBarTTDA={bookingsSideBarState.tableTypeDayAvailability}
                bookingsSideBarState={bookingsSideBarState}
                setBookingsSideBarState={setBookingsSideBarState}
                setSelectedBooking={setSelectedBooking}
              />
            )}
          </AnimatePresence>

          <ConfirmModalV2
            open={newTTDAModalOpen}
            onClose={() => setNewTTDAModalOpen(false)}
            confirmButtonCallbackFn={handleNewTTDAConfirm}
            renderConfirmButton={thisVenue && thisVenue.tableTypes.length > 0}
            backButtonCallbackFn={() => setNewTTDAModalOpen(false)}
            headerText={"Create new Table Type Day Availability"}
          >
            {thisVenue && thisVenue.tableTypes.length > 0 ? (
              <Select
                value={newTTDATableType}
                onChange={(event) => setNewTTDATableType(event.target.value)}
                className="w-full"
                displayEmpty
                label="Select Table Type"
              >
                <MenuItem value="" disabled>
                  Select Table Type {/* Placeholder message */}
                </MenuItem>
                {thisVenue &&
                  thisVenue.tableTypes
                    .filter((tableType) => !tableType.deleted)
                    .map((tableType) => {
                      return (
                        <MenuItem key={tableType.id} value={tableType}>
                          {tableType.name}
                        </MenuItem>
                      );
                    })}
              </Select>
            ) : (
              <p>No table types available! Please create a new table type.</p>
            )}

            {/*<select value={newTTDATableType} onChange={(e) => setNewTTDATableType(e.target.value)}>*/}
            {/*    <option value="someOption">Some option</option>*/}
            {/*    <option value="otherOption">Other option</option>*/}
            {/*</select>*/}
          </ConfirmModalV2>
        </>
      ) : (
        // == PART SHOWN WHEN NO DAY SCHEDULE / TEMPLATE IS SELECTED
        <div className={"flex flex-col flex-auto justify-center items-center "}>
          {!isTemplate ? (
            <>
              <p>No day schedule selected for this date!</p>
              <Button
                variant="contained"
                className={ButtonClassSets.primary}
                onClick={handleNewDaySchedule}
              >
                Create new day schedule
              </Button>
            </>
          ) : (
            <p>No day schedule template selected!</p>
          )}
        </div>
      )}
      {/*zIndex here is 50 because the zIndex of the time headers range from 47 to 0*/}

      {/*<button className={ButtonClassSets.primary}> HELLO test</button>*/}
      <SnackbarTopCenter
        id={"CreateNewDayScheduleSnackbar"}
        open={newScheduleSnackbarOpen}
        setOpen={setNewScheduleSnackbarOpen}
        message={newScheduleSnackbarMessage}
        severity={newScheduleSnackbarSeverity}
      />
    </DayScheduleContainer>
  );
}
