import CustomTag from "../../utilities/CustomTag";
import React from "react";

const DayBusinessHours = ({
                              day,
                              timeRangeList,
                              handleOptionSelection = () => {},
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


export default DayBusinessHours;
