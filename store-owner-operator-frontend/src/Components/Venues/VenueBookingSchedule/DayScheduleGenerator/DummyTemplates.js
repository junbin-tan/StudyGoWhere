// THESE SHOULD MATCH THE ONES IN DummyDayOfWeekTemplates
const dummyTemplates = [
    {
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
    {
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
    }
]


export default dummyTemplates;