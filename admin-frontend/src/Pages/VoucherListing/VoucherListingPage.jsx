import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import PageHeaderListing from "../../Components/PageHeaderListing";
import Button from "../../Components/Button";
import useEncodedToken from "../../Helpers/useEncodedToken";
import Api from "../../Helpers/Api";
import VoucherListingDropDownButton from "../../Components/VoucherListing/VoucherListingDropDownButton";

const VoucherListingPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const { encodedToken } = useEncodedToken();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = () => {
    Api.getAllVoucherListing(encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedVouchers = data.map((voucherData) => ({
            id: voucherData.voucherListingId,
            description: voucherData.description,
            voucherValue: voucherData.voucherValue,
            voucherCost: voucherData.voucherCost,
            voucherStock: voucherData.voucherStock,
            enabled: voucherData.enabled,
            voucherListingDelistDate: voucherData.voucherListingDelistDate,
            voucherName: voucherData.voucherName,
            adminBanned: voucherData.adminBanned,
          }));
          setVouchers(processedVouchers);
        } else {
          console.error("Received data is not an array:", data);
        }
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "voucherName",
      headerName: "Name",
      flex: 0.5,
      cellClassName: "name-column-cell",
    },
    {
      field: "voucherValue",
      type: "number",
      headerName: "Value",
      headerAlign: "center",
      align: "center",
      width: 120,
    },
    {
      field: "voucherCost",
      type: "number",
      headerName: "Cost",
      headerAlign: "center",
      align: "center",
      width: 120,
    },
    {
      field: "voucherStock",
      type: "number",
      headerName: "Stock",
      headerAlign: "center",
      align: "center",
      width: 120,
    },
    {
      field: "enabled",
      headerName: "User Enabled",
      headerAlign: "center",
      align: "center",
      width: 130,
    },
    {
      field: "adminBanned",
      headerName: "Admin Banned",
      headerAlign: "center",
      align: "center",
      width: 130,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <VoucherListingDropDownButton
          voucherListing={params.row}
          refreshData={fetchVouchers}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <div>
        <PageHeaderListing title="Voucher Listing"></PageHeaderListing>
      </div>
      {/* <div className="px-10">
        <SearchComponent 
            handleCategoryChange={handleCategoryChange}
            changeSearch={changeSearch}
          />
      </div> */}
      <div className="py-5 px-10 ">
        <div className="p-5 items-center align-middle justify-center rounded-lg shadow-lg">
          <div className="">
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={vouchers}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 15, 20]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherListingPage;
