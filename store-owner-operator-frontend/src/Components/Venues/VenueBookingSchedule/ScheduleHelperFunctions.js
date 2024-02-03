// for reference, the format of an availabilityPeriod
//
// availabilityPeriods:[
//     {
//         id: 1,
//         numAvailable: 10,
//         fromTime: "10:30:00.000",
//         toTime: "14:30:00.000",
//         overrideDefaultPrice: false,
//     },
//
// ],

import dayjs from "dayjs";

const ScheduleHelperFunctions = {

    indexToTimeString: (index) => {
        if (index >= 0 && index < 48) {
            const hours = Math.floor(index / 2);
            const minutes = index % 2 === 0 ? "00" : "30";
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        } else {
            return "Invalid interval";
        }
    },
    // this return the "number of indexes" pretty much
    timesToIntervalLength: (fromTime, toTime) => {
        const from = new Date("1970-01-01T" + fromTime);
        const to = new Date("1970-01-01T" + toTime);

        // Calculate the time difference in milliseconds
        const timeDiffMs = to - from;

        // Calculate the number of 30-minute intervals (1800000 milliseconds per interval)
        const intervals = timeDiffMs / 1800000;

        return intervals;
    },
    timeToIndex: (time) => { // need to modify this to take in a dayjs object

        console.log("checking if time is dayjs object")
        if (dayjs.isDayjs(time)) {
            time = time.format("HH:mm");
            console.log("time is dayjsobject, formatted time variable to: ", time)
        }
        console.log("calling time to index, time object is:", time)
        // if the time passed in is a LocalDateTime object, convert it to a string
        if (time.includes("T")) {
            time = time.split("T")[1];
        }

        const hours = parseInt(time.split(":")[0]);
        const minutes = parseInt(time.split(":")[1]);
        const index = hours * 2 + (minutes === 0 ? 0 : 1);

        console.log("hours:", hours);
        console.log("minutes:", minutes);
        console.log("index:", index);
        return index;
    },

    timeStringToDayjsObject: (timeString) => {
        return dayjs("1970-01-01T" + timeString);
    },

    indexToDayjsObject: (index) => {
        const timeString = ScheduleHelperFunctions.indexToTimeString(index);
        return ScheduleHelperFunctions.timeStringToDayjsObject(timeString);
    },

}
export default ScheduleHelperFunctions;