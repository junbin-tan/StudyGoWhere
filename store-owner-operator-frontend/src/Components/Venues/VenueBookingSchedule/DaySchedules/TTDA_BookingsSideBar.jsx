import {
  AnimatePresence,
  motion,
  useAnimate,
  useAnimation,
  useInView,
  usePresence,
} from "framer-motion";
import TextClassSets from "../../../../utilities/TextClassSets";
import ButtonClassSets from "../../../../utilities/ButtonClassSets";
import React, { useEffect } from "react";
import { Button } from "@mui/material";
import BookingListing from "./BookingListing";
import FieldInfo from "../../../CommonComponents/Form/FieldInfo";

const dummyData = {
  id: 14,
  availabilityPeriods: [
    {
      id: 36,
      numAvailable: 12,
      fromTime: "00:30:00",
      toTime: "02:30:00",
      overrideDefaultPrice: false,
      basePrice: 33.0,
      pricePerHalfHour: 0.0,
    },
    {
      id: 37,
      numAvailable: 0,
      fromTime: "05:30:00",
      toTime: "08:00:00",
      overrideDefaultPrice: false,
      basePrice: 0.0,
      pricePerHalfHour: 0.0,
    },
    {
      id: 38,
      numAvailable: 55,
      fromTime: "11:30:00",
      toTime: "16:00:00",
      overrideDefaultPrice: false,
      basePrice: 0.0,
      pricePerHalfHour: 0.0,
    },
  ],
  tableType: {
    id: 3,
    name: "MyTable",
    description: "very fun table",
    basePrice: 20.0,
    pricePerHalfHour: 5.0,
    seats: 5,
    deleted: false,
  },
  bookings: [
    {
      billableId: 9,
      billableName: "Booking at a on 2023-11-15 from 00:30 to 01:30",
      billablePrice: 30.0,
      bookStatus: "RESERVED",
      fromDateTime: "2023-11-15T00:30:00",
      studentName: "testName",
      toDateTime: "2023-11-15T01:30:00",
    },
    {
      billableId: 10,
      billableName: "Booking at a on 2023-11-15 from 00:30 to 01:30",
      billablePrice: 30.0,
      bookStatus: "RESERVED",
      fromDateTime: "2023-11-15T00:30:00",
      studentName: "testName",
      toDateTime: "2023-11-15T01:30:00",
    },
    {
      billableId: 14,
      billableName: "Booking at foobar on 2023-11-17 from 04:00 to 05:00",
      billablePrice: 30.0,
      bookStatus: "RESERVED",
      fromDateTime: "2023-11-17T04:00:00",
      toDateTime: "2023-11-17T05:00:00",
      venueId: 15,
      studentName: "testName",
      label: "Booking at foobar",
    },
  ],
  tableTypeBookingSlots: [
    {
      id: 401,
      fromDateTime: "2023-11-15T01:30:00",
      toDateTime: "2023-11-15T02:00:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 12,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 402,
      fromDateTime: "2023-11-15T02:00:00",
      toDateTime: "2023-11-15T02:30:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 12,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 403,
      fromDateTime: "2023-11-15T05:30:00",
      toDateTime: "2023-11-15T06:00:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 0,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 404,
      fromDateTime: "2023-11-15T06:00:00",
      toDateTime: "2023-11-15T06:30:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 0,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 405,
      fromDateTime: "2023-11-15T06:30:00",
      toDateTime: "2023-11-15T07:00:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 0,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 406,
      fromDateTime: "2023-11-15T07:00:00",
      toDateTime: "2023-11-15T07:30:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 0,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 407,
      fromDateTime: "2023-11-15T07:30:00",
      toDateTime: "2023-11-15T08:00:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 0,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 408,
      fromDateTime: "2023-11-15T11:30:00",
      toDateTime: "2023-11-15T12:00:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 55,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 409,
      fromDateTime: "2023-11-15T12:00:00",
      toDateTime: "2023-11-15T12:30:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 55,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 410,
      fromDateTime: "2023-11-15T12:30:00",
      toDateTime: "2023-11-15T13:00:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 55,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 411,
      fromDateTime: "2023-11-15T13:00:00",
      toDateTime: "2023-11-15T13:30:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 55,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 412,
      fromDateTime: "2023-11-15T13:30:00",
      toDateTime: "2023-11-15T14:00:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 55,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 413,
      fromDateTime: "2023-11-15T14:00:00",
      toDateTime: "2023-11-15T14:30:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 55,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 414,
      fromDateTime: "2023-11-15T14:30:00",
      toDateTime: "2023-11-15T15:00:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 55,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 415,
      fromDateTime: "2023-11-15T15:00:00",
      toDateTime: "2023-11-15T15:30:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 55,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 416,
      fromDateTime: "2023-11-15T15:30:00",
      toDateTime: "2023-11-15T16:00:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 55,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 399,
      fromDateTime: "2023-11-15T00:30:00",
      toDateTime: "2023-11-15T01:00:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 10,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
    {
      id: 400,
      fromDateTime: "2023-11-15T01:00:00",
      toDateTime: "2023-11-15T01:30:00",
      tableTypeId: 3,
      tableTypeName: "MyTable",
      tablesAvailable: 10,
      slotBasePrice: 20.0,
      slotPricePerHalfHour: 5.0,
    },
  ],
};

// TTDA is short for TableTypeDayAvailability
export default function TTDA_BookingsSideBar({
  bookingsSideBarState,
  setBookingsSideBarState,
  setSelectedBooking,
}) {
  const tableTypeDayAvailability =
    bookingsSideBarState.tableTypeDayAvailability;
  //   const tableTypeDayAvailability = dummyData;

  return (
    // making my own non-modal Popper here, MUI's is slightly confusing, too many props to study
    // motion.div is just in case we wanna add animation, right now i havent figured it out yet
    <div
      key={"TTDA_BookingsSideBar"}
      className={"absolute w-1/4 h-full bg-yellow-100 "}
      //   initial={{ opacity: 0 }}
      //   animate={{ opacity: 100 }}
      //   exit={{ opacity: 0 }}
      //   style={{ zIndex: 50 }}
    >
      {tableTypeDayAvailability && (
        <div className={"flex flex-col "}>
          <div
            className={
              "flex flex-row justify-between items-center px-3 py-2 bg-white border border-gray-300 "
            }
          >
            <div className="flex flex-col gap-0 ">
              <p className="font-bold">
                {tableTypeDayAvailability.tableType.name}
              </p>
              <FieldInfo>
                Bookings for the day: {tableTypeDayAvailability.bookings.length}
              </FieldInfo>
            </div>

            <Button
              className={ButtonClassSets.bookingTypeButton}
              onClick={() => {
                setBookingsSideBarState((prev) => {
                  return {
                    ...prev,
                    isOpen: false,
                    tableTypeDayAvailability: undefined,
                  };
                });
              }}
            >
              {" "}
              Back
            </Button>
          </div>

          <div className={"flex flex-col"}>
            {tableTypeDayAvailability.bookings.map((booking) => {
              return (
                <BookingListing
                  booking={booking}
                  setSelectedBooking={setSelectedBooking}
                  setBookingsSideBarState={setBookingsSideBarState}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>

    // <Dialog open={true} className={"absolute w-1/4 h-full " +
    //     "bg-amber-100 " +
    //     "border-4 border-amber-950" +
    //     ""}
    //
    //      style={{zIndex: 50}}>
    //     {tableTypeDayAvailability.tableType.name}
    //     {tableTypeDayAvailability.tableType.description}
    // </Dialog>
  );
}

export const MemoizedTTDA_BookingsSideBar = React.memo(TTDA_BookingsSideBar);
