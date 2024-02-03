import React, { useEffect, useState } from "react";
import BusinessHours from "../../BusinessHours/BusinessHours";
import BusinessHoursHolidayDates from "../../BusinessHours/BusinessHoursHolidayDates";
import { Button } from "@mui/material";
import ButtonStyles from "../../../utilities/ButtonStyles";
import BodyCard from "../../CommonComponents/Card/BodyCard";
import CopyFromToBar from "./CopyFromToBar";
import ButtonClassSets from "../../../utilities/ButtonClassSets";

export default function VenueBusinessHours({
  formData,
  hasSubmitButton = true,
  handleFormChange,
}) {
  return (
    <BodyCard>
      <BusinessHours formData={formData} handleFormChange={handleFormChange} />
      <br />
      <BusinessHoursHolidayDates
        formData={formData}
        handleFormChange={handleFormChange}
      />

      {/*need some help formatting button gap, need to surround business hours in some sort of grid*/}
      <br />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 xl:gap-10">
        {hasSubmitButton && (
          <div className="col-span-3 grid md:grid-cols-3 items-center">
            <div className="col-span-3 justify-self-end">
              <Button type="submit" className={ButtonClassSets.primary}>
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </BodyCard>
  );
}
