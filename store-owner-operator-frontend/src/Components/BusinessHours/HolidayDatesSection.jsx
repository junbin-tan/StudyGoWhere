import CustomTag from "../../utilities/CustomTag";
import React from "react";

const defaultFlexClassNames = "flex flex-row items-center gap-3";
const HolidayDatesSection = ({
                               dateRangeList,
                               handleDateRangeSelection = () => {},
                               selectedDateRangeIndex = -1,
                               customTagStyle,
                               flexClassNames = defaultFlexClassNames,
                               addonFlexClassNames = "",
                             }) => {
  return (
      // changed flex to col so it goes up to down instead (not sure good idea or not?)
      <div className={flexClassNames + " " + addonFlexClassNames}>
        {dateRangeList?.length > 0 ? (
            dateRangeList.map((dateRange, index) => {
              if (dateRange.fromDate === dateRange.toDate) {
                return (
                    <CustomTag
                        key={index}
                        label={`${dateRange.fromDate}`}
                        className="text-center mr-5"
                        style={selectedDateRangeIndex == index ? customTagStyle : {}}
                        onClick={() => handleDateRangeSelection(index)}
                    />
                );
              } else {
                return (
                    <CustomTag
                        key={index}
                        label={`${dateRange.fromDate} - ${dateRange.toDate}`}
                        className="text-center mr-5"
                        style={selectedDateRangeIndex == index ? customTagStyle : {}}
                        onClick={() => handleDateRangeSelection(index)}
                    />
                );
              }
            })
        ) : (
            <div>No dates selected for your holidays</div>
        )}
      </div>
  );
};

export default HolidayDatesSection;