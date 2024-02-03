import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { Breadcrumbs, Card } from "@mui/material";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";
import FetchOwnerInfoAPI from "../FunctionsAndContexts/FetchOwnerInfoAPI";
import PageStructure from "../Components/PageStructure/PageStructure";
import { SubscriptionAPI } from "../FunctionsAndContexts/SubscriptionAPI";
import SubscriptionTypeDisplay from "../Components/SubscriptionType/SubscriptionTypeDisplay";
import { TextField, TextareaAutosize, Button } from "@mui/material";
import { NewspaperOutlined } from "@mui/icons-material";
import Api from "../FunctionsAndContexts/Api";

const Subscription = () => {
  const { id } = useParams();
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);

  const [ownerSub, setOwnerSub] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [ownerDataDetails, setOwnerDataDetails] = useState([]);
  const [nextMonthSubType, setNextMonthSubType] = useState([]);

  useEffect(() => {
    fetchSubTypes();
    fetchOwnerSub();
    fetchOwnerDetails();
  }, []);

  useEffect(() => {
    if (ownerDataDetails && ownerDataDetails.nextMonthSubcriptionTypeId) {
      fetchNextMonthSubType();
    }
  }, [ownerDataDetails]);

  const fetchSubTypes = () => {
    Api.getAllSubTypesActiveOnly(encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedSubTypes = data.map((subTypeData) => ({
            id: subTypeData.subscriptionTypeId,
            subscriptionTypeName: subTypeData.subscriptionTypeName,
            subscriptionTypePrice: subTypeData.subscriptionTypePrice,
            subscriptionTypeDuration: subTypeData.subscriptionTypeDuration,
            subscriptionTypeDetails: subTypeData.subscriptionTypeDetails,
            subscriptionTypeStatusEnum: subTypeData.subscriptionTypeStatusEnum,
            subscriptionTypeVenueLimit: subTypeData.subscriptionTypeVenueLimit,
          }));

          const sortedSubTypes = processedSubTypes.sort(
            (a, b) => a.subscriptionTypePrice - b.subscriptionTypePrice
          );
          setSubTypes(sortedSubTypes);
        } else {
          console.error("Received data is not an array:", data);
        }
      });
  };

  const fetchOwnerSub = () => {
    Api.getSubscriptionByToken(encodedToken)
      .then((response) => response.json())
      .then((data) => {
        setOwnerSub(data);
      })
      .catch((error) => {
        console.error("Error fetching owner sub details:", error);
      });
  };

  const fetchOwnerDetails = () => {
    FetchOwnerInfoAPI.getOwner(encodedToken).then((response) => {
      if (response.status == 200) {
        setOwnerDataDetails(response.data);
      }
    });
  };

  const fetchNextMonthSubType = () => {
    console.log(ownerDataDetails.nextMonthSubcriptionTypeId);
    Api.getSubscriptionTypeById(
      ownerDataDetails.nextMonthSubcriptionTypeId,
      encodedToken
    )
      .then((response) => response.json())
      .then((data) => {
        setNextMonthSubType(data);
      })
      .catch((error) => {
        console.error("Error fetching next month subtype details:", error);
      });
  };

  const handleToggleActivation = () => {
    Api.activateDeactivateAutoRenew(ownerDataDetails.userId, encodedToken).then(
      (response) => {
        if (response.ok) {
          console.log("Owner action successfully");
          fetchOwnerDetails();
          fetchNextMonthSubType();
        } else {
          console.error("Error");
        }
      }
    );
  };

  console.log(ownerSub)

  function ActiveLastBreadcrumb({}) {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/subscription">
            Home
          </Link>
          <Link
            underline="hover"
            className="text-custom-yellow"
            to="/subscription"
          >
            Subscription
          </Link>
        </Breadcrumbs>
      </div>
    );
  }

  return (
    <>
      <PageStructure
        icon={<NewspaperOutlined className="text-4xl" />}
        title={"Subscription"}
        breadcrumbs={<ActiveLastBreadcrumb />}
      >
        <div className="flex flex-row gap-10 justify-center ">
          {subTypes.map((subType, index) => (
            <SubscriptionTypeDisplay
              key={index}
              subType={subType}
              ownerSubData={ownerSub}
              fetchOwnerSub={fetchOwnerSub}
              fetchNextMonthSubType={fetchNextMonthSubType}
            />
          ))}
        </div>

        <div className="card border border-solid border-gray-300 px-5 py-8 rounded-lg shadow-lg bg-lightgray-80 ">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 xl:gap-10">
              <h2 className="text-lg font-semibold">Current Subscription</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 col-span-1 md:col-span-3 lg:col-span-3 items-center">
                <p className="col-span-1">Subscription Name</p>
                {/* <TextField
                  className="col-span-1 md:col-span-2"
                  name="subscriptionName"
                  required
                  value={ownerSub.subscriptionName}
                /> */}
                <p>{ownerSub.subscriptionName}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 col-span-1 md:col-span-3 lg:col-span-3 items-center">
                <p className="col-span-1">Subscription Start Date</p>
                {/* <TextField
                  className="col-span-1 md:col-span-2"
                  name="subscriptionPeriodStart"
                  required
                  value={ownerSub.subscriptionPeriodStart}
                /> */}
                <p>{ownerSub.subscriptionPeriodStart}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 col-span-1 md:col-span-3 lg:col-span-3 items-center">
                <p className="col-span-1">Subscription End Date</p>
                {/* <TextField
                  className="col-span-1 md:col-span-2"
                  name="subscriptionPeriodEnd"
                  required
                  value={ownerSub.subscriptionPeriodEnd}
                /> */}
                <p>{ownerSub.subscriptionPeriodEnd}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 col-span-1 md:col-span-3 lg:col-span-3 items-center">
                <p className="col-span-1">Next Month Subscription Type</p>
                {/* <TextField
                  className="col-span-1 md:col-span-2"
                  name="subscriptionPeriodEnd"
                  required
                  value={nextMonthSubType?.subscriptionTypeName || ""}
                /> */}
                <p>{nextMonthSubType?.subscriptionTypeName || ""}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 col-span-1 md:col-span-3 lg:col-span-3 items-center">
                <p className="col-span-1">Auto Renew Subscription</p>

                <Select
                  value={
                    ownerDataDetails.autoRenewSubscription
                      ? "Activate"
                      : "Deactivate"
                  }
                  onChange={(event) => {
                    handleToggleActivation();
                  }}
                  className={`text-lg font-medium rounded-lg px-3 py-2 text-center ${
                    ownerDataDetails.autoRenewSubscription
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  <MenuItem
                    value={"Activate"}
                    className="bg-green-500 text-white"
                  >
                    Activate
                  </MenuItem>
                  <MenuItem
                    value={"Deactivate"}
                    className="bg-red-500 text-white"
                  >
                    Deactivate
                  </MenuItem>
                </Select>
              </div>
            </div>
          </form>
        </div>
      </PageStructure>
    </>
  );
};

export default Subscription;
