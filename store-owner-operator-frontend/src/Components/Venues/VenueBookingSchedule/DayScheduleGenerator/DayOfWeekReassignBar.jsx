import ContentCard from "../../../CommonComponents/Card/ContentCard";
import ButtonClassSets from "../../../../utilities/ButtonClassSets";
import TextClassSets from "../../../../utilities/TextClassSets";
import CustomToolbar from "../../../CommonComponents/Toolbar/CustomToolbar";

export default function DayOfWeekReassignBar({
  venueScheduleState,
  dispatchVenueSchedule,
}) {
  console.log("venueScheduleState in selectorBar", venueScheduleState);
  const selectedTemplate = venueScheduleState.selectedTemplate;
  const dayScheduleGenerator = venueScheduleState.dayScheduleGenerator;
  const dayOfWeekButtonStyle = ButtonClassSets.daySchSettingSec;

  const assignSelectedTemplateToDay = (dayOfWeekString) => {
    dispatchVenueSchedule({
      type: "SAVE_DAY_SCHEDULE_GENERATOR",
      payload: { ...dayScheduleGenerator, [dayOfWeekString]: selectedTemplate },
    });
  };

  return (
    // i use flex-1 so all the buttons are the same size (even though the word "Wednesday" is longer than "Monday")
    dayScheduleGenerator ? (
      <CustomToolbar>
        <button
          className={dayOfWeekButtonStyle + " flex-1 flex flex-col"}
          onClick={() => assignSelectedTemplateToDay("mon")}
        >
          <p className={TextClassSets.h2}>Monday</p>
          <p
            className={
              TextClassSets.h5 +
              " " +
              (selectedTemplate?.id === dayScheduleGenerator?.mon?.id
                ? TextClassSets.selected
                : "")
            }
          >
            {dayScheduleGenerator?.mon?.name}
          </p>
        </button>
        <button
          className={dayOfWeekButtonStyle + " flex-1 flex flex-col"}
          onClick={() => assignSelectedTemplateToDay("tue")}
        >
          <p className={TextClassSets.h2}>Tuesday</p>
          <p
            className={
              TextClassSets.h5 +
              " " +
              (selectedTemplate?.id === dayScheduleGenerator?.tue?.id
                ? TextClassSets.selected
                : "")
            }
          >
            {dayScheduleGenerator?.tue?.name}
          </p>
        </button>
        <button
          className={dayOfWeekButtonStyle + " flex-1 flex flex-col"}
          onClick={() => assignSelectedTemplateToDay("wed")}
        >
          <p className={TextClassSets.h2}>Wednesday</p>
          <p
            className={
              TextClassSets.h5 +
              " " +
              (selectedTemplate?.id === dayScheduleGenerator?.wed?.id
                ? TextClassSets.selected
                : "")
            }
          >
            {dayScheduleGenerator?.wed?.name}
          </p>
        </button>
        <button
          className={dayOfWeekButtonStyle + " flex-1 flex flex-col"}
          onClick={() => assignSelectedTemplateToDay("thu")}
        >
          <p className={TextClassSets.h2}>Thursday</p>
          <p
            className={
              TextClassSets.h5 +
              " " +
              (selectedTemplate?.id === dayScheduleGenerator?.thu?.id
                ? TextClassSets.selected
                : "")
            }
          >
            {dayScheduleGenerator?.thu?.name}
          </p>
        </button>
        <button
          className={dayOfWeekButtonStyle + " flex-1 flex flex-col"}
          onClick={() => assignSelectedTemplateToDay("fri")}
        >
          <p className={TextClassSets.h2}>Friday</p>
          <p
            className={
              TextClassSets.h5 +
              " " +
              (selectedTemplate?.id === dayScheduleGenerator?.fri?.id
                ? TextClassSets.selected
                : "")
            }
          >
            {dayScheduleGenerator?.fri?.name}
          </p>
        </button>
        <button
          className={dayOfWeekButtonStyle + " flex-1 flex flex-col"}
          onClick={() => assignSelectedTemplateToDay("sat")}
        >
          <p className={TextClassSets.h2}>Saturday</p>
          <p
            className={
              TextClassSets.h5 +
              " " +
              (selectedTemplate?.id === dayScheduleGenerator?.sat?.id
                ? TextClassSets.selected
                : "")
            }
          >
            {dayScheduleGenerator?.sat?.name}
          </p>
        </button>
        <button
          className={dayOfWeekButtonStyle + " flex-1 flex flex-col"}
          onClick={() => assignSelectedTemplateToDay("sun")}
        >
          <p className={TextClassSets.h2}>Sunday</p>
          <p
            className={
              TextClassSets.h5 +
              " " +
              (selectedTemplate?.id === dayScheduleGenerator?.sun?.id
                ? TextClassSets.selected
                : "")
            }
          >
            {dayScheduleGenerator?.sun?.name}
          </p>
        </button>
      </CustomToolbar>
    ) : (
      ""
    )
  );
}
