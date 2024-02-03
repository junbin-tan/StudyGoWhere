import ScheduleHelperFunctions from "./ScheduleHelperFunctions";
import EmptyInterval from "./DaySchedules/EmptyInterval";
import ScheduleHelperFunction from "./ScheduleHelperFunctions";
import AvailabilityPeriodInterval from "./DaySchedules/AvailabilityPeriodInterval";
import React, {useCallback, useContext, useEffect, useState} from "react";
import NewAvailabilityPeriodInterval from "./DaySchedules/NewAvailabilityPeriodInterval";
import AvailabilityPeriodClassSets from "./DaySchedules/AvailabilityPeriodClassSets";
import ConfirmModalV2 from "../../CommonComponents/Modal/ConfirmModalV2";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import FieldLabel from "../../CommonComponents/Form/FieldLabel";
import TextField from "@mui/material/TextField";
import FormControlLabelWrapper from "../../CommonComponents/Form/FormControlLabelWrapper";
import NewAvailabilityPeriodInfo from "./DaySchedules/helpers/NewAvailabilityPeriodInfo";
import { dayScheduleTemplatesReducer_ACTIONS as ACTIONS } from "./DaySchedules/helpers/DayScheduleTemplatesReducer";
import dayjs from "dayjs";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { v4 as uuidv4 } from "uuid";
import FieldInfo from "../../CommonComponents/Form/FieldInfo";
import ButtonClassSets from "../../../utilities/ButtonClassSets";
import Button from "@mui/material/Button";
import SelectedBookingInterval from "./DaySchedules/SelectedBookingInterval";
import SnackbarContext from "../../../FunctionsAndContexts/SnackbarContext";

