import axios from "axios";
import {BACKEND_PREFIX} from "../../../../../FunctionsAndContexts/serverPrefix";

const cleanDayScheduleIds = (daySchedule) => {
    if (typeof(daySchedule.id) == "string" && daySchedule.id.includes("TEMP")) {
        daySchedule.id = null;
    }
    // shouldnt ever be needed, because id is never null since all daySchedules are created on the backend before frontend gets them
    daySchedule.tableTypeDayAvailabilities.forEach(ttda => {
        if (typeof(ttda.id) == "string" && ttda.id.includes("TEMP")) {
            ttda.id = null;
        }
        ttda.availabilityPeriods.forEach(ap => {
            if (typeof(ttda.id) == "string" && ap.id.includes("TEMP")) {
                ap.id = null;
            }
        })
    })
}


const DayScheduleAPI = {
    async saveDayScheduleTemplate(encodedToken, dayScheduleTemplate, venueId) {
        cleanDayScheduleIds(dayScheduleTemplate)
        const authorisationString = "Bearer " + encodedToken;
        // THIS GETS OWNER OBJECT FROM BACKEND THRU THE ENCODED TOKEN
        const response = await axios.post(`${BACKEND_PREFIX}/owner/save-day-schedule-template`,
            dayScheduleTemplate,
            {
                params: {venueId},
                headers: {
                    'Authorization': authorisationString
                }
            });
        return response;
    },
    async saveAllDayScheduleTemplates(encodedToken, dayScheduleTemplates, venueId) {
        dayScheduleTemplates.forEach(dayScheduleTemplate => cleanDayScheduleIds(dayScheduleTemplate))

        const authorisationString = "Bearer " + encodedToken;
        // THIS GETS OWNER OBJECT FROM BACKEND THRU THE ENCODED TOKEN
        const response = await axios.post(`${BACKEND_PREFIX}/owner/save-day-schedule-templates`,
            dayScheduleTemplates,
            {
                params: {venueId},
                headers: {
                    'Authorization': authorisationString
                }
            });
        return response;
    },
    async createNewDayScheduleTemplate(encodedToken, venueId) {
        const authorisationString = "Bearer " + encodedToken;
        // THIS GETS OWNER OBJECT FROM BACKEND THRU THE ENCODED TOKEN
        const response = await axios.post(`${BACKEND_PREFIX}/owner/create-day-schedule-template`,
            null,
            {
                params: {venueId},
                headers: {
                    'Authorization': authorisationString
                }
            });
        return response;
    },
    async saveDaySchedule(encodedToken, daySchedule, venueId) {
        cleanDayScheduleIds(daySchedule)
        const authorisationString = "Bearer " + encodedToken;
        // THIS GETS OWNER OBJECT FROM BACKEND THRU THE ENCODED TOKEN
        const response = await axios.post(`${BACKEND_PREFIX}/owner/save-day-schedule`,
            daySchedule,
            {
                params: {venueId},
                headers: {
                    'Authorization': authorisationString
                }
            });

        return response;
    },
    async createNewDaySchedule(encodedToken, venueId, date) {
        const authorisationString = "Bearer " + encodedToken;
        const response = await axios.post(`${BACKEND_PREFIX}/owner/create-day-schedule`,
            date,
            {
                params: {venueId},
                headers: {
                    'Authorization': authorisationString,
                    'Content-Type': 'application/json' // need this since we are sending a string over, axios can't infer
                }
            });
        return response;
    },
    async saveDayScheduleGenerator(encodedToken, dayScheduleGenerator) {
        const authorisationString = "Bearer " + encodedToken;
        // THIS GETS OWNER OBJECT FROM BACKEND THRU THE ENCODED TOKEN
        const response = await axios.post(`${BACKEND_PREFIX}/owner/save-day-schedule-generator`,
            dayScheduleGenerator,
            {
                headers: {
                    'Authorization': authorisationString
                }
            });
        return response;

    },
    async deleteDayScheduleTemplate(encodedToken, dayScheduleTemplateId, venueId) {
        const authorisationString = "Bearer " + encodedToken;
        const response = await axios.delete(`${BACKEND_PREFIX}/owner/delete-day-schedule-template`,
            {
                params: {dayScheduleTemplateId, venueId},
                headers: {
                    'Authorization': authorisationString
                }
            });
        return response;
    },
    async cancelBooking(encodedToken, bookingId) {
        const authorisationString = "Bearer " + encodedToken;
        const response = await axios.post(`${BACKEND_PREFIX}/owner/cancel-booking`,
            null,
            {
                params: {bookingId},
                headers: {
                    'Authorization': authorisationString
                }
            });
        return response;
    }
}

export default DayScheduleAPI;