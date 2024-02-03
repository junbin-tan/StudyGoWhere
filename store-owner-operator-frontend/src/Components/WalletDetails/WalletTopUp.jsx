import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import axios from "axios";
import { BACKEND_PREFIX } from "../../FunctionsAndContexts/serverPrefix";
import SideBar from "../SideBar/SideBar";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import FetchOwnerInfoAPI from "../../FunctionsAndContexts/FetchOwnerInfoAPI";
import CheckoutFormWrapper from "../WalletTopUp/CheckoutFormWrapper";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../WalletTopUp/CheckoutForm";
import PageStructure from "../PageStructure/PageStructure";
import ButtonStyles from "../../utilities/ButtonStyles";
import { Link } from "react-router-dom";
import ConfirmModalV2 from "../CommonComponents/Modal/ConfirmModalV2";
import BodyCard from "../CommonComponents/Card/BodyCard";
import ContentCard from "../CommonComponents/Card/ContentCard";
import TextClassSets from "../../utilities/TextClassSets";
import ButtonClassSets from "../../utilities/ButtonClassSets";

const WalletTopUp = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);
  const [walletData, setWalletData] = useState(ownerData.wallet);
  const [open, setOpen] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleOpenStripe = () => {
    setOpen(true);
  };
  const handleCloseStripe = () => {
    setOpen(false);
  };
  useEffect(() => {
    FetchOwnerInfoAPI.getOwner(encodedToken).then((response) => {
      if (response.status == 200) setOwnerData(response.data);
    });
    console.log(`hello ${process.env.REACT_APP_STRIPE_PUB_KEY}`);
  }, []);

  const [dollarAmount, setDollarAmount] = useState("");
  const [dollarError, setDollarError] = useState(false);
  const [optionsFormData, setOptionsFormData] = useState({
    amount: 0,
    mode: "payment",
    currency: "sgd",
  });

  function PresetAmountButton({ amt, children }) {
    return (
      <button
        // style={ButtonStyles.success}
        className="border-2 border-custom-yellow rounded-xl text-custom-yellow text-xl px-8 py-3 hover:bg-custom-yellow hover:text-white transition ease-in-out duration-300"
        onClick={() => {
          setDollarAmount(amt);
          setDollarError(false);
          setOptionsFormData({ ...optionsFormData, amount: amt * 100 });
        }}
      >
        <b>{children}</b>
      </button>
    );
  }

  const handleChange = (event) => {
    let { name, value } = event.target;
    // if (name == 'dollarAmount' && value != 0) {
    //     value = parseInt(value);
    // } else {
    //     value = 1;
    // }
    setDollarAmount(value);
    setOptionsFormData({ ...optionsFormData, amount: value * 100 });

    // do more validation checks
    setDollarError(!/^[1-9][0-9]*$/.test(value));
    // follow form in AddVenue
  };

  function ActiveLastBreadcrumb() {
    return (
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/venues">
            Home
          </Link>
          <Link underline="hover" className="text-lightgray-100" to="/wallet">
            My Wallet
          </Link>
          <Link
            underline="hover"
            className="text-custom-yellow"
            href="/wallet/topup"
            aria-current="page"
          >
            Top Up
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
    <>
      {/*<PageStructure*/}
      {/*  title={"Top up credits to wallet"}*/}
      {/*  breadcrumbs={<ActiveLastBreadcrumb />}*/}
      {/*>*/}
      {/* MAYBE WE SHOULD GET A FLEX COL DIV HERE (or the MUI equivalent)*/}
      <ContentCard style={{ flex: 2 }} className="">
        <h2 className={TextClassSets.title}>Top up credits to wallet</h2>
        <p className="font-medium mb-5">Please select amount to top up</p>
        <TextField
          className="min-w-full my-3 outline-required"
          name="dollarAmount"
          required
          label="Top-up amount"
          value={dollarAmount}
          onChange={handleChange}
          error={dollarError}
          helperText={dollarError && "Please input a dollar value more than 0."}
          // inputProps={{
          //         pattern: '[0-9]*'// Only allow numeric input
          //     }}
        />
        <div className="flex flex-row gap-3 mb-7">
          <PresetAmountButton amt={5}>$5</PresetAmountButton>
          <PresetAmountButton amt={10}>$10</PresetAmountButton>
          <PresetAmountButton amt={20}>$20</PresetAmountButton>
          <PresetAmountButton amt={50}>$50</PresetAmountButton>
          <PresetAmountButton amt={100}>$100</PresetAmountButton>
        </div>
        <div className="flex flex-row gap-3 justify-end">
          {/*can use other tags other than container, im using just for demonstration & testing*/}
          {/*<CheckoutFormWrapper options={formData} accessToken={encodedToken} ownerId={ownerData.userId}/>*/}

          <Button
            variant="contained"
            // color="primary"
            onClick={() => setIsConfirmModalOpen(true)}
            disabled={dollarError || dollarAmount == ""}
            className={`${
              dollarError || dollarAmount == ""
                ? ButtonClassSets.disabled
                : ButtonClassSets.primary
            } justify-end`}
          >
            Proceed Top-Up Wallet
          </Button>
        </div>
      </ContentCard>

      {/* {isConfirmModalOpen && <ConfirmModal confirmButtonCallbackFn={handleOpen}
                        backButtonCallbackFn={() => setIsConfirmModalOpen(false)} />} */}

      <ConfirmModalV2
        confirmButtonCallbackFn={handleOpenStripe}
        backButtonCallbackFn={() => setIsConfirmModalOpen(false)}
        onClose={() => setIsConfirmModalOpen(false)}
        open={isConfirmModalOpen}
        confirmButtonStyle={ButtonStyles.success}
        headerText={"Confirm top-up amount"}
        bodyText={
          <p className="" style={{ fontSize: "18px" }}>
            Are you sure you want to top-up $
            <span className="font-bold" style={{ fontSize: "20px" }}>
              {dollarAmount}
            </span>{" "}
            to your wallet?
          </p>
        }
      />

      <Dialog open={open} onClose={handleCloseStripe}>
        <DialogTitle>Enter Payment Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your payment details:
          </DialogContentText>

          <CheckoutFormWrapper
            options={optionsFormData}
            ownerId={ownerData.userId}
            accessToken={encodedToken}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseStripe}
            color="primary"
            style={ButtonStyles.back}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/*</PageStructure>*/}
    </>
  );
};

export default WalletTopUp;
