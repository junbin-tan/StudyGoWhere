import React, { useState } from "react";
import CustomTag from "../../utilities/CustomTag";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Button, Divider, IconButton, TextField } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ButtonStyles from "../../utilities/ButtonStyles";
import CustomLine from "../../utilities/CustomLine";
import ErrorModal from "../CommonComponents/Modal/ErrorModal";
import ButtonClassSets from "../../utilities/ButtonClassSets";

const dummyData = {
  Mon: [
    {
      fromTime: "09:00",
      toTime: "12:00",
    },
    {
      fromTime: "14:00",
      toTime: "17:00",
    },
  ],
  Tue: [
    {
      fromTime: "09:00",
      toTime: "17:00",
    },
  ],
  Wed: [],
  Thu: [
    {
      fromTime: "09:00",
      toTime: "12:00",
    },
    {
      fromTime: "14:00",
      toTime: "15:00",
    },
    {
      fromTime: "16:00",
      toTime: "21:00",
    },
  ],
  Fri: [
    {
      fromTime: "09:00",
      toTime: "17:00",
    },
  ],
  Sat: [],
  Sun: [
    {
      fromTime: "09:00",
      toTime: "17:00",
    },
  ],
};

// this is not the main export of this file btw, its below
const DayBusinessHours = ({
  day,
  timeRangeList,
  handleOptionSelection,
  customTagStyle,
}) => {
  return (
    <div className="flex flex-row items-center gap-3">
      <CustomTag
        label={day}
        className="w-20 text-center mr-5"
        onClick={handleOptionSelection}
        style={customTagStyle}
      />
      {timeRangeList?.length > 0 ? (
        timeRangeList.map((timeRange, index) => (
          <div
            key={index}
            className="py-2 px-5 border-2 border-lightgray-100 text-lg rounded-md text-gray-500"
          >
            {timeRange.fromTime} - {timeRange.toTime}
          </div>
        ))
      ) : (
        <div className="py-2 px-5 border-2 border-lightgray-100 text-lg rounded-md text-gray-500">
          <p>Closed</p>
        </div>
      )}
    </div>
  );
};

