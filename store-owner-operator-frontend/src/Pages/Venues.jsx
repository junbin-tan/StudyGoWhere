import React, { useContext, useEffect, useState } from "react";
import SideBar from "../Components/SideBar/SideBar";
import { Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";
import { VenueCard } from "../Components/Venues/VenueCard/VenueCard";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import axios from "axios";
import { BACKEND_PREFIX } from "../FunctionsAndContexts/serverPrefix";
import FetchOwnerInfoAPI from "../FunctionsAndContexts/FetchOwnerInfoAPI";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";
import PageStructure from "../Components/PageStructure/PageStructure";
import AddressMap from "../Components/Venues/AddressMap";
import { OperatorUserContext } from "../FunctionsAndContexts/OperatorUserContext";
import { FetchAndReturnUser } from "../FunctionsAndContexts/FetchAndReturnUser";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ButtonClassSets from "../utilities/ButtonClassSets";
import SearchBar from "../Components/CommonComponents/SearchBar/SearchBar";

function VenueCards({ venueData }) {
  // Map over the dummyData array and return a list of VenueCard components
  const venueCards = venueData.map((data) => (
    <VenueCard
      id={data.venueId} // Don't forget to add a unique key when mapping over an array
      key={data.venueId} // i did it here, no warnings shld pop up now - PS
      name={data.venueName}
      crowdLevel={data.venueCrowdLevel}
      status={data.venueStatus}
      isBanned={data.adminBanned}
      venueImagePath={data.displayImagePath}
    />
  ));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 gap-x-5 w-fit">
      {venueCards}
    </div>
  );
}

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb");
}
function ActiveLastBreadcrumb() {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" className="text-lightgray-100" to="/venues">
          Home
        </Link>
        <Link
          to="/venues"
          underline="hover"
          className="text-custom-yellow"
          href="/venues"
          aria-current="page"
        >
          Venues
        </Link>
      </Breadcrumbs>
    </div>
  );
}

const Venues = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext) || {};

  const [searchFilteredVenues, setSearchFilteredVenues] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    try {
      FetchAndReturnUser.owner(encodedToken).then((ownerData) => {
        setOwnerData(ownerData);
        setSearchFilteredVenues(ownerData.venues);
      });
    } catch (err) {
      console.log(err.message); // request failed somehow
    }
  }, []);

  useEffect(() => {
    setSearchFilteredVenues(
      ownerData.venues.filter((v) => v.venueName.includes(searchInput))
    );
  }, [searchInput]);

  return (
    <>
      <PageStructure
        icon={<StorefrontOutlinedIcon className="text-4xl" />}
        title={"Venues"}
        breadcrumbs={<ActiveLastBreadcrumb />}
        actionButton={
          <Link to="/add-venue">
            <button className={` ${ButtonClassSets.primary}`}>
              <AddCircleOutlineIcon /> Add New Venue
            </button>
          </Link>
        }
      >
        <SearchBar
          value={searchInput}
          name={"searchInput"}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={"Search by venue name..."}
          className={"max-w-xl"}
        />
        {ownerData.venues.length > 0 ? (
          <>
            <p className="text-sm text-gray-500">
              <span className="text-green-500">Green</span> outline indicates{" "}
              <b>ACTIVE </b>
              venue(s), <span className="text-red-500">Red </span> outline
              indicates
              <b> DEACTIVATED</b> venue(s)
            </p>
            <VenueCards venueData={searchFilteredVenues} />
          </>
        ) : (
          <>
            <p className="text-lightgray-100">
              There's nothing here... <br /> <br /> Add your first venue!
            </p>
          </>
        )}
      </PageStructure>
    </>
  );
};

export default Venues;
