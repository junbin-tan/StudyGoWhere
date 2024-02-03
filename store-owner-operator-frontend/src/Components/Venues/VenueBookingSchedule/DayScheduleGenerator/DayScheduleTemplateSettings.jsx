import { useContext, useState } from "react";
import { LoginTokenContext } from "../../../../FunctionsAndContexts/LoginTokenContext";
import { useParams } from "react-router-dom";
import FieldLabel from "../../../CommonComponents/Form/FieldLabel";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import ButtonClassSets from "../../../../utilities/ButtonClassSets";
import DayScheduleAPI from "../DaySchedules/helpers/DayScheduleAPI";
import SnackbarTopCenter from "../../../CommonComponents/Snackbar/SnackbarTopCenter";

export default function DayScheduleTemplateSettings({
  venueScheduleState,
  dispatchVenueSchedule,
}) {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { id } = useParams(); // this is venueId from the address params
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  return (
    <div
      id={"DayScheduleTemplateSettings"}
      className={"flex flex-row gap-4 py-5 items-center justify-between"}
    >
      <div id={"templateNameDiv"} className={"flex flex-col gap-2"}>
        <FieldLabel htmlFor={"templateName"}>
          Day Schedule Template Name
        </FieldLabel>
        <TextField
          id={"templateName"}
          value={venueScheduleState.selectedTemplate.name}
          // modifying only the selected template, not finalising saves in the local context
          onChange={(e) =>
            dispatchVenueSchedule({
              type: "SELECT_DAY_SCHEDULE_TEMPLATE", //slightly misleading name but it works
              payload: {
                ...venueScheduleState.selectedTemplate,
                name: e.target.value,
              },
            })
          }
        />
      </div>
      <div className="flex flex-row gap-2">
        <div id={"deleteTemplate"}>
          <Button
            variant={"contained"}
            className={ButtonClassSets.danger}
            onClick={
              () =>
                DayScheduleAPI.deleteDayScheduleTemplate(
                  encodedToken,
                  venueScheduleState.selectedTemplate.id,
                  id
                )
                  .then((res) => {
                    console.log(
                      "successful response from server on deleting template",
                      res
                    );
                    // if this results in unexpected errors, we can use DELETE_DAY_SCHEDULE_TEMPLATE to do logic locally
                    dispatchVenueSchedule({
                      type: "SET_VENUE_SCHEDULE",
                      payload: res.data,
                    });
                    setOpenSnackbar(true);
                    setSnackbarSeverity("success");
                    setSnackbarMessage("Successfully deleted template!");
                  })
                  .catch((err) => {
                    console.log(
                      "error response from server on deleting template",
                      err
                    );
                    setOpenSnackbar(true);
                    setSnackbarSeverity("error");
                    setSnackbarMessage("Error deleting template!");
                  }) // can do some snackbar shit here
            }
          >
            Delete Day Schedule Template
          </Button>
        </div>
        <div id={"saveTemplate"}>
          <Button
            variant={"contained"}
            className={ButtonClassSets.primary}
            onClick={
              () =>
                DayScheduleAPI.saveDayScheduleTemplate(
                  encodedToken,
                  venueScheduleState.selectedTemplate,
                  id
                )
                  .then((res) => {
                    console.log(
                      "successful response from server on saving template",
                      res
                    );
                    dispatchVenueSchedule({
                      type: "SAVE_DAY_SCHEDULE_TEMPLATE",
                      payload: res.data,
                    });
                    setOpenSnackbar(true);
                    setSnackbarSeverity("success");
                    setSnackbarMessage("Successfully saved template!");
                  })
                  .catch((err) => {
                    console.log(
                      "error response from server on saving template",
                      err
                    );
                    setOpenSnackbar(true);
                    setSnackbarSeverity("error");
                    setSnackbarMessage("Error saving template!");
                  }) // can do some snackbar shit here
            }
          >
            Save Day Schedule Template Settings
          </Button>
        </div>
      </div>

      {/* == MIGHT ADD BACK WHEN I HAVE TIME (PROBABLY NOT LMAO)*/}
      {/*<div id="Save All" className={"flex flex-row justify-end"}>*/}
      {/*    <Button variant={"contained"} className={ButtonClassSets.primary}*/}
      {/*            onClick={() =>*/}
      {/*                DayScheduleAPI.saveAllDayScheduleTemplates(encodedToken, venueScheduleState.dayScheduleTemplates, id)*/}
      {/*                    .then((res) => {*/}
      {/*                        console.log("successful response from server on saving all templates", res)*/}
      {/*                        dispatchVenueSchedule({type: "SET_DAY_SCHEDULE_TEMPLATES", payload: res.data})*/}
      {/*                        setOpenSnackbar(true)*/}
      {/*                        setSnackbarSeverity("success")*/}
      {/*                        setSnackbarMessage("Successfully saved all templates!")*/}
      {/*                    })*/}
      {/*                    .catch((err) => {*/}
      {/*                        console.log("error response from server on saving all templates", err)*/}
      {/*                        setOpenSnackbar(true)*/}
      {/*                        setSnackbarSeverity("error")*/}
      {/*                        setSnackbarMessage("Error saving all templates!")*/}
      {/*                    })*/}
      {/*            }*/}
      {/*    >*/}
      {/*        Save All Day Schedule Templates*/}
      {/*    </Button>*/}
      {/*</div>*/}
      <SnackbarTopCenter
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </div>
  );
}
