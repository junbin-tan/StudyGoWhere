import {v4 as uuidv4} from "uuid";
function sortAvailabilityPeriodsArray(apArray) {
    return apArray.slice().sort((a, b) => {
        // Convert the fromTime strings to Date objects for comparison
        const timeA = new Date(`1970-01-01 ${a.fromTime}`);
        const timeB = new Date(`1970-01-01 ${b.fromTime}`);

        return timeA - timeB;
    });
}

function syncOtherObjectsWithTemplates(venueSchedule) {
    venueSchedule = {...venueSchedule} // make shallow copy
    const dayScheduleTemplates = venueSchedule.dayScheduleTemplates;
    const syncedDayScheduleGenerator = venueSchedule.dayScheduleGenerator;
    let syncedSelectedTemplate = venueSchedule.selectedTemplate;

    console.log("start of sync generator: ", syncedDayScheduleGenerator);
    // Loop through each day of the week
    daysOfWeek.forEach((dayOfWeek) => {
        // Find the matching dayScheduleTemplate
        if (syncedDayScheduleGenerator[dayOfWeek] == null) {
            return;
        }
        const matchingTemplate = dayScheduleTemplates.find(
            (template) => template.id === syncedDayScheduleGenerator[dayOfWeek].id
        );

        // If a matching template is found, update the dayScheduleGenerator
        if (matchingTemplate) {
            console.log("conducting replacement, before: ", syncedDayScheduleGenerator)
            syncedDayScheduleGenerator[dayOfWeek] = matchingTemplate;
            console.log("conducted replacement, after: ", syncedDayScheduleGenerator)
        }
    });
    console.log("end of sync generator: ", syncedDayScheduleGenerator);

    if (syncedSelectedTemplate != null) {
        const matchingTemplate = dayScheduleTemplates.find(
            (template) => template.id === syncedSelectedTemplate.id
        );
        if (matchingTemplate) {
            syncedSelectedTemplate = matchingTemplate;
        }
    }

    venueSchedule.dayScheduleGenerator = syncedDayScheduleGenerator;
    venueSchedule.selectedTemplate = syncedSelectedTemplate;

    return venueSchedule;
}
// We make this store the entire VenueSchedule object PLUS one additional "selected" prop.
// this prop can easily be removed when sending up to backend

// Difference between Create and Add: CREATE is creating a new empty/default obj, ADD is for AvailabilityPeriod where most fields are filled out alrd
const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

// REDUCER STATE KEYS:
// selectedDaySchedule
// selectedTemplate
// daySchedules
// dayScheduleTemplates
// dayScheduleGenerator

