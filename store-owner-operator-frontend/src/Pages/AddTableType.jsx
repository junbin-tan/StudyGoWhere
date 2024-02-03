import React, { useContext, useState, useEffect } from "react";
import BodyCard from "../Components/CommonComponents/Card/BodyCard";
import PageStructure from "../Components/PageStructure/PageStructure";
import { Link, useParams } from "react-router-dom";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";

import { Breadcrumbs } from "@mui/material";
import AddTableTypeForm from "../Components/TableType/AddTableTypeForm";

// ONLY OWNWER CAN ACCESS THIS PAGE

const AddTableType = () => {
  const { id, pageName } = useParams();
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  // the || {} is to prevent the useContext from returning undefined; similar to using &&
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext) || {};
  const [thisVenue, setThisVenue] = useState(null);
  // the || {} is to prevent the useContext from returning undefined; similar to using &&

  // UseEffects to set thisVenue from ownerData/operatorData that was fetched
  useEffect(() => {
    if (ownerData && !(ownerData instanceof Promise)) {
      // flow of ownerData value is (null -> Promise -> {...ownerdata})
      // when Promise resolves, the ownerData value changes and this useEffect is triggered again
      // console.log("HELLOO ownerdata is: ", ownerData)
      // console.log(ownerData.venues)

      const extractedVenue = ownerData.venues.find((v) => v.venueId == id);
      setThisVenue(extractedVenue);
    }
  }, [ownerData]);

  function ActiveLastBreadcrumb({ name }) {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/venues">
            Home
          </Link>
          <Link underline="hover" className="text-lightgray-100" to="/venues">
            Venues
          </Link>
          <Link
            underline="hover"
            className="text-lightgray-100"
            to={`/venues/${id}`}
          >
            {name}
          </Link>
          <Link
            underline="hover"
            className="text-lightgray-100"
            to={`/venues/${id}/booking-schedule/table-types`}
            aria-current="page"
          >
            Booking Schedule
          </Link>
          <Link
            underline="hover"
            className="text-custom-yellow"
            to={`/venues/${id}/add-table-type`}
            aria-current="page"
          >
            Add New Table Type to '{name}'
          </Link>
        </Breadcrumbs>
      </div>
    );
  }
  return (
    <PageStructure
      title={"Add New Table Type"}
      breadcrumbs={<ActiveLastBreadcrumb name={thisVenue?.venueName} />}
    >
      <AddTableTypeForm />
    </PageStructure>
  );
};

export default AddTableType;
