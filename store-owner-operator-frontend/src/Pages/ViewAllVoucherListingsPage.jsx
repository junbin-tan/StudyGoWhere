import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs, Card, Button } from "@mui/material";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";
import FetchOwnerInfoAPI from "../FunctionsAndContexts/FetchOwnerInfoAPI";
import PageStructure from "../Components/PageStructure/PageStructure";
import Box from "@mui/material/Box";
import { gridClasses, DataGrid } from "@mui/x-data-grid";
import { alpha, styled } from "@mui/material/styles";
import VoucherListingDropDownButton from "../Components/Voucher/VoucherListingDropDownButton";
import { RiCoupon3Line } from "react-icons/ri";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BodyCard from "../Components/CommonComponents/Card/BodyCard";
import { AddCircleOutline } from "@mui/icons-material";
import ButtonClassSets from "../utilities/ButtonClassSets";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

const ViewAllVoucherListingsPage = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  // for add voucher
  const navigate = useNavigate();

  const navigateToCreateVoucher = () => {
    navigate("/createVoucherListing");
  };

  function ActiveLastBreadcrumb({}) {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/vouchers">
            Home
          </Link>
          <Link underline="hover" className="text-custom-yellow" to="/vouchers">
            Vouchers Listing
          </Link>
        </Breadcrumbs>
      </div>
    );
  }

  // setting table

  const [voucherListing, setVoucherListing] = useState([]);

  useEffect(() => {
    fetchVoucherListings();
  }, []);

  const fetchVoucherListings = () => {
    FetchOwnerInfoAPI.getAllVoucherListingForOwner(encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedVoucherListing = data.map((vcListData) => ({
            id: vcListData.voucherListingId,
            description: vcListData.description,
            voucherValue: vcListData.voucherValue,
            voucherCost: vcListData.voucherCost,
            voucherStock: vcListData.voucherStock,
            enabled: vcListData.enabled,
            voucherListingDelistDate: vcListData.voucherListingDelistDate,
            voucherName: vcListData.voucherName,
            adminBanned: vcListData.adminBanned,
          }));
          setVoucherListing(processedVoucherListing);
        } else {
          console.error("Received data is not an array:", data);
        }
      });
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,

      headerClassName: "regular-bold ",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "voucherName",
      headerName: "Name",
      flex: 0.5,
      // width: 140,
      cellClassName: "name-column-cell",
      headerClassName: "regular-bold ",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "voucherValue",
      type: "number",
      headerName: "Value",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => <div>$ {params.value}</div>,
      headerClassName: "regular-bold ",
    },
    {
      field: "voucherCost",
      type: "number",
      headerName: "Cost",
      headerAlign: "center",
      align: "center",

      width: 120,
      renderCell: (params) => <div>$ {params.value}</div>,
      headerClassName: "regular-bold ",
    },
    {
      field: "voucherStock",
      type: "number",
      headerName: "Stock",
      headerAlign: "center",
      align: "center",

      width: 120,
      headerClassName: "regular-bold",
    },
    {
      field: "enabled",
      headerName: "Enabled",
      headerAlign: "center",
      align: "center",
      width: 140,
      renderCell: (params) => {
        params.value == "true" ? (
          <p className="rounded-3xl px-3 py-1 bg-green-500">True</p>
        ) : (
          <p className="rounded-3xl px-3 py-1 bg-red-500">False</p>
        );
      },
      headerClassName: "regular-bold ",
    },
    {
      field: "voucherListingDelistDate",
      headerName: "Delist Date",
      headerAlign: "center",
      align: "center",

      width: 180,
      headerClassName: "regular-bold ",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      headerClassName: "regular-bold ",
      renderCell: (params) => (
        <VoucherListingDropDownButton
          vcList={params.row}
          refreshData={fetchVoucherListings}
        />
      ),
    },
  ];

  return (
    <>
      <PageStructure
        icon={<RiCoupon3Line size="1.5em" />}
        title={"Voucher Listings"}
        breadcrumbs={<ActiveLastBreadcrumb />}
      >
        <div className="flex flex-col">
          <div className="mb-4 flex justify-end">
            <Button
              onClick={navigateToCreateVoucher}
              className={ButtonClassSets.primary}
            >
              <AddCircleOutlineIcon /> Add New Voucher
            </Button>
          </div>

          <StripedDataGrid
            rows={voucherListing}
            columns={columns}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #E0E0E0",
            }}
            pageSizeOptions={[5, 10, 15, 20]}
            checkboxSelection={false}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            disableRowSelectionOnClick
          />
        </div>
      </PageStructure>
    </>
  );
};

export default ViewAllVoucherListingsPage;
