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
    Box,
  } from "@mui/material";
  import React from "react";
  import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
  import { bgColor } from "./HelperMethods";
  import { useState, useEffect } from "react";
  import useEncodedToken from "../../Helpers/useEncodedToken";

  const ViewTransactionForm = ({ transaction }) => {
    const { encodedToken } = useEncodedToken();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const columns = [
      {
        field: "billableName",
        headerName: "Billable Name",
        width: 200,
        cellClassName: "name-column-cell",
      },
      {
        field: "quantity",
        headerName: "Quantity",
        headerAlign: "left",
        align: "left",
        width: 200,
      },
      {
        field: "billablePrice",
        headerName: "Billable Price ($)",
        headerAlign: "left",
        align: "left",
        width: 200,
      },
      {
        field: "subtotal",
        headerName: "Subtotal ($)",
        headerAlign: "left",
        align: "left",
        width: 200,
      }

    ];
    return (
      <div className="flex flex-col items-center">
        <div className="w-screen rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 m-0">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
              <span className="text-gray-700">
                Transaction ID: {transaction?.transactionId}
              </span>
            </h1>
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium "
                >
                  Receiver
                </label>
                <input
                  type="text"
                  name="subject"
                  value={transaction.receiver}
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium "
                >
                  Payer
                </label>
                <input
                  type="text"
                  name="subject"
                  value={transaction.payer}
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                />
              </div>
              <div>
                <label
                  htmlFor="totalAmount"
                  className="block mb-2 text-sm font-medium "
                >
                  Total Amount ($)
                </label>
                <input
                  type="text"
                  name="subject"
                  value={transaction?.totalAmount ? (transaction.totalAmount/ 100).toFixed(2) : 0}
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                />
              </div>
              <div>
                <label
                  htmlFor="createdAt"
                  className="block mb-2 text-sm font-medium "
                >
                  Created At
                </label>
                <input
                  type="text"
                  name="createdAt"
                  value={new Date(transaction.createdAt).toLocaleString()}
                  className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  readOnly
                />
              </div>
          </div>
        </div>
        <div className="py-5 px-10 ">
          <div className="p-5 items-center align-middle justify-center rounded-lg shadow-lg">
            <div className="">
              <Box sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                  rows={transaction?.billableDTOList ? transaction.billableDTOList : []}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  pageSizeOptions={[5, 10, 15, 20]}
                />
              </Box>
            </div>
          </div>
        </div>
      </div>
      
    );
  }
  
  export default ViewTransactionForm;