import BodyCard from "../../../CommonComponents/Card/BodyCard";
import DaySchedule from "../DaySchedules/DaySchedule";
import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DayScheduleTemplateSelectorBox from "./DayScheduleTemplateSelectorBox";
import { LoginTokenContext } from "../../../../FunctionsAndContexts/LoginTokenContext";
import { useParams } from "react-router-dom";
import DayScheduleTemplateSettings from "./DayScheduleTemplateSettings";
import DayScheduleGeneratorSettings from "./DayScheduleGeneratorSettings";
import TextClassSets from "../../../../utilities/TextClassSets";
import FieldInfo from "../../../CommonComponents/Form/FieldInfo";

export default function DayScheduleGenerator({
  venueScheduleState,
  dispatchVenueSchedule,
}) {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { id } = useParams();
  useEffect(() => {
    dispatchVenueSchedule({
      type: "SELECT_DAY_SCHEDULE_TEMPLATE",
      payload: venueScheduleState.dayScheduleGenerator.mon,
    });
  }, []);

  const [testOpen, setTestOpen] = useState(false);
  // const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  // const [selectedDayOfWeekTemplate, setSelectedDayOfWeekTemplate] = useState(dummyDayOfWeekTemplates.mon);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  return (
    <BodyCard>
      <div className="flex flex-col mb-3">
        <h2 className={TextClassSets.h2}>Day Schedule Generator</h2>
        <FieldInfo>Create a template for your venue's day schedules.</FieldInfo>
      </div>
      <DayScheduleGeneratorSettings
        venueScheduleState={venueScheduleState}
        dispatchVenueSchedule={dispatchVenueSchedule}
      />
      <DayScheduleTemplateSelectorBox
        venueScheduleState={venueScheduleState}
        dispatchVenueSchedule={dispatchVenueSchedule}
      />
      {/*<DayOfWeekTemplatesContainerEXPERIMENT />*/}
      {venueScheduleState.selectedTemplate && (
        <DayScheduleTemplateSettings
          venueScheduleState={venueScheduleState}
          dispatchVenueSchedule={dispatchVenueSchedule}
        />
      )}
      <DaySchedule
        daySchedule={venueScheduleState.selectedTemplate}
        isTemplate={true}
        dispatch={dispatchVenueSchedule}
      />
    </BodyCard>
  );
}
