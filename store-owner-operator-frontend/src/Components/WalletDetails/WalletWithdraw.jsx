import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import SideBar from "../SideBar/SideBar";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import FetchOwnerInfoAPI from "../../FunctionsAndContexts/FetchOwnerInfoAPI";
import PageStructure from "../PageStructure/PageStructure";
import axios from "axios";
import { BACKEND_PREFIX } from "../../FunctionsAndContexts/serverPrefix";
import ButtonStyles from "../../utilities/ButtonStyles";
import ConfirmModalV2 from "../CommonComponents/Modal/ConfirmModalV2";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Transaction from "../Transaction/Transaction";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import BodyCard from "../CommonComponents/Card/BodyCard";
import CustomLine from "../../utilities/CustomLine";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import ContentCard from "../CommonComponents/Card/ContentCard";
import TextClassSets from "../../utilities/TextClassSets";
import FieldLabel from "../CommonComponents/Form/FieldLabel";
import { SnackbarProvider, useSnackbar } from "../../FunctionsAndContexts/SnackbarContextProvider";
import { SnackbarContext } from "../../FunctionsAndContexts/SnackbarContextOrigin";
const WalletWithdraw = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);

  // might need to do undefined check, it will crash if user goes directly to this address
  // however, if user has gone to main page & ownerData is already fetched, it works
  const [walletData, setWalletData] = useState(ownerData.wallet);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [refetchOwner, setRefetchOwner] = useState(false);

  useEffect(() => {
    FetchOwnerInfoAPI.getOwner(encodedToken).then((response) => {
      if (response.status == 200) {
        setOwnerData(response.data);
        setWalletData(response.data.wallet);
      }
    });
  }, [refetchOwner]);

  // FORM STUFF

  const [formData, setFormData] = useState({
    dollarAmount: "",
    centsValue: "",
  });
  const [dollarError, setDollarError] = useState(false);
  const {snackbarDispatch} = useContext(SnackbarContext);

  const handleChange = (event) => {
    const { name, value } = event.target; // value entered in dollars eg. 10.20
    const centsValue = Math.round(value * 100); // value in cents eg. 1020
    setFormData({ centsValue: centsValue, [name]: value });
    // console.log(name + ": " + value + " and centsValue: " + centsValue
    // + " walletBalance: " + walletData.walletBalance);

    // ****** do more validation checks *********************
    // setDollarError(false);
    setDollarError(!/^\d+(\.\d{1,2})?$/.test(value));
    if (!centsValue || centsValue > walletData.walletBalance) {
      setDollarError(true);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let authorisationString = "Bearer " + encodedToken;

    try {
      const response = await axios.put(
        `${BACKEND_PREFIX}/owner/withdraw-balance/`,
        {
          // this is the request body
          withdrawAmount: formData.centsValue,
        },
        {
          headers: {
            Authorization: authorisationString,
            "content-type": "application/json",
          },
        }
      );
      console.log("Response from API:", response.data);
      snackbarDispatch({type : "SUCCESS"})
      setTimeout(() => {
        window.location.reload();
      //setIsSuccessModalOpen(true); // Show success modal
      }, 2000);
    } catch (error) {
      console.error("Error sending the request:", error);
      // setIsErrorModalOpen(false);
    }
    setIsConfirmModalOpen(false);
    setRefetchOwner(!refetchOwner);
  };

  // === BREADCRUMBS ===
  function ActiveLastBreadcrumb() {
    return (
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/venues">
            Home
          </Link>
          <Link
            underline="hover"
            className="text-custom-yellow"
            href="/wallet"
            aria-current="page"
          >
            My Wallet
          </Link>
        </Breadcrumbs>
      </div>
    );
  }
  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb");
  }

  return (
    <ContentCard style={{ flex: 2 }}>
        <div
          // className={
          //   "flex flex-col max-w-full w-96 py-8 px-8 border border-lightgray-100 rounded-xl mx-auto lg:mx-0"
          // }
          className={"flex flex-col max-w-full h-full"}
        >
          <h2 className={TextClassSets.title}>Withdraw amount from wallet</h2>
          <p className="font-medium mb-5">Please enter amount to withdraw</p>
          {/*<label*/}
          {/*  htmlFor="withdrawAmount"*/}
          {/*  className="font-semibold text-lg mb-5"*/}
          {/*>*/}
          {/*  Withdraw Amount*/}
          {/*</label>*/}

          <TextField
            id="withdrawAmount"
            className="mb-5"
            name="dollarAmount"
            required
            label="Withdraw amount"
            // label="Withdraw amount"
            placeholder={"Withdraw amount"}
            value={formData.dollarAmount}
            onChange={handleChange}
            error={dollarError}
            helperText={dollarError && "Please withdraw a valid amount."}
          />
          <div className="flex flex-row justify-end">
            <Button
              disabled={dollarError || formData.dollarAmount == ""}
              className={`${
                dollarError || formData.dollarAmount == ""
                  ? ButtonClassSets.disabled
                  : ButtonClassSets.primary
              }`}
              onClick={() => setIsConfirmModalOpen(true)}
              variant="contained"
            >
              Proceed Withdraw Balance
            </Button>
            {/* hidden button for force withdraw */}
            {/* <Button type="submit" onClick={() => setIsConfirmModalOpen(true)}>
              <p>Force withdraw amount</p>
            </Button> */}
          </div>
        </div>

        <ConfirmModalV2
          open={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onSubmit={(event) => handleSubmit(event)}
          confirmButtonCallbackFn={() => setIsConfirmModalOpen(false)}
          backButtonCallbackFn={() => setIsConfirmModalOpen(false)}
          isConfirmButtonSubmit={true}
          headerText="Confirm withdraw"
          bodyText="Are you sure you want to withdraw this amount?"
        />
    </ContentCard>
  );
};

export default WalletWithdraw;
