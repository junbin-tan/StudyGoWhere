import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ViewTransactionForm from "./ViewTransactionForm";
import PageHeaderBasic from "../PageHeaderBasic";
import Button from "../Button";
import useEncodedToken from "../../Helpers/useEncodedToken";
import Api from "../../Helpers/Api";
import { conductBillableDTOMapping } from "./HelperMethods";
const ViewTransactionPage = () => {
    const { transactionId, scope} = useParams();
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
    useEffect(() => {
      Api.getTransactionById(transactionId, encodedToken)
        .then((response) => response.json())
        .then((t) => {
              let _t = {...t, billableDTOList : [...t.billableDTOList]};
              const map = new Map();
              _t = conductBillableDTOMapping(map, _t)
            setTransactionData(_t);
        }).catch((error) => {
          console.error("Error fetching transaction details:", error);
        });
    }, [transactionId]);
  
    return (
      <div className="flex flex-col max-h-screen">
        <div>
          <PageHeaderBasic title="View Transaction">
            <Button title="Back" location={scope === "all" ? "/transactions" : "/wallet"} />
          </PageHeaderBasic>
        </div>
        <div className="py-5 px-10">
          <div className="p-5  flex justify-center rounded-lg shadow-lg">
            <ViewTransactionForm key={transactionData?.transactionId} transaction={transactionData} />
          </div>
        </div>
      </div>
    );
  };
  
  export default ViewTransactionPage;