import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import Api from "../../FunctionsAndContexts/Api";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";

const SubscriptionTypeDisplay = ({
  subType,
  ownerSubData,
  fetchOwnerSub,
  fetchNextMonthSubType,
}) => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showNextMonthModal, setShowNextMonthModal] = useState(false);
  const [showBuyConfirmationModal, setShowBuyConfirmationModal] =
    useState(false);

  console.log("this");
  console.log(ownerSubData);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleErrorModal = () => {
    setShowErrorModal(!showErrorModal);
  };

  const toggleNextMonthModal = () => {
    setShowNextMonthModal(!showNextMonthModal);
  };

  const toggleBuyConfirmModal = () => {
    setShowBuyConfirmationModal(!showBuyConfirmationModal);
  };

  const [subTypeDetails, setSubTypeDetails] = useState({
    subscriptionTypeId: "",
    subscriptionTypeName: "",
    subscriptionTypeVenueLimit: 0,
    subscriptionTypePrice: 0,
    subscriptionTypeDetails: "",
  });

  useEffect(() => {
    setSubTypeDetails({
      subscriptionTypeId: subType?.id || "",
      subscriptionTypeName: subType?.subscriptionTypeName || "",
      subscriptionTypePrice: subType?.subscriptionTypePrice || 0,
      subscriptionTypeVenueLimit: subType?.subscriptionTypeVenueLimit || 0,
      subscriptionTypeDetails: subType?.subscriptionTypeDetails || "",
    });
  }, [subType]);

  const handleBuySubscription = async () => {
    try {
      const response = await Api.buySubscriptionForSubscriptionPage(subTypeDetails, encodedToken); // Assuming tokenValue is available in this scope and subTypeDetails contains the required data

      if (response.ok) {
        fetchOwnerSub();
        toggleModal();
        fetchNextMonthSubType();
        return; // Exit the function if the response is okay
      }

      // If response is not okay, handle specific status codes
      switch (response.status) {
        case 400:
          handleSetNextMonthSubscription();
          fetchNextMonthSubType();
          toggleNextMonthModal();
          throw new Error("Bad Request.");
        case 404:
          toggleErrorModal();
          throw new Error("Resource Not Found.");
        case 500:
          throw new Error("Internal Server Error.");
        default:
          throw new Error("An unexpected error occurred.");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSetNextMonthSubscription = async () => {
    try {
      Api.setNextMonthSubscription(subTypeDetails, encodedToken);
    } catch (error) {
      console.error(error.message);
    }
  };

  // modal for buying something successfully
  const SuccessModal = ({ onClose, subscriptionName }) => {
    const handleCloseAndRefresh = () => {
      onClose();
      window.location.reload();
    };

    return (
      <>
        <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center inset-0 z-50 bg-lightgray-80 border border-solid border-lightgray-100 px-5 py-10 rounded-lg h-64 w-fit text-center flex flex-col justify-between">
          <h3 className="font-bold text-xl text-brown-90">
            Subscription successfully bought!
          </h3>
          <p>
            You've bought the{" "}
            <span className="text-teal-500 font-semibold">
              {subscriptionName}
            </span>{" "}
            subscription type.
          </p>

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

  const BuyConfirmationModal = ({ onClose, subscriptionName }) => {
    const handleConfirmBuy = async () => {
      try {
        await handleBuySubscription(); // Attempt to buy the subscription
        onClose(); // Close the modal upon success
      } catch (error) {
        console.error(error.message);
        // Optionally, handle any errors - perhaps by displaying a message to the user
      }
    };

    return (
      <>
        <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center inset-0 z-50 bg-lightgray-80 border border-solid border-lightgray-100 px-5 py-10 rounded-lg h-64 w-fit text-center flex flex-col justify-between">
          <h3 className="font-bold text-xl text-brown-90">Confirm Purchase</h3>
          <p>
            You've selected the{" "}
            <span className="text-teal-500 font-semibold">
              {subscriptionName}
            </span>{" "}
            subscription type.
          </p>
          <div className="flex flex-row gap-6">
            <button
              className="bg-green-500 px-4 py-2 w-fit rounded-md text-white hover:bg-brown-100"
              onClick={handleConfirmBuy}
            >
              Confirm
            </button>

            <button
              className="bg-red-500 px-4 py-2 w-fit rounded-md text-white hover:bg-brown-100"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </>
    );
  };

  // modal for when user dont have enough money
  const InsufficientFundModal = ({ onClose, subscriptionName }) => {
    return (
      <>
        <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center inset-0 z-50 bg-lightgray-80 border border-solid border-lightgray-100 px-5 py-10 rounded-lg h-64 w-fit text-center flex flex-col justify-between">
          <h3 className="font-bold text-xl text-brown-90">
            Insufficient Funds!
          </h3>
          <p>
            Please top up your wallet to buy{" "}
            <span className="text-teal-500 font-semibold">
              {subscriptionName}
            </span>{" "}
            subscription type.
          </p>

          <button
            className="bg-brown-80 px-4 py-2 w-fit rounded-md text-white hover:bg-brown-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </>
    );
  };

  // modal for them to set next month
  const SetNextMonthSubscriptionModal = ({ onClose, subscriptionName }) => {
    const handleCloseAndRefresh = () => {
      onClose();
      window.location.reload();
    };

    return (
      <>
        <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center inset-0 z-50 bg-lightgray-80 border border-solid border-lightgray-100 px-5 py-10 rounded-lg h-64 w-fit text-center flex flex-col justify-between">
          <h3 className="font-bold text-xl text-brown-90">
            Following month Subscription chosen!
          </h3>
          <p>
            You've selected the{" "}
            <span className="text-teal-500 font-semibold">
              {subscriptionName}
            </span>{" "}
            subscription type starting{" "}
            <span className="text-teal-500 font-semibold">next month</span>.
          </p>
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

  return (
    <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-zinc-850 justify-between border border-gray-300">
      <div>
        <h3 className="text-2xl font-medium text-center">
          {subTypeDetails.subscriptionTypeName}
        </h3>
        <div className="my-5 mt-7 text-center text-green-500 dark:text-green-500">
          <span className="text-5xl font-bold">
            ${subTypeDetails.subscriptionTypePrice}
          </span>
          <span className="text-zinc-700 font-medium">/ month</span>
        </div>
        <ul className="mt-9 space-y-2">
          <li className="flex items-center">
            <svg
              className=" text-white text-xs bg-green-500 rounded-full mr-2 p-1"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Venue limit: {subTypeDetails.subscriptionTypeVenueLimit}
          </li>
          <li className="flex items-center">
            <svg
              className=" text-white text-xs bg-green-500 rounded-full mr-2 p-1"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Description: {subTypeDetails.subscriptionTypeDetails}
          </li>
        </ul>
      </div>
      {/* <div className="mt-6 flex justify-center">
        <Button
          className={` bg-opacity-50 px-4 py-2 w-fit rounded-md text-green-500 text-lg font-medium border border-solid border-green-500 hover:bg-green-500 hover:text-white`}
          onClick={toggleBuyConfirmModal}
        >
          Buy Subscription
        </Button>
      </div> */}
      <div className="flex flex-col justify-center mt-5">
        

        <div className="flex justify-center">
          <Button
            className={`bg-opacity-50 px-4 py-2 w-fit rounded-md text-lg font-medium border border-solid hover:bg-green-500 hover:text-white ${
              ownerSubData.originalSubscriptionTypeId ===
              subTypeDetails.subscriptionTypeId
                ? "text-white bg-green-500 "
                : "text-green-500  border-green-500"
            }`}
            onClick={toggleBuyConfirmModal}
            // disabled={
            //   ownerSubData.originalSubscriptionTypeId ===
            //   subTypeDetails.subscriptionTypeId
            // }
          >
            {ownerSubData.originalSubscriptionTypeId ===
            subTypeDetails.subscriptionTypeId
              ? "Current Plan"
              : "Buy Subscription"}
          </Button>
        </div>
      </div>

      {showModal && (
        <SuccessModal
          onClose={toggleModal}
          subscriptionName={subTypeDetails.subscriptionTypeName}
        />
      )}
      {showErrorModal && (
        <InsufficientFundModal
          onClose={toggleErrorModal}
          subscriptionName={subTypeDetails.subscriptionTypeName}
        />
      )}

      {showNextMonthModal && (
        <SetNextMonthSubscriptionModal
          onClose={toggleNextMonthModal}
          subscriptionName={subTypeDetails.subscriptionTypeName}
        />
      )}
      {showBuyConfirmationModal && (
        <BuyConfirmationModal
          onClose={toggleBuyConfirmModal}
          subscriptionName={subTypeDetails.subscriptionTypeName}
        />
      )}
    </div>
  );
};

export default SubscriptionTypeDisplay;
