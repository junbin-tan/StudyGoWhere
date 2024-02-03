import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import SideBar from "../Components/SideBar/SideBar";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";
import FetchOwnerInfoAPI from "../FunctionsAndContexts/FetchOwnerInfoAPI";
import PageStructure from "../Components/PageStructure/PageStructure";
import axios from "axios";
import { BACKEND_PREFIX } from "../FunctionsAndContexts/serverPrefix";
import ButtonStyles from "../utilities/ButtonStyles";
import ConfirmModalV2 from "../Components/CommonComponents/Modal/ConfirmModalV2";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Transaction from "../Components/Transaction/Transaction";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import BodyCard from "../Components/CommonComponents/Card/BodyCard";
import CustomLine from "../utilities/CustomLine";
import ButtonClassSets from "../utilities/ButtonClassSets";
import HorizontalLine from "../Components/CommonComponents/Line/HorizontalLine";
import ResponsiveDivider from "../Components/CommonComponents/Line/ResponsiveDivider";
import ContentCard from "../Components/CommonComponents/Card/ContentCard";
import WalletTopUp from "../Components/WalletDetails/WalletTopUp";
import WalletWithdraw from "../Components/WalletDetails/WalletWithdraw";
import { BiMoneyWithdraw, BiHistory } from "react-icons/bi";
import TransactionWrapped from './TransactionWrapped';
import { SnackbarProvider } from "../FunctionsAndContexts/SnackbarContextProvider";
const WalletDetails = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);

  // might need to do undefined check, it will crash if user goes directly to this address
  // however, if user has gone to main page & ownerData is already fetched, it works
  const [walletData, setWalletData] = useState(ownerData.wallet);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [refetchOwner, setRefetchOwner] = useState(false);

  useEffect(() => {
    console.log("hello " + ownerData.wallet.walletBalance);
    FetchOwnerInfoAPI.getOwner(encodedToken).then((response) => {
      if (response.status == 200) {
        setOwnerData(response.data);
        setWalletData(response.data.wallet);
        // idk why using ownerData.wallet doesnt work
        // maybe because ownerData hasnt been set yet by the time setWalletData is called
      }
    });
  }, [refetchOwner]);

  // FORM STUFF

  const [formData, setFormData] = useState({
    dollarAmount: "",
    centsValue: "",
  });
  const [dollarError, setDollarError] = useState(false);

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
      console.log("WITHDRAW ");
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
      // setIsSuccessModalOpen(true); // Show success modal
    } catch (error) {
      console.error("Error sending the request:", error);
      // setIsErrorModalOpen(false);
    }
    setIsConfirmModalOpen(false);
    setRefetchOwner(!refetchOwner);
  };

  // TAB INDICATOR STYLING
  const StyledTabs = styled((props) => (
    <Tabs
      {...props}
      TabIndicatorProps={{
        children: <span className="MuiTabs-indicatorSpan" />,
      }}
    />
  ))({
    "& .MuiTabs-indicator": {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    "& .MuiTabs-indicatorSpan": {
      width: "100%",
      backgroundColor: "rgba(234, 198, 150, 1)",
      height: "4px",
    },
  });

  // +== CODE FOR HANDLING TAB VALUES
  const { pageName } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  // -== END CODE FOR HANDLING TAB VALUES

  // SETTING OF TAB VALUE BASED ON URL
  useEffect(() => {
    console.log(pageName)
    if (pageName === "transaction") {
      setTabValue(0);
    } else if (pageName === "withdraw") {
      setTabValue(1);
    } else {
      setTabValue(0);
    }
  }, [pageName]);
  const WalletInfo = () => {
    return (
      <div className="flex flex-col gap-5 " style={{ flex: 1 }}>
        <div className="flex flex-col border-2 p-5 rounded-lg bg-custom-yellow text-white">
          <h1 className="text-xl font-semibold mb-4">Current Balance</h1>
          <h1 className="text-6xl font-bold">
            $ {(walletData.walletBalance / 100).toFixed(2)}
          </h1>
        </div>

        <div className="flex flex-row justify-center gap-2">
          <Link to="/wallet/transactions">
            <Button
              className={` justify-center ${ButtonClassSets.secondary}`}
              sx={{ border: "1px solid" }}
              variant="contained"
            >
              <BiHistory size="1.5rem" />
              <p>Transaction history</p>
            </Button>
          </Link>
          <Link to="/wallet/withdraw">
            <Button
              className={`justify-center ${ButtonClassSets.secondary}`}
              sx={{ border: "1px solid" }}
              variant="contained"
            >
              <BiMoneyWithdraw size="1.5rem" />
              <p>Withdraw balance</p>
            </Button>
          </Link>
          <Link to="/wallet/topup">
            <Button
              className={`w-72 justify-center  ${ButtonClassSets.primary}`}
              variant="contained"
            >
              <AddCircleOutlineOutlinedIcon />
              <p>Top-up balance</p>
            </Button>
          </Link>
        </div>

        {/* these are lists of transactions, need another way to display obviously*/}
        {/*hard to do this one, because some of the fields obviously shouldn't really JsonIgnore*/}
        {/*can use JsonIdentityInfo*/}

        {/* <p>Wallet outgoing transactions is {walletData.outgoingTransactions}</p>
            <p>Wallet incoming transactions is {walletData.incomingTransactions}</p> */}

        {/*there are also vouchers since every wallet has a vouchers list, but not relevant for owner*/}
      </div>
    );
  };

  // function WalletWithdraw() {
  //
  //   return (
  //       <div className="flex flex-col gap-16 lg:flex-row md:gap-16 lg:gap-24 xl:gap-32 " style={{flex: 2}}>
  //         <form onSubmit={handleSubmit}>
  //         <div
  //             className={
  //               "flex flex-col max-w-full w-96 py-8 px-8 border border-lightgray-100 rounded-xl mx-auto lg:mx-0"
  //             }
  //         >
  //           <label
  //               htmlFor="withdrawAmount"
  //               className="font-semibold text-lg mb-5"
  //           >
  //             Withdraw Amount
  //           </label>
  //           <TextField
  //               className=""
  //               name="dollarAmount"
  //               required
  //               label="Withdraw amount"
  //               value={formData.dollarAmount}
  //               onChange={handleChange}
  //               error={dollarError}
  //               helperText={dollarError && "Please withdraw a valid amount."}
  //           />
  //           <Button
  //               disabled={dollarError || formData.dollarAmount == ""}
  //               style={
  //                 dollarError || formData.dollarAmount == ""
  //                     ? ButtonStyles.disabled
  //                     : ButtonStyles.default
  //               }
  //               onClick={() => setIsConfirmModalOpen(true)}
  //           >
  //             <p>Withdraw amount</p>
  //           </Button>
  //           {/* hidden button for force withdraw */}
  //           <Button type="submit" onClick={() => setIsConfirmModalOpen(true)}>
  //             <p>Force withdraw amount</p>
  //           </Button>
  //         </div>
  //
  //         <ConfirmModalV2
  //             open={isConfirmModalOpen}
  //             onClose={() => setIsConfirmModalOpen(false)}
  //             onSubmit={(event) => handleSubmit(event)}
  //             confirmButtonCallbackFn={() => setIsConfirmModalOpen(false)}
  //             backButtonCallbackFn={() => setIsConfirmModalOpen(false)}
  //             headerText="Confirm withdraw"
  //             bodyText="Are you sure you want to withdraw this amount?"
  //         />
  //         </form>
  //       </div>
  //   )
  // }

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
    <PageStructure
      icon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: "2.5rem" }} />}
      title={"My Wallet"}
      breadcrumbs={<ActiveLastBreadcrumb />}
    >
      {/*can use other tags other than container, im using just for demonstration & testing*/}
      <BodyCard>
        <div className="flex flex-col gap-16 ">
          <WalletInfo />
          {(!pageName || pageName == "topup") ? (
            <WalletTopUp />
          ) : (pageName === "transactions") ? (
            <TransactionWrapped/> 
          ) : (
            <SnackbarProvider>
              <WalletWithdraw />
            </SnackbarProvider>
          )
          }

          {/* FOR THIRD SYSTEM RELEASE */}
          {/* <div className="flex flex-col">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Link to={`/wallet/transaction`} onClick={() => setTabValue(0)}>
                <Tab
                  label="Transaction History"
                  value={0}
                  style={{ border: "1px solid rgba(200, 174, 125, 1)" }}
                  indicatorColor="red"
                />
              </Link>
              <Link to={`/wallet/withdraw`} onClick={() => setTabValue(1)}>
                <Tab
                  label="Withdraw Balance"
                  value={1}
                  style={{
                    border: "1px solid rgba(200, 174, 125, 1)",
                  }}
                />
              </Link>
            </Tabs>
            {pageName === "transaction" || pageName === undefined ? (
              <Transaction />
            ) : (
              ""
            )}
            {pageName === "withdraw" ? (
              <div
                className={
                  "flex flex-col max-w-sm py-8 px-8 border border-lightgray-100 rounded-b-xl"
                }
              >
                <label htmlFor="withdrawAmount" className="font-medium">
                  Withdraw Amount
                </label>
                <TextField
                  className=""
                  name="dollarAmount"
                  required
                  label="Withdraw amount"
                  value={formData.dollarAmount}
                  onChange={handleChange}
                  error={dollarError}
                  helperText={dollarError && "Please withdraw a valid amount."}
                />
                <Button
                  disabled={dollarError || formData.dollarAmount == ""}
                  style={
                    dollarError || formData.dollarAmount == ""
                      ? ButtonStyles.disabled
                      : ButtonStyles.default
                  }
                  onClick={() => setIsConfirmModalOpen(true)}
                >
                  <p>Withdraw amount</p>
                </Button>
                {/* hidden button for force withdraw 
                <Button
                  type="submit"
                  onClick={() => setIsConfirmModalOpen(true)}
                >
                  <p>Force withdraw amount</p>
                </Button>
              </div>
            ) : (
              ""
            )}
          </div> */}

          <ConfirmModalV2
            open={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onSubmit={(event) => handleSubmit(event)}
            confirmButtonCallbackFn={() => setIsConfirmModalOpen(false)}
            backButtonCallbackFn={() => setIsConfirmModalOpen(false)}
            headerText="Confirm withdraw"
            bodyText="Are you sure you want to withdraw this amount?"
          />
          {/* </form> */}
        </div>
      </BodyCard>
    </PageStructure>
  );
};

export default WalletDetails;
