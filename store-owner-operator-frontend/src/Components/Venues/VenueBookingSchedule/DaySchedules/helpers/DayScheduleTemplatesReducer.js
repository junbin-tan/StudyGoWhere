export const dayScheduleTemplatesReducer_ACTIONS = {
    INITIALIZE_DAY_SCHEDULE_TEMPLATES: 'INITIALIZE_DAY_SCHEDULE_TEMPLATES',
    SET_DAY_SCHEDULE_TEMPLATES: 'SET_DAY_SCHEDULE_TEMPLATES',
    ADD_DAY_SCHEDULE_TEMPLATE: 'ADD_DAY_SCHEDULE_TEMPLATE',
    UPDATE_DAY_SCHEDULE_TEMPLATE: 'UPDATE_DAY_SCHEDULE_TEMPLATE',
    DELETE_DAY_SCHEDULE_TEMPLATE: 'DELETE_DAY_SCHEDULE_TEMPLATE',
    SELECT_DAY_SCHEDULE_TEMPLATE: 'SELECT_DAY_SCHEDULE_TEMPLATE',
    SET_DAY_OF_WEEK_TEMPLATES: 'SET_DAY_OF_WEEK_TEMPLATES', // payload is {mon: template1, tue: template2, ...}
    ASSIGN_TEMPLATE_TO_DAY_OF_WEEK: 'ASSIGN_TEMPLATE_TO_DAY_OF_WEEK', // payload includes dayOfWeek and dayScheduleTemplate
    REMOVE_TEMPLATE_FROM_DAY_OF_WEEK: 'REMOVE_TEMPLATE_FROM_DAY_OF_WEEK', // payload includes dayOfWeek
    ADD_AVAILABILITY_PERIOD_TO_TABLE_TYPE_DAY_AVAILABILITY: 'ADD_AVAILABILITY_PERIOD_TO_TABLE_TYPE_DAY_AVAILABILITY'
}

function sortAvailabilityPeriodsArray(apArray) {
    return apArray.slice().sort((a, b) => {
        // Convert the fromTime strings to Date objects for comparison
        const timeA = new Date(`1970-01-01 ${a.fromTime}`);
        const timeB = new Date(`1970-01-01 ${b.fromTime}`);

        return timeA - timeB;
    });
}

// const DaySchedulesTemplates = {
//     selected: sth,
//     templates: [
//         ]
// }

