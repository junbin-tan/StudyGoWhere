import useEncodedToken from "../../Helpers/useEncodedToken";
import React, {useState, useEffect, useContext} from "react";
import Api from "../../Helpers/Api";
import { SnackbarContext, SnackbarProvider } from "../../Helpers/SnackbarContextOrigin";

export function useTransactionData() {
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
      Api.getAllTransactions(encodedToken)
      .then(res => {
        const processedTransactions = res.map((transactionData) => ({
          id: transactionData.transactionId,
          payer: transactionData.payer,
          receiver: transactionData.receiver,
          totalAmount: (transactionData.totalAmount / 100).toFixed(2),
          createdAt: new Date(transactionData.createdAt).toLocaleString(),
          transactionStatusEnum : transactionData.transactionStatusEnum,
          refunded : transactionData.refunded
        }));
        setTransactions(processedTransactions);
        snackbarDispatch({type : "SUCCESS"})
      })
      .catch(error => {
        snackbarDispatch({type : "ERROR"})
      })
    }
    return {transactions, refreshTransactions};
}
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
    Api.getOwnTransactions(encodedToken)
    .then(res => {
      const processedTransactions = res.map((transactionData) => ({
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
      snackbarDispatch({type : "ERROR"})
    })
  }
  return {transactions, refreshTransactions};
}
