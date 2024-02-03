import { useContext, useState } from "react";
import { LoginTokenContext } from "../../../../FunctionsAndContexts/LoginTokenContext";
import FieldLabel from "../../../CommonComponents/Form/FieldLabel";
import TextField from "@mui/material/TextField";
import FormControlLabelWrapper from "../../../CommonComponents/Form/FormControlLabelWrapper";
import FieldInfo from "../../../CommonComponents/Form/FieldInfo";
import { Button } from "@mui/material";
import ButtonClassSets from "../../../../utilities/ButtonClassSets";
import DayScheduleAPI from "../DaySchedules/helpers/DayScheduleAPI";
import SnackbarTopCenter from "../../../CommonComponents/Snackbar/SnackbarTopCenter";
import ContentCard_PadS from "../../../CommonComponents/Card/ContentCard_PadS";
import DayOfWeekSelectorBar from "./DayOfWeekSelectorBar";
import DayOfWeekReassignBar from "./DayOfWeekReassignBar";

export default function DayScheduleGeneratorSettings({
  venueScheduleState,
  dispatchVenueSchedule,
}) {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [assignMode, setAssignMode] = useState(false);

  return (
    <ContentCard_PadS className={"flex flex-col gap-4"}>
      <div
        id={"GeneratorBasicProps"}
        className={"flex flex-row gap-4 items-center justify-between"}
      >
        <div id={"daysInAdvanceSetting"} className={"flex flex-col gap-2"}>
          <FieldLabel>Days in advance</FieldLabel>
          <TextField
            type={"number"}
            InputProps={{ inputProps: { min: 1, max: 365 } }}
            value={venueScheduleState.dayScheduleGenerator.daysInAdvance}
            onChange={(e) =>
              dispatchVenueSchedule({
                type: "SAVE_DAY_SCHEDULE_GENERATOR",
                payload: {
                  ...venueScheduleState.dayScheduleGenerator,
                  daysInAdvance: e.target.value,
                },
              })
            }
            // onChange={e => console.log(e)}
          />
        </div>
        <div id={"enabledSetting"} className={"flex flex-col "}>
          {/* because this is stupidly custom-defined by me, there's no e.target.value to use, so have to manually set ourselves*/}
          <FormControlLabelWrapper
            label={"Enabled"}
            value={venueScheduleState.dayScheduleGenerator.enabled}
            checked={venueScheduleState.dayScheduleGenerator.enabled}
            handleOnClick={() =>
              dispatchVenueSchedule({
                type: "SAVE_DAY_SCHEDULE_GENERATOR",
                payload: {
                  ...venueScheduleState.dayScheduleGenerator,
                  enabled: !venueScheduleState.dayScheduleGenerator.enabled,
                },
              })
            }
          />
          <FieldInfo>
            This will enable/disable your generator. <br />
            When enabled, it will generate and publish the day schedules every
            day at 12AM.
          </FieldInfo>
        </div>
        <div id={"saveSettings"}>
          <Button
            variant={"contained"}
            className={ButtonClassSets.primary}
            onClick={
              () =>
                DayScheduleAPI.saveDayScheduleGenerator(
                  encodedToken,
                  venueScheduleState.dayScheduleGenerator
                )
                  .then((res) => {
                    console.log(
                      "successful response from server on saving generator",
                      res
                    );
                    dispatchVenueSchedule({
                      type: "SAVE_DAY_SCHEDULE_GENERATOR",
                      payload: res.data,
                    });

                    setAssignMode(false);

                    setOpenSnackbar(true);
                    setSnackbarSeverity("success");
                    setSnackbarMessage("Successfully saved generator settings");
                  })
                  .catch((err) => {
                    console.log(
                      "error response from server on saving generator",
                      err
                    );
                    setOpenSnackbar(true);
                    setSnackbarSeverity("error");
                    setSnackbarMessage("Error saving generator settings");
                  }) // can do some snackbar shit here
            }
          >
            Save Generator Settings
          </Button>
        </div>
      </div>
      {/* == End of basic props div == */}
      <SnackbarTopCenter
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />

      {/* == Start of day of week assignment props div == */}
      <div id={"GeneratorDayOfWeekAssignments"} className={"flex flex-col"}>
        <FieldLabel>Select assigned day schedule templates:</FieldLabel>
        {!assignMode ? (
          <DayOfWeekSelectorBar
            venueScheduleState={venueScheduleState}
            dispatchVenueSchedule={dispatchVenueSchedule}
          />
        ) : (
          <DayOfWeekReassignBar
            venueScheduleState={venueScheduleState}
            dispatchVenueSchedule={dispatchVenueSchedule}
          />
        )}

        <Button
          variant={"contained"}
          className={
            !venueScheduleState.selectedTemplate
              ? ButtonClassSets.disabled2
              : assignMode
              ? ButtonClassSets.primary2
              : ButtonClassSets.secondary2
          }
          disabled={!venueScheduleState.selectedTemplate}
          onClick={() => setAssignMode(!assignMode)}
        >
          Assign currently selected schedule templates to day of week...
        </Button>
      </div>
    </ContentCard_PadS>
  );
}
