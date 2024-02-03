import React, { useState } from "react";
import CustomTag from "../../utilities/CustomTag";
import { Button, Divider } from "@mui/material";
import ButtonStyles from "../../utilities/ButtonStyles";
import { DatePicker } from "@mui/x-date-pickers";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import HolidayDatesSection from "./HolidayDatesSection";

const dummyData = {
  holidays: [{ fromDate: "", toDate: "" }],
};

// dateRange is synonymous to fromToDate (used alot later below)

const BusinessHoursHolidayDates = ({ formData, handleFormChange }) => {
  const [selectedDateOption, setSelectedDateOption] = useState("Single Date");
  const [inputFromToDate, setInputFromToDate] = useState({
    fromDate: "",
    toDate: "",
  });

  const [selectedFromToDateIndex, setSelectedFromToDateIndex] = useState(null);

  // to capitalise the lowercase day keys (mon, tue, wed)
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleDateOptionSelection = (value) => {
    setSelectedDateOption(value);
  };
  const handleFromDateChange = (value) => {
    // const formattedFromDate = value.format("DD/MM/YYYY");

    // Formatted date needs to be in YYYY-MM-DD format for the backend (yes, with the hyphens)
    // we can change later?
    const formattedFromDate = value.format("YYYY-MM-DD");
    console.log("formattedFromDate", formattedFromDate);
    setInputFromToDate({ ...inputFromToDate, fromDate: formattedFromDate });
  };
  const handleToDateChange = (value) => {
    // const formattedToDate = value.format("DD/MM/YYYY");

    const formattedToDate = value.format("YYYY-MM-DD");
    console.log("formattedToDate", formattedToDate);
    setInputFromToDate({ ...inputFromToDate, toDate: formattedToDate });
  };
  const handleBothDateChange = (value) => {
    // const formattedDate = value.format("DD/MM/YYYY");
    const formattedDate = value.format("YYYY-MM-DD");
    console.log("formattedDate", formattedDate);
    setInputFromToDate({ fromDate: formattedDate, toDate: formattedDate });
  };

  // this part changes formData
  const addInputFromToDate = () => {
    // if not closed, then apply the selected from and to time to all the selected days
    console.log("add FromToDate is called");
    console.log(inputFromToDate);

    if (!(inputFromToDate.fromDate === "" || inputFromToDate.toDate === "")) {
      console.log("inputFromToDate", inputFromToDate);
      const fakeEvent = {
        target: {
          name: "businessHours.holidays",
          value: [...formData.businessHours.holidays, inputFromToDate],
        },
      };
      handleFormChange(fakeEvent);
    }
  };

  const handleDateRangeSelection = (index) => {
    console.log("handleDateRangeSelection is called");
    console.log(index);
    setSelectedFromToDateIndex(index);
  };

  // selectedFromToDate is different from input! user clicks on existing holiday dates to delete them
  // this part changes formData
  const removeSelectedFromToDate = () => {
    console.log("removeSelectedFromToDate is called");
    console.log(selectedFromToDateIndex);
    if (selectedFromToDateIndex !== null) {
      const copyOfSelectedFromToDates = [...formData.businessHours.holidays];
      copyOfSelectedFromToDates.splice(selectedFromToDateIndex, 1);

      let fakeEvent = {
        target: {
          name: "businessHours.holidays",
          value: copyOfSelectedFromToDates,
        },
      };
      handleFormChange(fakeEvent);
      setSelectedFromToDateIndex(null);
    }
  };

  return (
    <>
      <div className="flex flex-row gap-8 w-full border border-solid border-gray-300 px-5 py-8 rounded-lg shadow-lg bg-lightgray-80 ">
        {/* Left box */}

        <div className="flex flex-col w-fit gap-5">
          <label htmlFor="Holiday Dates" className="font-medium">
            Holiday Dates
          </label>
          {/* Tags */}
          <div className="flex flex-row gap-2 items-center">
            <CustomTag
              label="Single Date"
              onClick={handleDateOptionSelection}
              style={
                selectedDateOption == "Single Date" ? ButtonStyles.selected : {}
              }
            />
            <CustomTag
              label="Date Range"
              onClick={handleDateOptionSelection}
              style={
                selectedDateOption == "Date Range" ? ButtonStyles.selected : {}
              }
            />
          </div>
          <div className="flex flex-col items-center gap-3">
            {selectedDateOption == "Single Date" && (
              // note: react setState is actually asynchronous so
              // cant just call both handleFromDateChange and handleToDateChange without a Promise
              <div className="flex flex-row gap-3 items-center">
                <DatePicker
                  onChange={handleBothDateChange}
                  name="holidayDate"
                  label="Holiday Date"
                />
              </div>
            )}

            {selectedDateOption == "Date Range" && (
              <div className="flex flex-row gap-3 items-center">
                <DatePicker
                  onChange={handleFromDateChange}
                  name="holidayStartDate"
                  label="Holiday Start Date"
                />
                <span>to</span>
                <DatePicker
                  onChange={handleToDateChange}
                  name="holidayEndDate"
                  label="Holiday End Date"
                />
              </div>
            )}
          </div>

          <Button
            onClick={addInputFromToDate}
            className={ButtonClassSets.primary}
          >
            Add holiday date range
          </Button>

          <Button
            onClick={removeSelectedFromToDate}
            className={
              selectedFromToDateIndex != null
                ? ButtonClassSets.danger
                : ButtonClassSets.disabled
            }
          >
            Remove selected holiday date range
          </Button>
        </div>
        <Divider orientation="vertical" flexItem />
        {/* Right box */}

        <div className="flex flex-col gap-2">
          {!formData?.businessHours ? (
            // THIS IS FOR DUMMY DATA
            <HolidayDatesSection
              dateRangeList={dummyData}
              handleDateRangeSelection={handleDateRangeSelection}
              selectedDateRangeIndex={selectedFromToDateIndex}
              customTagStyle={ButtonStyles.success}
            />
          ) : (
            // THIS IS THE REAL DATA FROM FORMDATA
            <HolidayDatesSection
              dateRangeList={formData?.businessHours?.holidays}
              handleDateRangeSelection={handleDateRangeSelection}
              selectedDateRangeIndex={selectedFromToDateIndex}
              customTagStyle={ButtonStyles.selected} // had to change this bcos can't reference index from outside
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BusinessHoursHolidayDates;