const BusinessHours = ({ formData, handleFormChange }) => {
  const [selectedOption, setSelectedOption] = useState("Mon");
  const [selectedDays, setSelectedDays] = useState({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });

  const [timePickerCount, setTimePickerCount] = useState(1);

  const [selectedFromToTimes, setSelectedFromToTimes] = useState([
    { fromTime: "", toTime: "" },
  ]);

  const [errors, setErrors] = useState([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  let errorMessages = "";
  if (errors?.length < 2) {
    if (errors?.includes("Time range cannot be empty!")) {
      errorMessages = "Time range cannot be empty!";
    } else if (
      errors?.includes("Closing time cannot be earlier than opening time!")
    ) {
      errorMessages = "Closing time cannot be earlier than opening time!";
    }
  } else {
    if (
      errors?.includes("Time range cannot be empty!") &&
      errors?.includes("Closing time cannot be earlier than opening time!")
    ) {
      errorMessages =
        "Time range cannot be empty and closing time cannot be earlier than opening time!";
    } else if (errors.includes("Time range cannot be empty!")) {
      errorMessages = "Time range cannot be empty!";
    } else if (
      errors?.includes("Closing time cannot be earlier than opening time!")
    ) {
      errorMessages = "Closing time cannot be earlier than opening time!";
    }
  }

  const handleOptionSelection = (label) => {
    // utility function for setting specific key to true, and all other keys to false
    function setKeyTrueAllElseFalse(selectedKey, inputObject) {
      const updatedObject = Object.keys(inputObject).reduce((acc, key) => {
        // Set every other key to false, except for the selected key
        acc[key] = key === selectedKey;
        return acc;
      }, {});
      return updatedObject;
    }

    // actual logic & execution
    if (label == "Weekend") {
      setSelectedDays({
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: true,
        Sun: true,
      });
    } else if (label == "Weekday") {
      setSelectedDays({
        Mon: true,
        Tue: true,
        Wed: true,
        Thu: true,
        Fri: true,
        Sat: false,
        Sun: false,
      });
    } else if (label == "All") {
      setSelectedDays({
        Mon: true,
        Tue: true,
        Wed: true,
        Thu: true,
        Fri: true,
        Sat: true,
        Sun: true,
      });
    } else if (!label || label == "") {
      setSelectedDays({
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
      });
    } else {
      setSelectedDays(setKeyTrueAllElseFalse(label, selectedDays));
    }
  };

  // to capitalise the lowercase day keys (mon, tue, wed)
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handlePickerCountChange = (actionDone) => {
    if (actionDone == "increase") {
      setTimePickerCount(timePickerCount + 1);
      // copy, modify, then set back
      // this is a shallow copy, but it doesnt matter, the purpose of calling the set is to trigger a re-render
      const copyOfSelectedFromToTimes = [...selectedFromToTimes];
      copyOfSelectedFromToTimes.push({ fromTime: "", toTime: "" }); // need to add empty one to keep up w list length
      setSelectedFromToTimes(copyOfSelectedFromToTimes);

      // add error
      const copyOfErrors = [...errors];
      copyOfErrors.push("Time range cannot be empty!");
      setErrors(copyOfErrors);
    } else if (actionDone == "decrease") {
      if (timePickerCount == 1) return; // dont allow to go below 1 (0
      setTimePickerCount(timePickerCount - 1);
      const copyOfSelectedFromToTimes = [...selectedFromToTimes];
      copyOfSelectedFromToTimes.pop();
      setSelectedFromToTimes(copyOfSelectedFromToTimes);
      // remove errors
      const copyOfErrors = [...errors];
      copyOfErrors.pop();
      setErrors(copyOfErrors);
    }
  };

  const handleFromTimeChange = (value, index) => {
    console.log(value.format("HH:mm"));
    const formattedFromTime = value.format("HH:mm");

    // copy, modify, then set back
    // this is a shallow copy, but it doesnt matter, the purpose of calling the set is to trigger a re-render
    const copyOfSelectedFromToTimes = [...selectedFromToTimes];
    copyOfSelectedFromToTimes[index].fromTime = formattedFromTime;
    setSelectedFromToTimes(copyOfSelectedFromToTimes);
  };

  const handleToTimeChange = (value, index) => {
    console.log(value.format("HH:mm"));
    const formattedToTime = value.format("HH:mm");
    const copyOfSelectedFromToTimes = [...selectedFromToTimes];

    const fromTime = copyOfSelectedFromToTimes[index].fromTime;
    const fromTimeObject = new Date();
    const [hours, minutes] = fromTime.split(":").map(Number);

    fromTimeObject.setHours(hours);
    fromTimeObject.setMinutes(minutes);
    console.log(fromTimeObject > value);

    if (fromTimeObject > value) {
      const copyOfErrors = [...errors];
      copyOfErrors[index] = "Closing time cannot be earlier than opening time!";
      setErrors(copyOfErrors);
    } else {
      const copyOfErrors = [...errors];
      copyOfErrors[index] = false;
      setErrors(copyOfErrors);
    }
    copyOfSelectedFromToTimes[index].toTime = formattedToTime;
    setSelectedFromToTimes(copyOfSelectedFromToTimes);
  };

  const applySelectedFromToTime = (isClosed) => {
    if (!errors.every((error) => error == false)) {
      console.log("there are errors");
      // if there's error, trigger modal here
      setIsErrorModalOpen(true);
      return;
    }
    // if not closed, then apply the selected from and to time to all the selected days
    console.log("apply is called");
    Object.keys(selectedDays).map((dayName, index) => {
      if (selectedDays[dayName]) {
        const dayNameLowercase = dayName.toLowerCase();
        console.log("got past the selectedDays if check");
        //
        console.log("selectedFromToTimes", selectedFromToTimes);
        // if (isClosed) {
        //   setFormKeyValue("businessHours." + dayNameLowercase, []);
        //   console.log("it is in isClosed");
        // } else {
        //   setFormKeyValue(
        //     "businessHours." + dayNameLowercase,
        //     selectedFromToTimes
        //   );
        //   console.log(formData);
        // }

        let fakeEventForBusinessHours = {
          target: {
            name: "businessHours." + dayNameLowercase,
            value: [],
          },
        };
        if (isClosed) {
          handleFormChange(fakeEventForBusinessHours);
          console.log("it is in isClosed");
        } else {
          fakeEventForBusinessHours.target.value = selectedFromToTimes;
          handleFormChange(fakeEventForBusinessHours);
          console.log(formData);
        }
      }
    });
  };

  return (
    <>
      <div className="flex flex-row gap-8 w-full border border-solid border-gray-300 px-5 py-8 rounded-lg shadow-lg bg-lightgray-80 ">
        {/* Left box */}
        <div className="flex flex-col w-fit gap-5">
          {/* Tags */}
          <label htmlFor="businessHours" className="font-medium">
            Regular Business Hours
          </label>
          <div className="flex flex-row gap-2 items-center">
            <CustomTag label="Weekend" onClick={handleOptionSelection} />
            <CustomTag label="Weekday" onClick={handleOptionSelection} />
            <CustomTag label="All" onClick={handleOptionSelection} />
          </div>
          <div className="flex flex-col items-center gap-3">
            {Array(timePickerCount)
              .fill(null)
              .map((_, index) => {
                // if (selectedFromToTimes[index] != null) {
                //   const fromTime = selectedFromToTimes[index].fromTime;
                //   const formattedFromTime = new Date(`1970-01-01T${fromTime}`);
                // } else {

                // }

                return (
                  <>
                    <div
                      key={index}
                      className="flex flex-row gap-3 items-center"
                    >
                      <TimePicker
                        onChange={(value) => handleFromTimeChange(value, index)}
                        name="openTime"
                        label="Opening Time"
                      />
                      <span>to</span>
                      <TimePicker
                        InputProps={{ inputComponent: TimePicker }}
                        onChange={(value) => handleToTimeChange(value, index)}
                        name="closeTime"
                        label="Closing Time"
                      />
                    </div>
                    {errors[index] && (
                      <p className="text-red-600 text-xs">{errors[index]}</p>
                    )}
                  </>
                );
              })}
            {/*<TimePicker onChange={handleFromTimeChange} name="openTime" label="Opening Time" />*/}
            {/*<span>to</span>*/}
            {/*<TimePicker onChange={handleToTimeChange} name="closeTime" label="Closing Time" />*/}
            <div className={"flex flex-row"}>
              <IconButton onClick={() => handlePickerCountChange("decrease")}>
                <RemoveCircleOutlineIcon />
              </IconButton>
              <IconButton onClick={() => handlePickerCountChange("increase")}>
                <AddCircleOutlineIcon />
              </IconButton>
            </div>
          </div>
          <CustomLine />
          <Button
            onClick={() => applySelectedFromToTime(true)}
            sx={{ border: "1px solid" }}
            className={ButtonClassSets.secondary}
          >
            Set as Closed
          </Button>
          <Button
            onClick={() => applySelectedFromToTime(false)}
            className={ButtonClassSets.primary}
          >
            Set business hours
          </Button>
          {/* <Button
            onClick={() => console.log(errors)}
            style={ButtonStyles.default}
          >
            console log
          </Button> */}
        </div>
        <Divider orientation="vertical" flexItem />
        {/* Right box */}

        <div className="flex flex-col gap-2">
          {!formData?.businessHours
            ? Object.keys(dummyData).map((key, index) => {
                const day = key;
                const timeRangeList = dummyData[key];
                return (
                  <DayBusinessHours
                    key={index}
                    day={day}
                    timeRangeList={timeRangeList}
                    handleOptionSelection={handleOptionSelection}
                    customTagStyle={
                      selectedDays[day] ? ButtonStyles.selected : {}
                    }
                  />
                );
              })
            : Object.keys(formData.businessHours).map((key, index) => {
                if (key == "holidays") return; // skip holidays
                if (key == "businessHoursId") return; // skip businessHoursId
                const day = capitalize(key);
                const timeRangeList = formData.businessHours[key];
                return (
                  <DayBusinessHours
                    key={index}
                    day={day}
                    timeRangeList={timeRangeList}
                    handleOptionSelection={handleOptionSelection}
                    customTagStyle={
                      selectedDays[day] ? ButtonStyles.selected : {}
                    }
                  />
                );
              })}
        </div>
      </div>
      <ErrorModal
        open={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        headerText={"Error!"}
        bodyText={errorMessages}
        closeButtonCallbackFn={() => setIsErrorModalOpen(false)}
      />
    </>
  );
};

export default BusinessHours;
