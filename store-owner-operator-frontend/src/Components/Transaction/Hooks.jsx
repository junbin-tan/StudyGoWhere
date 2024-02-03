import React, {useState, useEffect, useContext} from "react";
import Api from "../../FunctionsAndContexts/Api";
import useEncodedToken from '../../FunctionsAndContexts/useEncodedToken';
import { SnackbarContext } from "../../FunctionsAndContexts/SnackbarContextOrigin";
export function useWalletBalance() {
  const {encodedToken} = useEncodedToken();
  const [walletBalance, setWalletBalance] = useState(null);
  useEffect(() => {
    Api.getWalletBalance(encodedToken)
    .then(res => {
      return res.json();
    }).then(obj => {
      console.log(obj);
      setWalletBalance(obj);
    }).catch(error => {
      console.log(error);
    })
  }, [])
  return walletBalance;

}

export function useOwnTransactionData() {
  const {encodedToken} = useEncodedToken();
  const handleChange = (e) => {
      setTransactions(e);
  }
  const {snackbarDispatch} = useContext(SnackbarContext);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    refreshTransactions();
  }, [])
  const refreshTransactions = () => {
    console.log("HEREE")
    if (encodedToken) {
        Api.getOwnTransactions(encodedToken)
        .then(res => res.json())
        .then(r => {
          const processedTransactions = r.map((transactionData) => ({
            id: transactionData.transactionId,
            payer: transactionData.payer,
            receiver: transactionData.receiver,
            totalAmount: (transactionData.totalAmount / 100).toFixed(2),
            createdAt: new Date(transactionData.createdAt).toLocaleString(),
            transactionStatusEnum : transactionData.transactionStatusEnum
          }));
          setTransactions(processedTransactions);
          snackbarDispatch({type : "SUCCESS"})
        })
        .catch(error => {
          console.log(error)
          snackbarDispatch({type : "ERROR"})
        })
  }
  }
  return {transactions, refreshTransactions};
}
