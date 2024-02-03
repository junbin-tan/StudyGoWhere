// THESE SHOULD MATCH THE ONES IN DayOfWeekTemplates
// That is, the templates used here should be the same as the ones in DayOfWeekTemplates (subset basically)
const dummyDayOfWeekTemplates = {
    mon: {
        id: 1,
        name: "Weekday Table Availabilities",
        tableTypeDayAvailabilities: [
            // 1st TableTypeDayAvailability
            {
                id: 2,
                tableType: {
                    id: 1,
                    name: "2-seater",
                    seats: 2,
                    description: "2-seater table, bring another friend!",
                    basePrice: "0",
                    pricePerHalfHour: "5.00",
                },

                availabilityPeriods:[
                    {
                        id: 1,
                        numAvailable: 10,
                        fromTime: "10:30:00.000",
                        toTime: "14:30:00.000",
                        overrideDefaultPrice: false,
                    },
                ],

                bookings: [],
                tableTypeBookingSlots: [], // case of slots not generated yet
            },
        ]
    },
    tue: {
        id: 1,
        name: "Weekday Table Availabilities",
        tableTypeDayAvailabilities: [
            // 1st TableTypeDayAvailability
            {
                id: 2,
                tableType: {
                    id: 1,
                    name: "2-seater",
                    seats: 2,
                    description: "2-seater table, bring another friend!",
                    basePrice: "0",
                    pricePerHalfHour: "5.00",
                },

                availabilityPeriods:[
                    {
                        id: 1,
                        numAvailable: 10,
                        fromTime: "10:30:00.000",
                        toTime: "14:30:00.000",
                        overrideDefaultPrice: false,
                    },
                ],

                bookings: [],
                tableTypeBookingSlots: [], // case of slots not generated yet
            },
        ]
    },
    wed: {
        id: 1,
        name: "Weekday Table Availabilities",
        tableTypeDayAvailabilities: [
            // 1st TableTypeDayAvailability
            {
                id: 2,
                tableType: {
                    id: 1,
                    name: "2-seater",
                    seats: 2,
                    description: "2-seater table, bring another friend!",
                    basePrice: "0",
                    pricePerHalfHour: "5.00",
                },

                availabilityPeriods:[
                    {
                        id: 1,
                        numAvailable: 10,
                        fromTime: "10:30:00.000",
                        toTime: "14:30:00.000",
                        overrideDefaultPrice: false,
                    },
                ],

                bookings: [],
                tableTypeBookingSlots: [], // case of slots not generated yet
            },
        ]
    },
    thu: {
        id: 1,
        name: "Weekday Table Availabilities",
        tableTypeDayAvailabilities: [
            // 1st TableTypeDayAvailability
            {
                id: 2,
                tableType: {
                    id: 1,
                    name: "2-seater",
                    seats: 2,
                    description: "2-seater table, bring another friend!",
                    basePrice: "0",
                    pricePerHalfHour: "5.00",
                },

                availabilityPeriods:[
                    {
                        id: 1,
                        numAvailable: 10,
                        fromTime: "10:30:00.000",
                        toTime: "14:30:00.000",
                        overrideDefaultPrice: false,
                    },
                ],

                bookings: [],
                tableTypeBookingSlots: [], // case of slots not generated yet
            },
        ]
    },
    fri: {
        id: 1,
        name: "Weekday Table Availabilities",
        tableTypeDayAvailabilities: [
            // 1st TableTypeDayAvailability
            {
                id: 2,
                tableType: {
                    id: 1,
                    name: "2-seater",
                    seats: 2,
                    description: "2-seater table, bring another friend!",
                    basePrice: "0",
                    pricePerHalfHour: "5.00",
                },

                availabilityPeriods:[
                    {
                        id: 1,
                        numAvailable: 10,
                        fromTime: "10:30:00.000",
                        toTime: "14:30:00.000",
                        overrideDefaultPrice: false,
                    },
                ],

                bookings: [],
                tableTypeBookingSlots: [], // case of slots not generated yet
            },
        ]
    },
    sat: {
        id: 2,
        name: "Super Weekends",
        tableTypeDayAvailabilities: [
            // 1st TableTypeDayAvailability
            {
                id: 2,
                tableType: {
                    id: 1,
                    name: "2-seater",
                    seats: 2,
                    description: "2-seater table, bring another friend!",
                    basePrice: "0",
                    pricePerHalfHour: "5.00",
                },

                availabilityPeriods:[
                    {
                        id: 1,
                        numAvailable: 50,
                        fromTime: "10:30:00.000",
                        toTime: "14:30:00.000",
                        overrideDefaultPrice: false,
                    },
                ],

                bookings: [],
                tableTypeBookingSlots: [], // case of slots not generated yet
            },
        ]
    },
    sun: {
        id: 2,
        name: "Super Weekends",
        tableTypeDayAvailabilities: [
            // 1st TableTypeDayAvailability
            {
                id: 2,
                tableType: {
                    id: 1,
                    name: "2-seater",
                    seats: 2,
                    description: "2-seater table, bring another friend!",
                    basePrice: "0",
                    pricePerHalfHour: "5.00",
                },

                availabilityPeriods:[
                    {
                        id: 1,
                        numAvailable: 50,
                        fromTime: "10:30:00.000",
                        toTime: "14:30:00.000",
                        overrideDefaultPrice: false,
                    },
                ],

                bookings: [],
                tableTypeBookingSlots: [], // case of slots not generated yet
            },
        ]
    },

}

export default dummyDayOfWeekTemplates;