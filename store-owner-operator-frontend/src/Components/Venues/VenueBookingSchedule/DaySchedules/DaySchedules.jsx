import BodyCard from "../../../CommonComponents/Card/BodyCard";
import DaySchedule from "./DaySchedule";
import { useContext, useEffect, useState } from "react";
import { DatePicker, PickersDay } from "@mui/x-date-pickers";
import FieldLabel from "../../../CommonComponents/Form/FieldLabel";
import { Button } from "@mui/material";
import ButtonClassSets from "../../../../utilities/ButtonClassSets";
import FormControlLabelWrapper from "../../../CommonComponents/Form/FormControlLabelWrapper";
import DayScheduleAPI from "./helpers/DayScheduleAPI";
import { LoginTokenContext } from "../../../../FunctionsAndContexts/LoginTokenContext";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import SnackbarTopCenter from "../../../CommonComponents/Snackbar/SnackbarTopCenter";
import FieldInfo from "../../../CommonComponents/Form/FieldInfo";
import axios from "axios";
import { BACKEND_PREFIX } from "../../../../FunctionsAndContexts/serverPrefix";
import TextClassSets from "../../../../utilities/TextClassSets";

const publishStateColors = {
  published: "bg-green-300",
  unpublished: "bg-gray-300",
};

export default function DaySchedules({
  venueScheduleState,
  dispatchVenueSchedule,
}) {
  // useEffect(() => {
  //     // dispatchVenueSchedule({type: "SELECT_DAY_SCHEDULE", payload: venueScheduleState.dayScheduleGenerator.mon});
  // }, [])

  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { id } = useParams();

  const [daysjDateSelected, setDaysjDateSelected] = useState(
    venueScheduleState.selectedDaySchedule
      ? dayjs(venueScheduleState.selectedDaySchedule.date, "YYYY-MM-DD")
      : dayjs().startOf("day")
  );
  // Quick and dirty fix for showing "Today"'s day schedule when the component loads & there's no selectedDaySchedule
  useEffect(() => {
    if (venueScheduleState.selectedDaySchedule == undefined) {
      venueScheduleState.daySchedules.forEach((daySchedule) => {
        if (daySchedule.date === daysjDateSelected.format("YYYY-MM-DD")) {
          dispatchVenueSchedule({
            type: "SELECT_DAY_SCHEDULE",
            payload: daySchedule,
          });
        }
      });
    }
  });

  useEffect(() => {
    const newPublishedSet = new Set([...daysWithPublishedSchedules]);
    const newUnpublishedSet = new Set([...daysWithUnpublishedSchedules]);

    venueScheduleState.daySchedules.forEach((daySchedule) => {
      console.log("going thru dayschedule of date ", daySchedule.date);
      if (daySchedule.published) {
        console.log(
          "going thru and setting published for ds of date ",
          daySchedule.date
        );
        newPublishedSet.add(daySchedule.date);
        newUnpublishedSet.delete(daySchedule.date);
      } else {
        newUnpublishedSet.add(daySchedule.date);
        newPublishedSet.delete(daySchedule.date);
      }
    });

    setDaysWithPublishedSchedules(newPublishedSet);
    setDaysWithUnpublishedSchedules(newUnpublishedSet);
  }, [venueScheduleState.daySchedules]);

  const [daysWithPublishedSchedules, setDaysWithPublishedSchedules] = useState(
    new Set()
  );
  const [daysWithUnpublishedSchedules, setDaysWithUnpublishedSchedules] =
    useState(new Set());

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [bookingConflicts, setBookingConflicts] = useState([]);
  function DayScheduleActions() {
    const handleSaveDaySchedule = () => {
      console.log(
        "venueScheduleState.selectedDaySchedule",
        venueScheduleState.selectedDaySchedule
      );
      console.log("venueId", id);
      // dispatchVenueSchedule({type: "SAVE_DAY_SCHEDULE", payload: venueScheduleState.selectedDaySchedule});
      DayScheduleAPI.saveDaySchedule(
        encodedToken,
        venueScheduleState.selectedDaySchedule,
        id
      )
        .then((response) => {
          if (!response.data.published) return response;
          console.log("response from saveDaySchedule", response);
          const authorisationString = "Bearer " + encodedToken;
          return axios.post(
            `${BACKEND_PREFIX}/owner/publish-day-schedule`,
            null,
            {
              params: { dayScheduleId: response.data.id },
              headers: {
                Authorization: authorisationString,
              },
            }
          );
        })
        .then((response) => {
          dispatchVenueSchedule({
            type: "SAVE_DAY_SCHEDULE",
            payload: response.data,
          });
          setOpenSnackbar(true);
          setSnackbarMessage("Day Schedule saved successfully");
          setSnackbarSeverity("success");
        })
        .catch((error) => {
          console.log(error);
          setOpenSnackbar(true);
          setSnackbarMessage("There are conflicting bookings!");
          setSnackbarSeverity("error");
        });
    };

    return (
      <>
        <div className={"flex flex-row justify-end items-center gap-6"}>
          {venueScheduleState.selectedDaySchedule.published ? (
            <p>
              {" "}
              This venue is published. Students <b>can</b> see and book slots.
            </p>
          ) : (
            <p>
              {" "}
              This venue is not published. Students <b>cannot</b> see and book
              slots.
            </p>
          )}
          <FormControlLabelWrapper
            label={"Publish"}
            disabled={venueScheduleState.selectedDaySchedule.published}
            value={venueScheduleState.selectedDaySchedule.published}
            checked={venueScheduleState.selectedDaySchedule.published}
            handleOnClick={() =>
              dispatchVenueSchedule({
                type: "SAVE_DAY_SCHEDULE",
                payload: {
                  ...venueScheduleState.selectedDaySchedule,
                  published: !venueScheduleState.selectedDaySchedule.published,
                },
              })
            }
          />
          {/*<button className={"btn btn-primary"}>Save as Template</button> */}
          <Button
            className={ButtonClassSets.primary}
            onClick={handleSaveDaySchedule}
          >
            Save
          </Button>
        </div>
      </>
    );
  }
  const DayScheduleExistsDay = ({ day, ...rest }) => {
    // THIS IS FOR THE DATEPICKER

    // actually we should pass in the daysWithPublishedSchedules, etc. as slotProps for it to be cleaner and more decoupled
    // but we aren't reusing this anywhere else so its okey dokey for now

    let appliedClassName = "";
    const formattedDayString = day.format("YYYY-MM-DD");
    if (daysWithPublishedSchedules.has(formattedDayString)) {
      appliedClassName = publishStateColors.published;
    } else if (daysWithUnpublishedSchedules.has(formattedDayString)) {
      appliedClassName = publishStateColors.unpublished;
    }

    // console.log("DAY IS ", day)
    // console.log("DAY IS TYPE", typeof(day))
    console.log("DAY FORMATTED IS: ", day.format("YYYY-MM-DD"));

    console.log(
      "list of days with published schedules",
      daysWithPublishedSchedules
    );
    console.log(
      "list of days with unpublished schedules",
      daysWithUnpublishedSchedules
    );
    return <PickersDay {...rest} day={day} className={appliedClassName} />;
  };

  const handleDatePickerChange = (dayjsDate) => {
    console.log("date selected (in dayjs)", dayjsDate);
    setDaysjDateSelected(dayjsDate);
    const formattedDate = dayjsDate.format("YYYY-MM-DD");
    const selectedDaySchedule = venueScheduleState.daySchedules.find(
      (daySchedule) => daySchedule.date === formattedDate
    );
    console.log("selectedDaySchedule is: ", selectedDaySchedule);
    dispatchVenueSchedule({
      type: "SELECT_DAY_SCHEDULE",
      payload: selectedDaySchedule,
    });
  };

  return (
    <BodyCard>
      <SnackbarTopCenter
        id={"SaveScheduleSnackbar"}
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      <div className="flex flex-col mb-5">
        <h2 className={TextClassSets.h2}>Day Schedules</h2>
        <FieldInfo>Manage the day schedules of your venue.</FieldInfo>
      </div>
      <div id={"DatePickerSection"} className={"flex flex-col mb-3"}>
        <FieldLabel>Select a date to view its day schedule:</FieldLabel>
        <div
          id={"DatePicker&PublishedInfo"}
          className={"flex flex-row items-center"}
        >
          <DatePicker
            onChange={handleDatePickerChange}
            value={daysjDateSelected}
            slots={{ day: DayScheduleExistsDay }}
            className={"max-w-xs"} // max-width-xs happens to match the MUI date pop-up size lol
          />
        </div>
      </div>

      <FieldInfo className="flex justify-end mb-1">
        T: No. of tables, B: Base Price (in $), H: Price per Half Hour (in $)
      </FieldInfo>

      <DaySchedule
        daySchedule={venueScheduleState.selectedDaySchedule}
        dispatch={dispatchVenueSchedule}
        dayjsDate={daysjDateSelected}
      />
      {venueScheduleState.selectedDaySchedule && <DayScheduleActions />}
    </BodyCard>
  );
}
