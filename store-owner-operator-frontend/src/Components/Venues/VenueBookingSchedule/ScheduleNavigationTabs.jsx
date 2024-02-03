import Tabs from "@mui/material/Tabs";
import { Link, useParams } from "react-router-dom";
import Tab from "@mui/material/Tab";
import React, { useContext, useMemo, useState } from "react";
import { OwnerVenuesContext } from "../../../FunctionsAndContexts/OwnerVenuesContext";
import { OperatorUserContext } from "../../../FunctionsAndContexts/OperatorUserContext";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import { FormatListBulleted } from "@mui/icons-material";
import TextClassSets from "../../../utilities/TextClassSets";
import {GiPowerGenerator} from "react-icons/gi";
import {IoCog} from "react-icons/io5";
import {MdTableBar} from "react-icons/md";

export default function ScheduleNavigationTabs() {
  const { id, pageName } = useParams();
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext) || {};
  const { operatorData, setOperatorData } =
    useContext(OperatorUserContext) || {};

  const pagePaths = useMemo(() => {
    if (ownerData) {
      return {
        daySchedules: `/venues/${id}/booking-schedule/day-schedules`,
        dayScheduleGenerator: `/venues/${id}/booking-schedule/day-schedule-generator`,
        tableTypes: `/venues/${id}/booking-schedule/table-types`,
      };
    } else {
      return {
        daySchedules: `/venue/booking-schedule/day-schedules`,
        dayScheduleGenerator: `/venue/booking-schedule/day-schedule-generator`,
        tableTypes: `/venue/booking-schedule/table-types`,
      };
    }
  }, [ownerData, operatorData]);

  // using useMemo here to save space (combining useState and useEffect)
  // this way, we don't need to have handleTabChange in the Tabs, less code & lines, cleaner.
  const tabValue = useMemo(() => {
    if (pageName == "day-schedules") {
      return 0;
    } else if (pageName == "day-schedule-generator") {
      return 1;
    } else if (pageName == "table-types") {
      return 2;
    }
  });

  // many different ways to approach. For now i'm just copy pasting the previously used approach.
  // I will leave an example near the bottom if we want to ever change the implementation.
  return (
    <Tabs
      className="flex flex-row items-center"
      centered
      value={tabValue}
      aria-label="icon label tabs example"
    >
      <Link to={pagePaths.daySchedules} className="flex flex-1 max-w-md">
        <Tab
          icon={<BsFillCalendarWeekFill className={TextClassSets.icon} />}
          label={"Day Schedules"}
          className="flex-auto max-w-md"
        />
      </Link>
      <Link
        to={pagePaths.dayScheduleGenerator}
        className="flex flex-1 max-w-md"
      >
        <Tab
          icon={<IoCog className={TextClassSets.icon}/>}
          label={"Day Schedule Generator"}
          className="flex-auto max-w-md"
        />
      </Link>
      <Link to={pagePaths.tableTypes} className="flex flex-1 max-w-md">
        <Tab
          icon={<MdTableBar className={TextClassSets.icon} />}
          label={"Table Types"}
          className="flex-auto max-w-md"
        />
      </Link>
    </Tabs>
  );

  // we can use this as well but may not be as customisable? not sure. too lazy to try out and experiment
  // <Tab onClick={() => navigate("xyz")} />
}