export const venueScheduleReducer = (state, action) => {
    console.log("VENUE SCHEDULE REDUCER called with action: ", action);
    switch (action.type) {
        case 'SET_VENUE_SCHEDULE': // automatically sorts all the availability periods received from backend
            const venueSchedule = action.payload;
            venueSchedule.dayScheduleTemplates.forEach(template => {
                template.tableTypeDayAvailabilities.forEach(ttda => {
                    ttda.availabilityPeriods = sortAvailabilityPeriodsArray(ttda.availabilityPeriods);
                })
            });

            const newVenueSchedule = syncOtherObjectsWithTemplates(venueSchedule);
            console.log("RETURNING VENUE SCHEDULE: ", newVenueSchedule)
            return newVenueSchedule;
        case 'SET_DAY_SCHEDULE_TEMPLATES':
            return {...state, dayScheduleTemplates: action.payload};
        case 'ADD_AVAILABILITY_PERIOD_TO_TABLE_TYPE_DAY_AVAILABILITY': //payload: {tableTypeDayAvailabilityId, availabilityPeriod, isTemplate}

            if (action.payload.isTemplate) {const tempState = {...state, dayScheduleTemplates: state.dayScheduleTemplates.map((dst) => {
                        return {
                            ...dst, tableTypeDayAvailabilities: dst.tableTypeDayAvailabilities.map((ttda) => {
                                if (ttda.id === action.payload.tableTypeDayAvailabilityId) {
                                    return {
                                        ...ttda,
                                        availabilityPeriods: sortAvailabilityPeriodsArray([...ttda.availabilityPeriods, action.payload.availabilityPeriod])
                                    };
                                } else {
                                    return ttda;
                                }
                            })
                        }
                    })
                }
                const niuVenueSchedule = syncOtherObjectsWithTemplates(tempState);
                console.log("niuVenueSchedule (for some reason i cant name it newVenueSchedule)", niuVenueSchedule)
                return niuVenueSchedule;
            } else {
                return {
                    ...state, selectedDaySchedule: {
                        ...state.selectedDaySchedule, tableTypeDayAvailabilities: state.selectedDaySchedule.tableTypeDayAvailabilities.map((ttda) => {
                            if (ttda.id === action.payload.tableTypeDayAvailabilityId) {
                                return {
                                    ...ttda,
                                    availabilityPeriods: sortAvailabilityPeriodsArray([...ttda.availabilityPeriods, action.payload.availabilityPeriod])
                                };
                            } else {
                                return ttda;
                            }
                        })
                    }
                }
            }

        case 'EDIT_AVAILABILITY_PERIOD_TO_TABLE_TYPE_DAY_AVAILABILITY': //payload: {tableTypeDayAvailabilityId, availabilityPeriod, isTemplate}

            if (action.payload.isTemplate) {const tempState = {...state, dayScheduleTemplates: state.dayScheduleTemplates.map((dst) => {
                    return {
                        ...dst, tableTypeDayAvailabilities: dst.tableTypeDayAvailabilities.map((ttda) => {
                            if (ttda.id === action.payload.tableTypeDayAvailabilityId) {
                                return {
                                    ...ttda,
                                    availabilityPeriods: sortAvailabilityPeriodsArray(ttda.availabilityPeriods.map(ap => {
                                        if (ap.id === action.payload.availabilityPeriod.id) {
                                            return action.payload.availabilityPeriod;
                                        } else {
                                            return ap;
                                        }
                                    }))
                                };
                            } else {
                                return ttda;
                            }
                        })
                    }
                })
            }
                const niuVenueSchedule = syncOtherObjectsWithTemplates(tempState);
                console.log("niuVenueSchedule (for some reason i cant name it newVenueSchedule)", niuVenueSchedule)
                return niuVenueSchedule;
            } else {
                return {
                    ...state, selectedDaySchedule: {
                        ...state.selectedDaySchedule, tableTypeDayAvailabilities: state.selectedDaySchedule.tableTypeDayAvailabilities.map((ttda) => {
                            if (ttda.id === action.payload.tableTypeDayAvailabilityId) {
                                return {
                                    ...ttda,
                                    availabilityPeriods: sortAvailabilityPeriodsArray(ttda.availabilityPeriods.map(ap => {
                                        if (ap.id === action.payload.availabilityPeriod.id) {
                                            return action.payload.availabilityPeriod;
                                        } else {
                                            return ap;
                                        }
                                    }))
                                };
                            } else {
                                return ttda;
                            }
                        })
                    }
                }
            }
        case 'DELETE_AVAILABILITY_PERIOD_FROM_TABLE_TYPE_DAY_AVAILABILITY': //payload: {tableTypeDayAvailabilityId, availabilityPeriod, isTemplate}

            if (action.payload.isTemplate) {const tempState = {...state, dayScheduleTemplates: state.dayScheduleTemplates.map((dst) => {
                    return {
                        ...dst, tableTypeDayAvailabilities: dst.tableTypeDayAvailabilities.map((ttda) => {
                            if (ttda.id === action.payload.tableTypeDayAvailabilityId) {
                                return {
                                    ...ttda,
                                    availabilityPeriods: sortAvailabilityPeriodsArray(ttda.availabilityPeriods
                                        .filter(ap => ap.id !== action.payload.availabilityPeriod.id))
                                };
                            } else {
                                return ttda;
                            }
                        })
                    }
                })
            }
                const niuVenueSchedule = syncOtherObjectsWithTemplates(tempState);
                console.log("niuVenueSchedule (for some reason i cant name it newVenueSchedule)", niuVenueSchedule)
                return niuVenueSchedule;
            } else {
                return {
                    ...state, selectedDaySchedule: {
                        ...state.selectedDaySchedule, tableTypeDayAvailabilities: state.selectedDaySchedule.tableTypeDayAvailabilities.map((ttda) => {
                            if (ttda.id === action.payload.tableTypeDayAvailabilityId) {
                                return {
                                    ...ttda,
                                    availabilityPeriods: sortAvailabilityPeriodsArray(ttda.availabilityPeriods
                                        .filter(ap => ap.id !== action.payload.availabilityPeriod.id))
                                };
                            } else {
                                return ttda;
                            }
                        })
                    }
                }
            }
        case 'CREATE_NEW_TTDA': // payload: {dayScheduleTemplateId, tableType, isTemplate} OR {dayScheduleId, tableType, isTemplate}
            // can refactor to remove isTemplate later
            const newVenueSchedule3 = {...state}
            console.log("Create TTDA, variables like payload: ", action.payload)
            if (action.payload.isTemplate) {
                const newTTDA = {id: "TEMP" + uuidv4(), tableType: action.payload.tableType, availabilityPeriods: [], bookings: []};
                newVenueSchedule3.dayScheduleTemplates = newVenueSchedule3.dayScheduleTemplates.map((dst) => {
                    if (dst.id === action.payload.dayScheduleTemplateId) {
                        return {...dst, tableTypeDayAvailabilities: [...dst.tableTypeDayAvailabilities, newTTDA]};
                    } else {
                        return dst;
                    }
                });
                return syncOtherObjectsWithTemplates(newVenueSchedule3);
            } else {
                const newTTDA = {id: "TEMP" + uuidv4(), tableType: action.payload.tableType, availabilityPeriods: [], bookings: []};
                newVenueSchedule3.selectedDaySchedule = {...newVenueSchedule3.selectedDaySchedule, tableTypeDayAvailabilities: [...newVenueSchedule3.selectedDaySchedule.tableTypeDayAvailabilities, newTTDA]};
                // actually no need to update the daySchedules array since we are only updating 1 at a time
                // newVenueSchedule3.daySchedules = newVenueSchedule3.daySchedules.map((ds) => {
                //     if (ds.id === action.payload.dayScheduleId) {
                //         return newVenueSchedule3.selectedDaySchedule;
                //     } else {
                //         return ds;
                //     }
                // });

                return newVenueSchedule3
            }


        // case 'CREATE_DAY_SCHEDULE_TEMPLATE': // no payload
        //     return {...state, dayScheduleTemplates: [...state.dayScheduleTemplates,
        //             {id: null, name: "New Template", tableTypeDayAvailabilities: []}]};

        case 'DELETE_TTDA': //payload: {tableTypeDayAvailabilityId, isTemplate)
            if (action.payload.isTemplate) {const tempState = {...state, dayScheduleTemplates: state.dayScheduleTemplates.map((dst) => {
                    return {
                        ...dst, tableTypeDayAvailabilities: dst.tableTypeDayAvailabilities.filter((ttda) => {
                            return ttda.id !== action.payload.tableTypeDayAvailabilityId;
                        })
                    }
                })
            }
                const niuVenueSchedule = syncOtherObjectsWithTemplates(tempState);
                console.log("niuVenueSchedule (for some reason i cant name it newVenueSchedule)", niuVenueSchedule)
                return niuVenueSchedule;
            } else {
                return {
                    ...state, selectedDaySchedule: {
                        ...state.selectedDaySchedule, tableTypeDayAvailabilities: state.selectedDaySchedule.tableTypeDayAvailabilities
                            .filter((ttda) => {
                                return ttda.id !== action.payload.tableTypeDayAvailabilityId;
                        })
                    }
                }
            }
        case 'UPDATE_STATE_WITH_RESPONSE_DATA_(DS_OR_DST)': // payload: {daySchedule, isTemplate}
            const newVenueSchedule4 = {...state}
            // cannot use Arrays.push() because it mutates the original array and react calls each fn twice
            if (action.payload.isTemplate) {
                newVenueSchedule4.dayScheduleTemplates = [...newVenueSchedule4.dayScheduleTemplates, action.payload.daySchedule];
                newVenueSchedule4.selectedTemplate = action.payload.daySchedule;
            } else {
                newVenueSchedule4.daySchedules = [...newVenueSchedule4.daySchedules, action.payload.daySchedule];
                newVenueSchedule4.selectedDaySchedule = action.payload.daySchedule;
            }
            return newVenueSchedule4; // should be ok since we are adding and no need sync

        case 'SELECT_DAY_SCHEDULE_TEMPLATE': // payload: scheduleTemplate
            return {...state, selectedTemplate: action.payload};
        case 'SELECT_DAY_SCHEDULE':
            return {...state, selectedDaySchedule: action.payload};
        case 'SAVE_DAY_SCHEDULE': // payload: daySchedule (this is not make any REST call btw)
            return {...state, selectedDaySchedule: action.payload,
                daySchedules: state.daySchedules.map(ds => {
                    if (ds.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return ds;
                    }
                })};
        case 'SAVE_TTDA_BOOKING': // payload: tableTypeDayAvailability
            return {...state, selectedDaySchedule: {
                    ...state.selectedDaySchedule, tableTypeDayAvailabilities: state.selectedDaySchedule
                        .tableTypeDayAvailabilities.map(ttda => {
                            return {...ttda, bookings: ttda.bookings.map(b => {
                                    if (b.billableId == action.payload.billableId) {
                                        return action.payload;
                                    } else {
                                        return b;
                                    }
                                })}
                        })
                }}
        case 'SAVE_DAY_SCHEDULE_TEMPLATE': // payload: dayScheduleTemplate
            return {...state, selectedTemplate: action.payload,
                dayScheduleTemplates: state.dayScheduleTemplates.map(dst => {
                    if (dst.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return dst;
                    }
                }),
                dayScheduleGenerator: {
                    ...state.dayScheduleGenerator,
                    mon: state.dayScheduleGenerator.mon?.id === action.payload.id ? action.payload : state.dayScheduleGenerator.mon,
                    tue: state.dayScheduleGenerator.tue?.id === action.payload.id ? action.payload : state.dayScheduleGenerator.tue,
                    wed: state.dayScheduleGenerator.wed?.id === action.payload.id ? action.payload : state.dayScheduleGenerator.wed,
                    thu: state.dayScheduleGenerator.thu?.id === action.payload.id ? action.payload : state.dayScheduleGenerator.thu,
                    fri: state.dayScheduleGenerator.fri?.id === action.payload.id ? action.payload : state.dayScheduleGenerator.fri,
                    sat: state.dayScheduleGenerator.sat?.id === action.payload.id ? action.payload : state.dayScheduleGenerator.sat,
                    sun: state.dayScheduleGenerator.sun?.id === action.payload.id ? action.payload : state.dayScheduleGenerator.sun,
                }
            };
        case 'SAVE_DAY_SCHEDULE_GENERATOR': // payload: dayScheduleGenerator
            return {...state, dayScheduleGenerator: action.payload};

        // might not need this, can just use response from server
        case 'DELETE_DAY_SCHEDULE_TEMPLATE': // payload: dayScheduleTemplate
            return {...state, selectedTemplate: undefined,
                dayScheduleTemplates: state.dayScheduleTemplates.filter(dst => dst.id !== action.payload.id),
                dayScheduleGenerator: {
                    ...state.dayScheduleGenerator,
                    mon: state.dayScheduleGenerator.mon?.id === action.payload.id ? null : state.dayScheduleGenerator.mon,
                    tue: state.dayScheduleGenerator.tue?.id === action.payload.id ? null : state.dayScheduleGenerator.tue,
                    wed: state.dayScheduleGenerator.wed?.id === action.payload.id ? null : state.dayScheduleGenerator.wed,
                    thu: state.dayScheduleGenerator.thu?.id === action.payload.id ? null : state.dayScheduleGenerator.thu,
                    fri: state.dayScheduleGenerator.fri?.id === action.payload.id ? null : state.dayScheduleGenerator.fri,
                    sat: state.dayScheduleGenerator.sat?.id === action.payload.id ? null : state.dayScheduleGenerator.sat,
                    sun: state.dayScheduleGenerator.sun?.id === action.payload.id ? null : state.dayScheduleGenerator.sun,
                }
            }
        default:
            return state;

    }

}