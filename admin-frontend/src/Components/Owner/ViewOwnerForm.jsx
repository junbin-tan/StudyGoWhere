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
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Helpers/Api";
import useEncodedToken from "../../Helpers/useEncodedToken";

const ViewOwnerForm = ({ owner }) => {
  const { encodedToken } = useEncodedToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const [subscription, setSubscription] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState([]);


  const [ownerDetails, setOwnerDetails] = useState({
    id: "",
    name: "",
    email: "",
    username: "",
    subscription: "",
    enabled: "",
    currentSubscriptionId: "",
  });

  useEffect(() => {
    setLoading(true); // Set loading to true at the start of useEffect

    setOwnerDetails({
      id: owner?.userId || "",
      name: owner?.name || "",
      email: owner?.email || "",
      username: owner?.username || "",
      subscription: owner?.subscription || "",
      enabled: owner?.enabled || false,
      currentSubscriptionId: owner?.currentSubscriptionId || "",
    });
    if (owner?.subscription) {
      setSubscription(owner.subscription);
      
      const matchedSubscription = owner.subscription.find(sub => sub.billableId === owner.currentSubscriptionId);
      
      if (matchedSubscription) {
        setCurrentSubscription(matchedSubscription);
      }
    }

    setLoading(false); 
  }, [owner]);


  console.log(currentSubscription)

  if (loading) {
    return <div>Loading...</div>; 
  }



  const handleToggleActivation = async () => {
    Api.activateDeactivateOwner(ownerDetails.id, encodedToken).then((response) => {
      if (response.ok) {
        setOpenSnackbar(true);
        setSnackbarMessage("Owner details has been updated");
        console.log("Owner action successfully");
        fetchOwner()
      } else {
        console.error("Error");
      }
    });
  };
  console.log(ownerDetails);


  const fetchOwner = () => {
    Api.getOwnerById(ownerDetails.id, encodedToken)
      .then((response) => response.json())
      .then((data) => {
        setOwnerDetails({
          id: data?.userId || "",
          name: data?.name || "",
          email: data?.email || "",
          username: data?.username || "",
          subscription: data?.subscription || "",
          enabled: data?.enabled || false,
        });
      })
      .catch((error) => {
        console.error("Error fetching owner details:", error);
      });
  };

  return (
    <div>
      <div className="w-screen rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            <span className="text-gray-700">{ownerDetails?.name || ""}</span>
          </h1>

          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium ">
              Owner Name
            </label>
            <input
              type="text"
              name="name"
              value={ownerDetails.name}
              className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400  sm:text-sm rounded-lg block w-full p-2.5 "
              placeholder=""
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium ">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={ownerDetails.email}
              className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder=""
              required
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium "
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={ownerDetails.username}
              className=" bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              required
            />
          </div>

          <div>
            <label
              htmlFor="subscription"
              className="block mb-2 text-sm font-medium "
            >
              Subscription
            </label>
            <input
              type="text"
              name="subscription"
              placeholder="No Subscription"
              value={currentSubscription.subscriptionName}
              className=" bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              required
            />
          </div>
          <div>
            <label
              htmlFor="subscriptionEnDate"
              className="block mb-2 text-sm font-medium "
            >
              Subscription End Date
            </label>
            <input
              type="text"
              name="subscription"
              placeholder="No Subscription"
              value={currentSubscription.subscriptionPeriodEnd}
              className=" bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              required
            />
          </div>

          <div>
            <label
              htmlFor="enabled"
              className="block mb-2 text-sm font-medium "
            >
              Enabled
            </label>
            <input
              type="text"
              name="enabled"
              placeholder="False"
              value={ownerDetails.enabled}
              className=" bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              required
            />
          </div>

          <div className="flex justify-end">
            {ownerDetails.enabled ? (
              <button
                onClick={handleToggleActivation}
                className="bg-red-400 hover:bg-red-500 text-white font-medium rounded-lg text-sm px-3 py-2 text-center"
              >
                Deactivate
              </button>
            ) : (
              <button
                onClick={handleToggleActivation}
                className="bg-green-400 hover:bg-green-500 text-white font-medium rounded-lg text-sm px-3 py-2 text-center"
              >
                Activate
              </button>
            )}
          </div>
        </div>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default ViewOwnerForm;
