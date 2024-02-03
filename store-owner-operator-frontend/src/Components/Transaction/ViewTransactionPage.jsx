import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ViewTransactionForm from "./ViewTransactionForm";
import PageStructure from "../PageStructure/PageStructure";
import Api from "../../FunctionsAndContexts/Api";
import useEncodedToken from "../../FunctionsAndContexts/useEncodedToken";
import { BiSupport } from "react-icons/bi";
import { Breadcrumbs } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import { Link } from "react-router-dom";
import { conductBillableDTOMapping } from "./HelperMethods";
const ViewTransactionPage = () => {
    const { transactionId} = useParams();
    const emptyTransaction = {
      transactionId : null,
      payer : "",
      receiver : "",
      totalAmount : 0,
      createdAt: "",
      billableDTOList : []
    }
    const [transactionData, setTransactionData] = useState({...emptyTransaction});
  
    const { encodedToken } = useEncodedToken();
    function ActiveLastBreadcrumb() {
      return (
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" className="text-lightgray-100" to="/dashboard">
              Home
            </Link>
            <Link
              underline="hover"
              className="text-custom-yellow"
              href="/wallet"
              aria-current="page"
            >
              Wallet
            </Link>
          </Breadcrumbs>
        </div>
      );
    }
    useEffect(() => {
      Api.getTransactionById(transactionId, encodedToken)
        .then((response) => response.json())
        .then((t) => {
          let _t = {...t, billableDTOList : [...t.billableDTOList]};
              const map = new Map();
              _t = conductBillableDTOMapping(map, _t);
              setTransactionData(_t);
        }).catch((error) => {
          console.error("Error fetching transaction details:", error);
        });
    }, [transactionId]);
  
    return (
      <PageStructure
      icon={<BiSupport className="text-4xl" />}
      title={"Transaction Details"}
      breadcrumbs={<ActiveLastBreadcrumb />}
      actionButton={
        <Link to="/wallet/transactions">
      <Button type="button" className={ButtonClassSets.dynamicDelete} >
        Back
    </Button>
    </Link>}
    >
      <div className="flex flex-col max-h-screen">
        <div className="py-5 px-10">
            <ViewTransactionForm key={transactionData?.transactionId} transaction={transactionData} />
          </div>
      </div>
      </PageStructure>
    );
  };
  
  export default ViewTransactionPage;