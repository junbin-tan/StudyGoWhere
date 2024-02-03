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
import CreateAdvertisementForm from "../Components/Advertisement/CreateAdvertisementForm";
import CreateAdvertisementForm2 from "../Components/Advertisement/CreateAdvertisementForm2";
import { RiAdvertisementLine } from "react-icons/ri";

const AddAdvertisementPage = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);

  function ActiveLastBreadcrumb({}) {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            className="text-lightgray-100"
            to="/advertisements"
          >
            Home
          </Link>
          <Link
            underline="hover"
            className="text-lightgray-100"
            to="/advertisements"
          >
            Advertisements
          </Link>
          <Link
            underline="hover"
            className="text-custom-yellow"
            to="/add-advertisement"
          >
            Add Advertisement
          </Link>
        </Breadcrumbs>
      </div>
    );
  }

  return (
    <>
      <PageStructure
        icon={<RiAdvertisementLine size="2.5rem" />}
        title={"Create Advertisement"}
        breadcrumbs={<ActiveLastBreadcrumb />}
      >
        <CreateAdvertisementForm2 />
      </PageStructure>
    </>
  );
};

export default AddAdvertisementPage;