// The state stores 3 main things:
// 1. The selected day schedule template
// 2. The list of day schedule templates that owner/operator has saved in his acct somewhere
// 3. An object mapping dayOfWeeks (mon, tue, etc.) to day schedule templates (yes, these are duplicates of the ones in 2)
export const dayScheduleTemplatesReducer = (state, action) => {
    console.log("DAY SCHEDULE TEMPLATES REDUCER called with action: ", action);
    switch (action.type) {
        case 'INITIALIZE_DAY_SCHEDULE_TEMPLATES':
            return action.payload;
        case 'SET_DAY_SCHEDULE_TEMPLATES':
            return {selected: state.selected, templates: action.payload, dayOfWeekTemplatesObject: state.dayOfWeekTemplatesObject};
        case 'ADD_DAY_SCHEDULE_TEMPLATE':
            return {selected: state.selected, templates: [...state.templates, action.payload], dayOfWeekTemplatesObject: state.dayOfWeekTemplatesObject};
        case 'UPDATE_DAY_SCHEDULE_TEMPLATE':
            // This updates all the dayOfWeekTemplatesObject linked to it as well (should show owner warning on frontend)
            // technically we don't "need" this method as the backend would send the updated dayScheduleTemplate to the frontend
            return {selected: state.selected, templates: state.templates.map((dayScheduleTemplate) => {
                    if (dayScheduleTemplate.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return dayScheduleTemplate;
                    }
                }),
                dayOfWeekTemplatesObject: Object.keys(state.dayOfWeekTemplatesObject).map(key => {
                    if (state.dayOfWeekTemplatesObject[key].id === action.payload.id) {
                        return action.payload;
                    } else {
                        return state.dayOfWeekTemplatesObject[key];
                    }
                })
            };
        case 'DELETE_DAY_SCHEDULE_TEMPLATE':
            return {selected: state.selected, templates: state.templates.filter((dayScheduleTemplate) => {
                        return dayScheduleTemplate.id !== action.payload.id;
                    }
                ),
                dayOfWeekTemplatesObject: Object.keys(state.dayOfWeekTemplatesObject).map(key => {
                    if (state.dayOfWeekTemplatesObject[key].id === action.payload.id) {
                        return null;
                    } else {
                        return state.dayOfWeekTemplatesObject[key];
                    }
                })
            };
        case 'SELECT_DAY_SCHEDULE_TEMPLATE':
            return {selected: action.payload, templates: state.templates, dayOfWeekTemplatesObject: state.dayOfWeekTemplatesObject};
        case 'SET_DAY_OF_WEEK_TEMPLATES':
            return {selected: state.selected, templates: state.templates, dayOfWeekTemplatesObject: action.payload};
        case 'ASSIGN_TEMPLATE_TO_DAY_OF_WEEK':
            return {selected: state.selected, templates: state.templates, dayOfWeekTemplatesObject: {...state.dayOfWeekTemplatesObject, [action.payload.dayOfWeek]: action.payload.dayScheduleTemplate}};
        case 'REMOVE_TEMPLATE_FROM_DAY_OF_WEEK':
            return {selected: state.selected, templates: state.templates, dayOfWeekTemplatesObject: {...state.dayOfWeekTemplatesObject, [action.payload.dayOfWeek]: null}};

        case 'ADD_AVAILABILITY_PERIOD_TO_TABLE_TYPE_DAY_AVAILABILITY':

            const tempMappedTemplates = {selected: state.selected,
                templates: state.templates.map((dayScheduleTemplate) => {
                    return {...dayScheduleTemplate,
                        tableTypeDayAvailabilities: dayScheduleTemplate.tableTypeDayAvailabilities.map((tableTypeDayAvailability) => {
                            if (tableTypeDayAvailability.id === action.payload.tableTypeDayAvailabilityId) {
                                return {...tableTypeDayAvailability, availabilityPeriods: sortAvailabilityPeriodsArray([...tableTypeDayAvailability.availabilityPeriods, action.payload.availabilityPeriod])};
                            } else {
                                return tableTypeDayAvailability;
                            }})}
                }),
                dayOfWeekTemplatesObject: {...state.dayOfWeekTemplatesObject}

                // dayOfWeekTemplatesObject: Object.keys(state.dayOfWeekTemplatesObject).map(key => {
                //     return {...state.dayOfWeekTemplatesObject[key],
                //         tableTypeDayAvailabilities: state.dayOfWeekTemplatesObject[key].tableTypeDayAvailabilities.map((tableTypeDayAvailability) => {
                //             if (tableTypeDayAvailability.id === action.payload.tableTypeDayAvailabilityId) {
                //                 return {...tableTypeDayAvailability, availabilityPeriods: [...tableTypeDayAvailability.availabilityPeriods, action.payload.availabilityPeriod]};
                //             } else {
                //                 return tableTypeDayAvailability;
                //             }})}
            }

            Object.keys(tempMappedTemplates.dayOfWeekTemplatesObject).forEach(day => {
                tempMappedTemplates.dayOfWeekTemplatesObject[day].tableTypeDayAvailabilities.forEach((tableTypeDayAvailability) => {
                    if (tableTypeDayAvailability.id === action.payload.tableTypeDayAvailabilityId) {
                        tableTypeDayAvailability.availabilityPeriods.push(action.payload.availabilityPeriod);
                        tableTypeDayAvailability.availabilityPeriods = sortAvailabilityPeriodsArray(tableTypeDayAvailability.availabilityPeriods);
                    }
                })
            })

            const finalStateWithUpdatedSelectedTemplate = {selected: tempMappedTemplates.templates
                    .find((dayScheduleTemplate) => dayScheduleTemplate.tableTypeDayAvailabilities
                        .some(ttda => ttda.id === action.payload.tableTypeDayAvailabilityId)),
                templates: tempMappedTemplates.templates,
                dayOfWeekTemplatesObject: tempMappedTemplates.dayOfWeekTemplatesObject}

            console.log("finalStateWithUpdatedSelectedTemplate: ", finalStateWithUpdatedSelectedTemplate);
            return finalStateWithUpdatedSelectedTemplate;
        default:
            return state;
    }
}