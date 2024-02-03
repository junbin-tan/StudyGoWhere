import React, { useContext } from "react";
import TextClassSets from "../../../../utilities/TextClassSets";
import ContentCard from "../../../CommonComponents/Card/ContentCard";
import ContentCard_PadS from "../../../CommonComponents/Card/ContentCard_PadS";
import { Button } from "@mui/material";
import ListingCard from "../../../CommonComponents/Card/ListingCard";
import DSGeneratorClassSets from "./DSGeneratorClassSets";
import ButtonClassSets from "../../../../utilities/ButtonClassSets";
import ContentCard_PadM from "../../../CommonComponents/Card/ContentCard_PadM";
import HorizontalLine from "../../../CommonComponents/Line/HorizontalLine";
import DayScheduleAPI from "../DaySchedules/helpers/DayScheduleAPI";
import { useParams } from "react-router-dom";
import { LoginTokenContext } from "../../../../FunctionsAndContexts/LoginTokenContext";

export default function DayScheduleTemplateSelectorBox({
  venueScheduleState,
  dispatchVenueSchedule,
}) {
  console.log("venueScheduleState in selectorBox", venueScheduleState);
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { id } = useParams(); // because of bad decision making we don't have access to venue id in the venueScheduleState
  function DayScheduleTemplateListing({ template, ...rest }) {
    return (
      <ListingCard
        className={
          "flex flex-col items-center " +
          (venueScheduleState.selectedTemplate?.id === template.id
            ? DSGeneratorClassSets.templateListing.selected
            : DSGeneratorClassSets.templateListing.default) +
          " " +
          DSGeneratorClassSets.templateListing.hover
        }
        {...rest}
        onClick={() =>
          dispatchVenueSchedule({
            type: "SELECT_DAY_SCHEDULE_TEMPLATE",
            payload: template,
          })
        }
      >
        <p>{template.name}</p>
      </ListingCard>
    );
  }

  return (
    <ContentCard_PadM
      id={"DayScheduleTemplateSelectorBox"}
      className={"flex flex-col"}
    >
      <div id={"DayScheduleTemplateHeader"}>
        <p className={TextClassSets.h4}>Venue Templates</p>
      </div>
      <div id={"DayScheduleTemplateList"} className={"grid grid-cols-3"}>
        {venueScheduleState.dayScheduleTemplates.map((template, index) => {
          return <DayScheduleTemplateListing key={index} template={template} />;
        })}
      </div>
      <HorizontalLine className={"my-4"} />
      <div id={"AddNewTemplateButton"} className={"flex flex-row justify-end"}>
        <Button
          variant={"contained"}
          className={ButtonClassSets.primary}
          onClick={() => {
            DayScheduleAPI.createNewDayScheduleTemplate(encodedToken, id)
              .then((response) => {
                dispatchVenueSchedule({
                  type: "UPDATE_STATE_WITH_RESPONSE_DATA_(DS_OR_DST)",
                  payload: { isTemplate: true, daySchedule: response.data },
                });
              })
              .catch((err) => console.log(err.message));
          }}
        >
          Add New Template
        </Button>
      </div>
    </ContentCard_PadM>
  );
}