export default function TableTypeDayAvailabilityListing({
  daySchedule,
  tableTypeDayAvailability,
  leftSideWidth = "w-1/4 ",
  highlightedIntervals = [],
  setBookingsSideBarState,
  selectedBooking = undefined,
  isTemplate: isTemplate,
  dispatch,
  ...rest
}) {
  const tableType = tableTypeDayAvailability.tableType;

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } = useContext(SnackbarContext);

  const handleEmptyIntervalClick = useCallback((index) => {
    console.log("handleEmptyIntervalClick", index);
    if (!availabilityPeriodCreationFlag) {
      setNewAvailabilityPeriodStartCol(index + 1); // For CSS grid, index starts at 1, so everything is offset by 1
      setNewAvailabilityPeriodEndCol(index + 2); // column-start includes the slot, column-end does not (like range(0,10) in python)
      setAvailabilityPeriodCreationFlag(true);
      return;
    } else {
      if (index < newAvailabilityPeriodStartCol - 1) {
        setAvailabilityPeriodCreationFlag(false);
        setNewAvailabilityPeriodStartCol(undefined);
        setNewAvailabilityPeriodEndCol(undefined);
        return;
      }
      if (detectOverlappingNewPeriodInterval()) {
        setAvailabilityPeriodCreationFlag(false);
        setNewAvailabilityPeriodStartCol(undefined);
        setNewAvailabilityPeriodEndCol(undefined);
        return;
      }
      console.log("setting new availability period end to", index + 2);

      setNewAvailabilityPeriodEndCol(index + 2); // last index is 47, but maximum grid-end value is 49 (means the content includes the 48th grid)
      setAvailabilityPeriodCreationFlag(false);
      setCreateNewAvailabilityPeriodModalOpen(true);
      return;
    }

    // actually since the values are changed by the "hover", don't need to set it here
  });

  const handleEmptyIntervalHover = useCallback((index) => {
    if (availabilityPeriodCreationFlag) {
      if (index < newAvailabilityPeriodStartCol - 1) {
        // same logic as above handleEmptyIntervalClick
        return;
      }
      console.log("setting new availability period end to", index + 2);
      setNewAvailabilityPeriodEndCol(index + 2); // last index is 47, but maximum grid-end value is 49 (means the content includes the 48th grid)
    }
  });

  const [availabilityPeriodCreationFlag, setAvailabilityPeriodCreationFlag] =
    useState(false);
  const [newAvailabilityPeriodStartCol, setNewAvailabilityPeriodStartCol] =
    useState(undefined);
  const [newAvailabilityPeriodEndCol, setNewAvailabilityPeriodEndCol] =
    useState(undefined);

  // actually shouldnt use the objects themselves, should make shallow copy of the default objects (with ...spread)
  // however since we are (hopefully) never modifying it directly, it shouldn't matter
  const [newAvailabilityPeriodForm, setNewAvailabilityPeriodForm] = useState(
    NewAvailabilityPeriodInfo.defaultFormConstructor(tableTypeDayAvailability.tableType.basePrice, tableTypeDayAvailability.tableType.pricePerHalfHour)
  );
  const [newAvailabilityPeriodFormErrors, setNewAvailabilityPeriodFormErrors] =
    useState(NewAvailabilityPeriodInfo.defaultFormErrorsObject);

  const handleNewAPFormChange = (event) => {
    let { name, value } = event.target;
    if (name == "numAvailable") {
      value = Number(value);
    }
    if (name == "basePrice" || name == "pricePerHalfHour") {
      value = Number(value) * 100;
    }
    setNewAvailabilityPeriodForm({
      ...newAvailabilityPeriodForm,
      [name]: value,
    });
    console.log("newAvailabilityPeriodForm", newAvailabilityPeriodForm);
  };

  useEffect(() => {
    if (
      newAvailabilityPeriodStartCol !== undefined &&
      newAvailabilityPeriodEndCol !== undefined
    ) {
      setNewAvailabilityPeriodForm({
        ...newAvailabilityPeriodForm,
        fromTime: ScheduleHelperFunctions.indexToDayjsObject(
          newAvailabilityPeriodStartCol - 1
        ).format("HH:mm"),
        toTime: ScheduleHelperFunctions.indexToDayjsObject(
          newAvailabilityPeriodEndCol - 2
        ).format("HH:mm"), // need to reconvert grid-col to index
      });
    }
  }, [newAvailabilityPeriodStartCol, newAvailabilityPeriodEndCol]);

  const [
    createNewAvailabilityPeriodModalOpen,
    setCreateNewAvailabilityPeriodModalOpen,
  ] = useState(false);

  const availabilityPeriods = tableTypeDayAvailability.availabilityPeriods;
  const availabilityPeriodIntervals = availabilityPeriods.map(
    (availabilityPeriod) => {
      return {
        id: availabilityPeriod.id,
        numAvailable: availabilityPeriod.numAvailable,
        overrideDefaultPrice: availabilityPeriod.overrideDefaultPrice,
        basePrice: availabilityPeriod.basePrice,
        pricePerHalfHour: availabilityPeriod.pricePerHalfHour,
        fromTime: availabilityPeriod.fromTime,
        toTime: availabilityPeriod.toTime,
        fromColumn:
          ScheduleHelperFunctions.timeToIndex(availabilityPeriod.fromTime) + 1, // css grid is 1-based
        toColumn:
          ScheduleHelperFunctions.timeToIndex(availabilityPeriod.toTime) + 2, // column-start includes the slot, column-end does not (like range(0,10) in python)
        length: ScheduleHelperFunction.timesToIntervalLength(
          availabilityPeriod.fromTime,
          availabilityPeriod.toTime
        ),
      };
    }
  );

  const availabilityPeriodInaccessibleColumns =
    availabilityPeriodIntervals.flatMap((interval) => {
      return Array(interval.length)
        .fill(null)
        .map((_, index) => {
          return interval.fromColumn + index;
        });
    });

  const LeftSideDescription = () => {

    const [isConfirmTTDADeleteModalOpen, setIsConfirmTTDADeleteModalOpen] = useState(false);
    const handleDeleteTTDA = () => {
      dispatch({
        type: "DELETE_TTDA",
        payload: {
          tableTypeDayAvailabilityId: tableTypeDayAvailability.id,
          isTemplate: isTemplate,
        },
      });
      setIsConfirmTTDADeleteModalOpen(false);
      // setOpenSnackbar(true);
      // setSnackbarSeverity("success");
      // setSnackbarMessage("Successfully deleted Table Type Day Availability");
    }

    return (
        <div
            className={"shrink-0 " + leftSideWidth}
        >
          <div className="button flex flex-col px-3 py-3 gap-1 border border-red-300 bg-red-50 hover:bg-red-200 duration-300 ease-in">
            <div className="tableInfo ">
              <p className="font-semibold">
                {tableType.name}
                {": "}
                {!isTemplate && (
                    <span>{tableTypeDayAvailability.bookings.length} bookings</span>
                )}
              </p>
              <FieldInfo className="">{tableType.description}</FieldInfo>
              <b><FieldInfo className="">Seats: {tableType.seats}</FieldInfo></b>
              <div className={"flex flex-row justify-between gap-2"}>
                <b><FieldInfo className="">Base Price: ${tableType.basePrice / 100}</FieldInfo></b>
                <b><FieldInfo className="">Price / 0.5hr: ${tableType.pricePerHalfHour / 100}</FieldInfo></b>
              </div>
            </div>

            <div className="flex flex-row gap-2 justify-between">
              <button
                  className={ButtonClassSets.bookingTypeButtonDanger}
                  onClick={() => setIsConfirmTTDADeleteModalOpen(true)}
              >
                {" "}
                delete TTDA
              </button>
              {!isTemplate &&
                  <button
                      onClick={() => {
                        setBookingsSideBarState({
                          isOpen: true,
                          tableTypeDayAvailability: tableTypeDayAvailability,
                        });
                      }}
                      className={ButtonClassSets.bookingTypeButton}
                  >
                    {" "}
                    view bookings
                  </button>
              }
            </div>
          </div>
          <ConfirmModalV2 open={isConfirmTTDADeleteModalOpen}
                          onClose={() => setIsConfirmTTDADeleteModalOpen(false)}
                          confirmButtonCallbackFn={handleDeleteTTDA}
                          backButtonCallbackFn={() => setIsConfirmTTDADeleteModalOpen(false)}
                          headerText={"Confirm TTDA Deletion?"}>
            <p className="text-center font-bold"> Are you sure you want to delete this Table Type Day Availability? </p>
            <p>This can be undone by exiting the page without saving the day schedule.</p>
          </ConfirmModalV2>
        </div>
    );
  };

  // const HighlightedTimeInterval = () => {
  //     // overlay another invisible grid on top, then put 1 interval div into that grid
  //     console.log("selectedBookingState", selectedBooking)
  //     if (selectedBooking) {
  //         if (tableTypeDayAvailability.bookings.find(booking => booking.billableId === selectedBooking.billableId)) {
  //             const start = ScheduleHelperFunctions.timeToIndex(selectedBooking.fromDateTime);
  //             const end = ScheduleHelperFunctions.timeToIndex(selectedBooking.toDateTime);
  //
  //             return <div className={"absolute w-full grid grid-cols-48 h-full z-50 opacity-40"}>
  //                 {/* THIS IS THE HIGHLIGHTED RECTANGLE. Maybe should integrate with EmptyBooking?*/}
  //                 <div className={`bg-yellow-400`}
  //                      style={{gridColumnStart: `${start}`, gridColumnEnd: `${end}`}}
  //                 >
  //                 </div>
  //             </div>
  //         }
  //     }
  //
  //     return null;
  // }

  // this renders the whole button, instead of rendering X number of individual segments
  const TimeUnitsLayer = () => {
    return (
        <div className={"absolute w-full grid grid-cols-48 h-full z-10"}>
          {Array(48)
              .fill(null)
              .map((_, index) => {
                return (
                    <EmptyInterval
                        key={index}
                        index={index}
                        handleClick={handleEmptyIntervalClick}
                        handleHover={handleEmptyIntervalHover}
                        className=" border-b border-gray-500 hover:bg-yellow-200 hover:bg-opacity-30 ease-in"
                    ></EmptyInterval>
                );
              })}
        </div>
    );
  };

  const AvailabilityPeriodLayer = () => {
    return (
        <div
            className={
              "absolute w-full grid grid-cols-48 h-full z-30 pointer-events-none "
            }
        >
          {availabilityPeriodIntervals.map((currentPeriodInterval, index) => {
            return (
                <AvailabilityPeriodInterval
                    key={currentPeriodInterval.id ? currentPeriodInterval.id : index}
                    availabilityPeriodIntervalData={currentPeriodInterval}
                    intervalStartGrid={currentPeriodInterval.fromColumn}
                    intervalEndGrid={currentPeriodInterval.toColumn}
                    tableTypeDayAvailabilityId={tableTypeDayAvailability.id}
                    dispatch={dispatch}
                    isTemplate={isTemplate}
                />
            );
          })}
        </div>
    );
  };

  function detectOverlappingNewPeriodInterval() {
    const newPeriodOccupiesSlots = [];
    for (
        let i = newAvailabilityPeriodStartCol;
        i < newAvailabilityPeriodEndCol;
        i++
    ) {
      newPeriodOccupiesSlots.push(i);
    }

    return newPeriodOccupiesSlots.some((columnSlot) =>
        availabilityPeriodInaccessibleColumns.includes(columnSlot)
    );
  }

  const NewAvailabilityPeriodLayer = () => {
    // for the creation of a new availibilityperiod

    const background = detectOverlappingNewPeriodInterval()
        ? AvailabilityPeriodClassSets.newPeriodCreationErrorBackground
        : availabilityPeriodCreationFlag
            ? AvailabilityPeriodClassSets.newPeriodCreationOKBackground
            : "";

    return (
        <div
            className={
                "absolute w-full grid grid-cols-48 h-full z-20 pointer-events-none" +
                background
            }
        >
          {(availabilityPeriodCreationFlag ||
              newAvailabilityPeriodStartCol !== undefined) && (
              <NewAvailabilityPeriodInterval
                  intervalStartGrid={newAvailabilityPeriodStartCol}
                  intervalEndGrid={newAvailabilityPeriodEndCol}
              />
          )}
        </div>
    );
  };
  const SelectedBookingLayer = () => {
    // for highlighting the time period of a booking when user hovers over it in the BookingSideBar

    if (!selectedBooking) {
      return null;
    } else if (
        !tableTypeDayAvailability.bookings.find(
            (booking) => booking.billableId === selectedBooking.billableId
        )
    ) {
      return null;
    }

    const bookingFromDateTime = selectedBooking.fromDateTime;
    const bookingToDateTime = selectedBooking.toDateTime;

    const bookingFromColumn =
        ScheduleHelperFunctions.timeToIndex(bookingFromDateTime) + 1; // this should work for LocalDateTime objects too
    const bookingToColumn =
        ScheduleHelperFunctions.timeToIndex(bookingToDateTime) + 2;
    // ok, technically I think its better practice to pass the booking into the actual Interval component, and then the Interval component
    // does the calculation. but it's a bit too late for that, and i suppose its better to be consistent

    // take note of z-value, may have to change later if its being covered by sth else
    return (
        <div
            className={
              "absolute w-full grid grid-cols-48 h-full z-50 pointer-events-none "
            }
        >
          <SelectedBookingInterval
              intervalStartGrid={bookingFromColumn}
              intervalEndGrid={bookingToColumn}
          />
        </div>
    );
  };

  const CreationModalProps = {
    handleClose: () => {
      setCreateNewAvailabilityPeriodModalOpen(false);
      setNewAvailabilityPeriodForm(NewAvailabilityPeriodInfo.defaultFormConstructor(tableTypeDayAvailability.tableType.basePrice, tableTypeDayAvailability.tableType.pricePerHalfHour));

      setNewAvailabilityPeriodFormErrors(
          NewAvailabilityPeriodInfo.defaultFormErrorsObject
      );
      setNewAvailabilityPeriodStartCol(undefined);
      setNewAvailabilityPeriodEndCol(undefined);
    },
    handleConfirm: () => {
      // do some validation here... if any errors found then show some modal or some shit
      if (
          Object.keys(newAvailabilityPeriodFormErrors).some(
              (key) => newAvailabilityPeriodFormErrors[key] === true
          )
      ) {
        console.log("Error found! do some snackbar stuff pls");
        setOpenSnackbar(true);
        setSnackbarMessage("Error found in form! Ensure the fields for creating a new availability period are valid.")
        setSnackbarSeverity("error")
        return;
      }

      setNewAvailabilityPeriodForm({
        ...newAvailabilityPeriodForm,
        id: "TEMP" + uuidv4(),
      });

      console.log(
          "calling dispatch for creating period for daySchedule/dayScheduleTemplate", newAvailabilityPeriodForm
      );
      dispatch({
        type: "ADD_AVAILABILITY_PERIOD_TO_TABLE_TYPE_DAY_AVAILABILITY",
        payload: {
          tableTypeDayAvailabilityId: tableTypeDayAvailability.id,
          availabilityPeriod: newAvailabilityPeriodForm,
          isTemplate: isTemplate,
        },
      });

      setCreateNewAvailabilityPeriodModalOpen(false);
      setNewAvailabilityPeriodForm(NewAvailabilityPeriodInfo.defaultFormConstructor);
      setNewAvailabilityPeriodFormErrors(
          NewAvailabilityPeriodInfo.defaultFormErrorsObject
      );
      setNewAvailabilityPeriodStartCol(undefined);
      setNewAvailabilityPeriodEndCol(undefined);
      setOpenSnackbar(true);
      setSnackbarSeverity("success");
      setSnackbarMessage("Successfully created new availability period");
    },
  };
  const RightSideTimeIntervals = () => {
    // i removed grid and grid-cols-48 from this, since we're using layers now
    return (
        <div className={"relative flex-auto "}>
          <TimeUnitsLayer />
          <AvailabilityPeriodLayer />
          <NewAvailabilityPeriodLayer />
          <SelectedBookingLayer />
        </div>
    );
  };

  return (
      <div className={"flex flex-row"} {...rest}>
        <LeftSideDescription />
        <RightSideTimeIntervals />

        <ConfirmModalV2
            open={createNewAvailabilityPeriodModalOpen}
            onClose={CreationModalProps.handleClose}
            backButtonCallbackFn={CreationModalProps.handleClose}
            confirmButtonCallbackFn={CreationModalProps.handleConfirm}
            headerText={"Create new availability period"}
        >
          {/*MAKE THE TIMES UNCHANGEABLE FOR NOW... LATER WE CAN ADD THE ABILITY TO CHANGE...?*/}
          <div className={"flex flex-row"}>
            <div>
              <FieldLabel>From: </FieldLabel>
              <TimePicker
                  disabled
                  minutesStep={30}
                  value={dayjs(`1970-01-01 ${newAvailabilityPeriodForm.fromTime}`)} // converting date to dayjs obj
                  onChange={() => console.log(newAvailabilityPeriodForm.fromTime)}
              />
            </div>
            <div>
              <FieldLabel>To: </FieldLabel>
              <TimePicker
                  disabled
                  minutesStep={30}
                  value={dayjs(`1970-01-01 ${newAvailabilityPeriodForm.toTime}`)}
                  onChange={() => console.log(newAvailabilityPeriodForm.toTime)}
              />
            </div>
          </div>

          <div className={"flex flex-col"}>
            <FieldLabel htmlFor="numAvailable">
              Number of tables available:{" "}
            </FieldLabel>
            <TextField
                id="numAvailable"
                name={"numAvailable"}
                type={"number"}
                value={newAvailabilityPeriodForm.numAvailable}
                inputProps={{ min: 0 }}
                onChange={handleNewAPFormChange}
                error={newAvailabilityPeriodFormErrors.numAvailable}
                helperText={
                    newAvailabilityPeriodFormErrors.numAvailable &&
                    "Please input a valid number of tables."
                }
            />
          </div>

          <div className={""}>
            {/*<FieldLabel htmlFor="overrideDefaultPrice">Override default price?</FieldLabel>*/}
            <FormControlLabelWrapper
                value={"overrideDefaultPrice"}
                label={"Override Table's Default Price?"}
                checked={newAvailabilityPeriodForm.overrideDefaultPrice}
                handleOnClick={() =>
                    setNewAvailabilityPeriodForm({
                      ...newAvailabilityPeriodForm,
                      overrideDefaultPrice:
                          !newAvailabilityPeriodForm.overrideDefaultPrice,
                    })
                }
            ></FormControlLabelWrapper>
          </div>

          <div className={"flex flex-col"}>
            <FieldLabel htmlFor="basePrice">Base Price: </FieldLabel>
            <TextField
                id="basePrice"
                name="basePrice"
                type={"number"}
                value={newAvailabilityPeriodForm.basePrice / 100}
                onChange={handleNewAPFormChange}
                inputProps={{ min: 0 }}
                disabled={!newAvailabilityPeriodForm.overrideDefaultPrice}
                error={newAvailabilityPeriodFormErrors.basePrice}
                helperText={
                    newAvailabilityPeriodFormErrors.basePrice &&
                    "Please input a valid price."
                }
            />

            {/*<Select*/}
            {/*    value={newAvailabilityPeriodForm.basePrice}*/}
            {/*    onChange={(event) => setNewAvailabilityPeriodForm({...newAvailabilityPeriodForm, basePrice: event.target.value})}*/}
            {/*>*/}
            {/*    <MenuItem value={10}>Ten</MenuItem>*/}
            {/*    <MenuItem value={20}>Twenty</MenuItem>*/}
            {/*    <MenuItem value={30}>Thirty</MenuItem>*/}
            {/*</Select>*/}
          </div>

          <div className="flex flex-col">
            <FieldLabel htmlFor="pricePerHalfHour">
              Price Per Half Hour:
            </FieldLabel>
            <TextField
                id="pricePerHalfHour"
                name="pricePerHalfHour"
                type={"number"}
                inputProps={{ min: 0 }}
                value={newAvailabilityPeriodForm.pricePerHalfHour / 100}
                onChange={handleNewAPFormChange}
                disabled={!newAvailabilityPeriodForm.overrideDefaultPrice}
                error={newAvailabilityPeriodFormErrors.pricePerHalfHour}
                helperText={
                    newAvailabilityPeriodFormErrors.pricePerHalfHour &&
                    "Please input a valid price."
                }
            />
          </div>
        </ConfirmModalV2>
      </div>
  );
}
