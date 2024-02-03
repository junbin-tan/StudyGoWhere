import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React, { useContext, useEffect, useState } from "react";
import FetchOwnerInfoAPI from "../../../FunctionsAndContexts/FetchOwnerInfoAPI";
import { LoginTokenContext } from "../../../FunctionsAndContexts/LoginTokenContext";
import FieldLabel from "../../CommonComponents/Form/FieldLabel";

export default function VenueStatuses({ venue, isOperator }) {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const [selectedCrowdLevel, setSelectedCrowdLevel] = useState(
    venue.venueCrowdLevel
  );

  const [selectedVenueStatus, setSelectedVenueStatus] = useState(
    venue.venueStatus
  );
  useEffect(() => {
    setSelectedCrowdLevel(venue.venueCrowdLevel);
    setSelectedVenueStatus(venue.venueStatus);
  }, [venue]);

  const handleCrowdLevelChange = async (event) => {
    setSelectedCrowdLevel(event.target.value);
    try {
      await FetchOwnerInfoAPI.updateVenueCrowdLevel(
        encodedToken,
        venue.venueId,
        event.target.value
      );
    } catch (error) {
      console.error("Failed to update crowd level:", error);
    }
  };
  const handleVenueStatusChange = async (event) => {
    setSelectedVenueStatus(event.target.value);
    try {
      await FetchOwnerInfoAPI.updateVenueStatus(
        encodedToken,
        venue.venueId,
        event.target.value
      );
    } catch (error) {
      toggleErrorModal();
      console.error("Failed to update venue status:", error);
    }
  };

  const [showErrorModal, setShowErrorModal] = useState(false);

  const toggleErrorModal = () => {
    setShowErrorModal(!showErrorModal);
  };
  const VenueLimitReachedModal = ({ onClose }) => {
    const handleCloseAndRefresh = () => {
      onClose();
      window.location.reload();
    };

    return (
      <>
        <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center inset-0 z-50 bg-lightgray-80 border border-solid border-lightgray-100 px-5 py-10 rounded-lg h-64 w-fit text-center flex flex-col justify-between">
          <h3 className="font-bold text-xl text-brown-90">
            Venue Limit Reached!
          </h3>
          <p>Unable to activate venue.</p>
          <p>Please upgrade your subscription type to activate more venues.</p>

          <button
            className="bg-brown-80 px-4 py-2 w-fit rounded-md text-white hover:bg-brown-100"
            onClick={handleCloseAndRefresh}
          >
            Close
          </button>
        </div>
      </>
    );
  };
  console.log(venue.adminBanned);

  return (
    <div className="flex flex-col items-start gap-3">
      {!isOperator && (
        <div className="flex flex-col">
          <FieldLabel>Venue Status</FieldLabel>
          <Select
            value={selectedVenueStatus ?? "DEACTIVATED"}
            // ** IMPORTANT **! if we dont provide default value, it will be undefined and the select will not show anything
            // even if the component isnt mounted yet (I checked thisVenue != undefined),
            // it still complains and shows empty value on load. idk why
            onChange={handleVenueStatusChange}
            className={` px-7 w-56
             ${
               venue.adminBanned == true
                 ? "bg-gray-400 text-white"
                 : selectedVenueStatus === "DEACTIVATED"
                 ? "bg-red-500 text-white"
                 : "bg-green-500 text-white"
             }
            `}
            disabled={venue.adminBanned}
          >
            <MenuItem value={"DEACTIVATED"} className="bg-red-500 text-white">
              Deactivated
            </MenuItem>
            <MenuItem value={"ACTIVATED"} className="bg-green-500 text-white">
              Activated
            </MenuItem>
          </Select>
        </div>
      )}
      <div className="flex flex-col items-start">
        <FieldLabel>Crowd level</FieldLabel>
        <Select
          value={selectedCrowdLevel ?? "GREEN"}
          onChange={handleCrowdLevelChange}
          className={`px-7 w-56
            ${
              venue.adminBanned == true
                ? "bg-gray-400 text-white"
                : selectedCrowdLevel === "GREEN"
                ? "bg-green-500 text-white"
                : selectedCrowdLevel === "AMBER"
                ? "bg-yellow-500 text-white"
                : "bg-red-500 text-white"
            }
          `}
          disabled={venue.adminBanned}
        >
          <MenuItem
            key={"GREEN"}
            value={"GREEN"}
            className="bg-green-500 text-white"
          >
            Green
          </MenuItem>
          <MenuItem
            key={"AMBER"}
            value={"AMBER"}
            className="bg-yellow-500 text-white"
          >
            Amber
          </MenuItem>
          <MenuItem key={"RED"} value={"RED"} className="bg-red-500 text-white">
            Red
          </MenuItem>
        </Select>
      </div>
      {showErrorModal && <VenueLimitReachedModal onClose={toggleErrorModal} />}
    </div>
  );
}
