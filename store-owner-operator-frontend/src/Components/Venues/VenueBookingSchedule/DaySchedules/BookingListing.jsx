import { Accordion, AccordionSummary, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FieldLabel from "../../../CommonComponents/Form/FieldLabel";
import React, { useContext, useState } from "react";
import ButtonClassSets from "../../../../utilities/ButtonClassSets";
import ConfirmModalV2 from "../../../CommonComponents/Modal/ConfirmModalV2";
import FetchOwnerInfoAPI from "../../../../FunctionsAndContexts/FetchOwnerInfoAPI";
import { LoginTokenContext } from "../../../../FunctionsAndContexts/LoginTokenContext";
import SnackbarTopCenter from "../../../CommonComponents/Snackbar/SnackbarTopCenter";
import SnackbarContext from "../../../../FunctionsAndContexts/SnackbarContext";

export default function BookingListing({ booking, setSelectedBooking, setBookingsSideBarState}) {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const fromTime = new Date(booking.fromDateTime);
  const toTime = new Date(booking.toDateTime);
  const formattedFromTime = fromTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const formattedToTime = toTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } = useContext(SnackbarContext);

  const handleCancelBooking = () => {
    FetchOwnerInfoAPI.cancelBookingAsOwner(booking.billableId, encodedToken)
      .then((response) => {
        if (response.ok) {
          setIsConfirmModalOpen(false);
          return response.json();
        } else {
          console.error("Error:", response.status, response.statusText);
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
      })
      .then((data) => {
        console.log("Booking cancelled successfully");
        console.log("ORIGINAL BOOKING OBJECT: ", booking);
        console.log("Modifying venue schedule state with updated ttda...");
        setBookingsSideBarState((prevState) => {
            return {
                ...prevState,
              tableTypeDayAvailability: {
                  ...prevState.tableTypeDayAvailability,
                bookings: prevState.tableTypeDayAvailability.bookings.map((booking) => {
                    if (booking.billableId === data.billableId) {
                        return data;
                    } else {
                        return booking;
                    }
                })
              },
            };
        });
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
        setSnackbarMessage("Successfully cancelled booking");
      })
      .catch((error) => {
        console.error("Error:", error.message);
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage("Error cancelling booking");
      });
  };

  return (
    <>
      <div
        className="flex flex-row justify-between text-sm px-3 py-2  bg-gray-50 border border-gray-300 hover:bg-red-100"
        onMouseEnter={() => setSelectedBooking(booking)}
        onMouseLeave={() => setSelectedBooking(undefined)}
        key={booking.billableId}
      >
        <div className="flex flex-col">
          <FieldLabel>{booking.studentName}</FieldLabel>
          <p>
            {formattedFromTime} - {formattedToTime}{" "}
            {booking.bookStatus}
          </p>
        </div>

        {booking.bookStatus === "RESERVED" && (<Button
                className={ButtonClassSets.bookingTypeButton}
                onClick={() => setIsConfirmModalOpen(true)}
            >
              Cancel
            </Button>)
        }

        <ConfirmModalV2
            open={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            confirmButtonCallbackFn={handleCancelBooking}
            backButtonCallbackFn={() => setIsConfirmModalOpen(false)}
            headerText="Confirm Booking Cancellation?"
        >
          <p className="text-center font-bold">
            You are about to cancel this booking:
          </p>
          <div className="flex flex-col text-lg items-center border px-3 py-3 mb-5">
            <FieldLabel>{booking.studentName}</FieldLabel>
            <p>
              {formattedFromTime} - {formattedToTime}{" "}
            </p>
          </div>{" "}
        </ConfirmModalV2>
      </div>

      {/* <Accordion
        expanded={true}
        onChange={() => 1}
        key={booking.billableId}
        onMouseEnter={() => setSelectedBooking(booking)}
        onMouseLeave={() => setSelectedBooking(undefined)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <FieldLabel>
            {booking.studentName}
            {booking.fromDateTime} {booking.toDateTime}
          </FieldLabel>
        </AccordionSummary>
        {/*{booking.billableId}*
      </Accordion> */}
    </>
  );
}
