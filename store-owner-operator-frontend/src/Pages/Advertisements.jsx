import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs, Card } from "@mui/material";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";
import FetchOwnerInfoAPI from "../FunctionsAndContexts/FetchOwnerInfoAPI";
import Api from "../FunctionsAndContexts/Api";
import PageStructure from "../Components/PageStructure/PageStructure";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import CreateAdvertisementForm from "../Components/Advertisement/CreateAdvertisementForm";
import AdvertisementDropDownButton from "../Components/Advertisement/AdvertisementDropDownButton";
import ButtonClassSets from "../utilities/ButtonClassSets";
import FieldInfo from "../Components/CommonComponents/Form/FieldInfo";
import { RiAdvertisementLine } from "react-icons/ri";

const Advertisements = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);

  console.log(ownerData.venues.length);

  // for add advert
  const navigate = useNavigate();

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
            className="text-custom-yellow"
            to="/advertisements"
          >
            Advertisements
          </Link>
        </Breadcrumbs>
      </div>
    );
  }

  const [advertisements, setAdvertisements] = useState([]);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = () => {
    Api.getAllAdvertisements(encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedAdvert = data.map((adData) => ({
            id: adData.billableId,
            name: adData.name,
            billablePrice: adData.billablePrice,
            image: adData.image,
            description: adData.description,
            startDate: adData.startDate,
            endDate: adData.endDate,
            adCreatorUsername: adData.adCreatorUsername,
            costPerImpression: adData.costPerImpression,
            impressionsLeft: adData.impressionsLeft,
            budgetLeft: adData.budgetLeft,
            impressionCount: adData.impressionCount,
            reachCount: adData.reachCount,
            advertisementStatus: adData.advertisementStatus,
            rejectionReason: adData.rejectionReason,
          }));
          setAdvertisements(processedAdvert);
        } else {
          console.error("Received data is not an array:", data);
        }
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Title",
      width: 140,
      cellClassName: "name-column-cell",
    },
    {
      field: "adCreatorUsername",
      headerName: "Creator",
      width: 140,
      cellClassName: "name-column-cell",
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 140,
      cellClassName: "name-column-cell",
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 140,
      cellClassName: "name-column-cell",
    },
    {
      field: "budgetLeft",
      type: "Budget Left",
      headerName: "Budget Left",
      headerAlign: "center",
      align: "center",
      width: 140,
    },
    {
      field: "advertisementStatus",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <AdvertisementDropDownButton advert={params.row} />
      ),
    },
  ];

  return (
    <>
      <PageStructure
        icon={<RiAdvertisementLine size="2.5rem" />}
        title={"Advertisements"}
        breadcrumbs={<ActiveLastBreadcrumb />}
      >
        <div className="flex flex-col">
          <div className="mb-4 flex justify-end items-center">
            {ownerData.venues.length === 0 ? (
              <FieldInfo className="mr-5">
                {" "}
                Minimum 1 venue required to add an advertisement.
              </FieldInfo>
            ) : (
              ""
            )}

            <button
              onClick={() => {
                if (ownerData.venues.length > 0) {
                  navigate("/add-advertisement");
                } else {
                  alert(
                    "You need to have at least one venue to add an advertisement."
                  );
                }
              }}
              className={` ${
                ownerData.venues.length === 0
                  ? ButtonClassSets.disabled
                  : ButtonClassSets.primary
              }`}
              disabled={ownerData.venues.length === 0}
            >
              Add Advertisement
            </button>

            {/* <CreateAdvertisementForm/> */}
          </div>

          <div className="">
            <div className="items-center align-middle justify-center rounded-lg shadow-lg">
              <div className="">
                <Box sx={{ height: "100%", width: "100%" }}>
                  <DataGrid
                    rows={advertisements}
                    columns={columns}
                    pageSizeOptions={[5, 10, 15, 20]}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </PageStructure>
    </>
  );
};

export default Advertisements;
