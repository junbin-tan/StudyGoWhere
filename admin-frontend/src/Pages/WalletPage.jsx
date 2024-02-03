

    import React from "react";
import { useState, useEffect, useMemo, useContext } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Api from "../Helpers/Api";
import PageHeaderListing from "../Components/PageHeaderListing";
import Button from "../Components/Button";
//import TransactionDropDownButton from "../Components/Transaction/TransactionDropDownButton";
import useEncodedToken from "../Helpers/useEncodedToken";
import SearchComponent from "../Components/Transaction/SearchComponent";
import { useReducer } from "react";
import { useOwnTransactionData, useTransactionData } from "../Components/Transaction/Hooks";
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { SnackbarContext } from "../Helpers/SnackbarContextOrigin";
import { filterTransactions } from "../Components/Transaction/HelperMethods";
import TransactionDropDownButton from "../Components/Transaction/TransactionDropDownButton";
import { useWalletBalance } from "../Components/Transaction/Hooks";
import { LoginTokenContext } from "../Helpers/LoginTokenContext";
import { bgColor } from "../Components/Transaction/HelperMethods";
import useToken from "../Helpers/useToken";
export const WalletListing = () => {
   const categories = [    
    {field : "transactionId", label : "Transaction ID"},
    {field : "payer", label : "Payer"},
    {field : "receiver", label : "Receiver"},
    {field : "totalAmount", label : "Total Amount ($)"},
   ] 
  const {transactions, refreshTransactions} = useOwnTransactionData();
  const walletBalance = useWalletBalance();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const filteredTransactions = useMemo(() => {
                                        return filterTransactions(transactions, category, search);
                                      }, [search, category, transactions])
  // make the column for the data
  //flex will grow to 1 fractiion of the size of flex , no flex wont grow
  // render cell will allow customeisaton of cell
  const {token} = useToken();

  const columns = [
    { field: "id", headerName: "Transaction ID", width: 150 },
    {
      field: "payer",
      headerName: "Payer",
      width: 200,
      cellClassName: "name-column-cell",
    },
    {
      field: "receiver",
      headerName: "Receiver",
      headerAlign: "left",
      align: "left",
      width: 200,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount ($)",
      headerAlign: "left",
      align: "left",
      width: 200,
      renderCell : (params) => {
        return <span className={`${bgColor(params.row.receiver, token)} text-white p-3 rounded-lg`}>{params.row.totalAmount}</span>
      }
    },
    {
      field: "transactionStatusEnum",
      headerName: "Status",
      headerAlign: "left",
      align: "left",
      width: 200,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      headerAlign: "left",
      align: "left",
      width: 200,
    },
    
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <TransactionDropDownButton key={params.row.transactionId} transaction={params.row} 
                                                          refreshData={refreshTransactions} scope="own" />,
    },
  ];


  return (
    <div className="flex flex-col p-10 shadow-xl">
      <div>
        <div className="flex flex-col border-2 p-10 rounded-lg bg-sky-900	 text-white">
          <h1 className="text-xl font-semibold mb-4">Current Balance</h1>
          <h1 className="text-6xl font-bold">
            $ {walletBalance != null ? (walletBalance / 100).toFixed(2) : "Loading ..."}
          </h1>
        </div>
      </div>
      <div className="py-5 px-10 ">
        <div className="p-5 items-center align-middle justify-center rounded-lg shadow-lg">
          <div className="">
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={filteredTransactions}
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
};