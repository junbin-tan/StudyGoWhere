import {AnimatePresence, motion} from "framer-motion";
import {useState} from "react";
import ButtonClassSets from "../../../../utilities/ButtonClassSets";

export default function DayOfWeekTemplatesContainerEXPERIMENT({dayOfWeekTemplates}) {

    const dummyDayOfWeekTemplates = {
        mon: {
            id: 1,
            name: "Monday",
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
            id: 2,
            name: "Super Tuesdays",
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

    }

    const enterExitVariants = {
        enter: (direction) => {
            return {
                zIndex: -10,
                x: direction > 0 ? 1000 : -1000,
                opacity: 0
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => {
            return {
                zIndex: -10,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0
            };
        }
    };

    const [selectedDayNum, setSelectedDayNum] = useState(0)
    const [selectedDayOfWeekTemplate, setSelectedDayOfWeekTemplate] = useState(dummyDayOfWeekTemplates.mon)
    const [direction, setDirection] = useState(0)
    function numberToDayOfWeek(number) {
        const daysOfWeek = ["mon", "tue", "ted", "thu", "fri", "sat", "sun"];

        if (number >= 0 && number < daysOfWeek.length) {
            return daysOfWeek[number];
        } else {
            return "Invalid day";
        }
    }


    return (
        <div style={{background: "red", position: "relative"}}>

            <button
                className={ButtonClassSets.primary}
                onClick={() => {
                    setDirection(-1);
                setSelectedDayNum(prev => {
                    return prev === 0 ? 6 : prev - 1;
                });
                setSelectedDayOfWeekTemplate(dummyDayOfWeekTemplates[numberToDayOfWeek(selectedDayNum - 1)]);
            }}>
                Previous day
            </button>

            <button
                className={ButtonClassSets.primary}
                onClick={() => {
                    setDirection(1);
                setSelectedDayNum(prev => {
                    return prev === 6 ? 0 : prev + 1;
                });
                setSelectedDayOfWeekTemplate(dummyDayOfWeekTemplates[numberToDayOfWeek(selectedDayNum + 1)]);
            }}>
                Next day
            </button>

            <div style={{position: "relative", width: "100%", height: "500px", background: "yellow"}}>
            <AnimatePresence>
                <motion.div key={selectedDayOfWeekTemplate.id}
                            variants={enterExitVariants}
                            custom={direction}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { duration: 5 },
                                opacity: { duration: 5 }
                            }}
                            style={{background:"blue", position: "absolute", height: "100%"}}
                >

                    <p>{selectedDayOfWeekTemplate.name}</p>
                </motion.div>

            </AnimatePresence>
            </div>

        </div>
    )
}