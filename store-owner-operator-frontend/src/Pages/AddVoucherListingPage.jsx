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
import CreateVoucherListingForm from "../Components/Voucher/CreateVoucherListingForm";

const AddVoucherListingPage = () => {

    const [token, setToken, encodedToken] = useContext(LoginTokenContext);
    const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);
  

  function ActiveLastBreadcrumb({}) {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/vouchers">
            Home
          </Link>
          <Link underline="hover" className="text-lightgray-100" to="/vouchers">
            Vouchers Listing
          </Link>
          <Link
            underline="hover"
            className="text-custom-yellow"
            to="/createVoucherListing"
          >
            Create New Voucher
          </Link>
        </Breadcrumbs>
      </div>
    );
  }

  return (
    <>
      <PageStructure
        title={"Create New Voucher"}
        breadcrumbs={<ActiveLastBreadcrumb />}
      >
        <CreateVoucherListingForm />
      </PageStructure>
    </>
  );
};

export default AddVoucherListingPage;
