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
import Api from "../FunctionsAndContexts/Api";
import AdvertisementSelectedDashboard from "../Components/Advertisement/AdvertisementSelectedDashboard";
import AdvertisementDetailsForm from "../Components/Advertisement/AdvertisementDetailsForm";

const ViewAdvertisementPage = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);

  const { id } = useParams();
  const [adData, setAdData] = useState(null);

  useEffect(() => {
    Api.getAdvertisementById(id, encodedToken)
      .then((response) => response.json())
      .then((data) => {
        setAdData(data);
      })
      .catch((error) => {
        console.error("Error fetching subscription type details:", error);
      });
  }, [id]);

  console.log(adData)

  function ActiveLastBreadcrumb({}) {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/advertisements">
            Home
          </Link>
          <Link underline="hover" className="text-custom-yellow" to="/advertisements">
            Advertisements
          </Link>
          
        </Breadcrumbs>
      </div>
    );
  }


  return (
    <>
      <PageStructure
        title={"Advertisement Details"}
        breadcrumbs={<ActiveLastBreadcrumb />}
      >
        <AdvertisementSelectedDashboard adData={adData}/>
        <AdvertisementDetailsForm adData={adData}/>
      </PageStructure>
    </>
  );
};

export default ViewAdvertisementPage;
