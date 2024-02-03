import React, { useCallback, useContext, useState } from "react";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import PageStructure from "../Components/PageStructure/PageStructure";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditVoucherListingForm from "../Components/Voucher/EditVoucherListingForm";
import { MdRedeem } from "react-icons/md";
import { Breadcrumbs, Button } from "@mui/material";
import { Link } from "react-router-dom";
import BodyCard from "../Components/CommonComponents/Card/BodyCard";
import TextField from "@mui/material/TextField";
import FetchOwnerInfoAPI from "../FunctionsAndContexts/FetchOwnerInfoAPI";
import ConfirmModalV2 from "../Components/CommonComponents/Modal/ConfirmModalV2";
import Snackbar from "@mui/material/Snackbar";
import ButtonClassSets from "../utilities/ButtonClassSets";
import Alert from "@mui/material/Alert";
import { RiCoupon3Line } from "react-icons/ri";
import FieldLabel from "../Components/CommonComponents/Form/FieldLabel";
import ButtonStyles from "../utilities/ButtonStyles";
import ContentCard from "../Components/CommonComponents/Card/ContentCard";
import ConvertMoney from "../FunctionsAndContexts/ConvertMoney";
import { IoMdDoneAll } from "react-icons/io";

function ActiveLastBreadcrumb({ name }) {
  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" className="text-lightgray-100" to="/">
          Home
        </Link>
        <Link underline="hover" className="text-custom-yellow">
          Redeem Voucher
        </Link>
      </Breadcrumbs>
    </div>
  );
}
export default function RedeemVoucher() {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  const [voucherCode, setVoucherCode] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [fetchedVoucher, setFetchedVoucher] = useState(null);

  const redeemVoucher = useCallback(() => {
    console.log("voucherCode is", voucherCode);
    FetchOwnerInfoAPI.redeemAndUseVoucher(encodedToken, voucherCode)
      .then((res) => {
        if (res.status == 200) {
          console.log(res);
          setAlertSeverity("success");
          setSnackbarMessage(
            "Voucher successfully redeemed and marked as used!"
          );
          setOpenSnackbar(true);
        }
      })
      .catch((error) => {
        setAlertSeverity("error");
        setOpenSnackbar(true);
        setSnackbarMessage("Error: " + error.response.data);
        console.log(error);
      });
  }, [voucherCode]);

  const getVoucherListing = useCallback(() => {
    FetchOwnerInfoAPI.getVoucherByVoucherCode(encodedToken, voucherCode)
      .then((res) => {
        if (res.status == 200) {
          console.log(res);
          setAlertSeverity("success");
          setSnackbarMessage("Voucher details successfully fetched");
          setOpenSnackbar(true);
          setFetchedVoucher(res.data);
        }
      })
      .catch((error) => {
        setAlertSeverity("error");
        setOpenSnackbar(true);
        setSnackbarMessage(
          "Failed to fetch voucher listing! Error: " + error.response.data
        );
        console.log(error);
      });
  }, [voucherCode]);

  return (
    <PageStructure
      // icon={<MdRedeem size={"1.5em"} />}
      icon={<IoMdDoneAll size={"1.5em"} />}
      title={`Redeem Voucher`}
      breadcrumbs={<ActiveLastBreadcrumb />}
    >
      <BodyCard>
        <div className={"flex flex-col gap-4"}>
          {/*<label htmlFor={"voucherCode"}>Enter voucher code:</label>*/}
          <FieldLabel htmlFor={"voucherCode"}>Enter voucher code:</FieldLabel>
          <TextField
            id={"voucherCode"}
            name={"voucherCode"}
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            required
            placeholder={"Enter voucher code"}
          />
          <Button
            type={"button"}
            className={ButtonClassSets.primary + " self-center"}
            onClick={getVoucherListing}
          >
            Fetch Voucher Details
          </Button>
        </div>
      </BodyCard>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <ConfirmModalV2
        open={fetchedVoucher != null}
        onClose={() => setFetchedVoucher(null)}
        headerText={"Voucher Details"}
        confirmButtonCallbackFn={() => {
          redeemVoucher();
          setFetchedVoucher(null);
        }}
        backButtonCallbackFn={() => setFetchedVoucher(null)}
        confirmButtonStyle={ButtonStyles.selected}
        confirmButtonText={"Redeem Voucher"}
        paperClassName={"w-1/2 max-w-full"}
      >
        <div className={"flex flex-col gap-4"}>
          {/* We can show a picture on the right in the future i guess*/}
          <ContentCard>
            <h2 className={"text-2xl font-bold"}>Voucher {voucherCode}</h2>
            {fetchedVoucher ? (
              <>
                {/* theres no input fields here, I'd say still a valid use since im using it to title fields*/}
                <div className={"flex flex-col"}>
                  <FieldLabel>Voucher Name</FieldLabel>
                  <p>{fetchedVoucher.voucherName}</p>
                </div>
                <div className={"flex flex-col"}>
                  <FieldLabel>Voucher Value</FieldLabel>
                  <p>
                    {"$" +
                      ConvertMoney.centsToDollars(fetchedVoucher.voucherValue)}
                  </p>
                </div>
                <div className={"flex flex-col"}>
                  <FieldLabel>Voucher Expiry Date</FieldLabel>
                  <p>{fetchedVoucher.voucherExpiryDate}</p>
                </div>
                <div className={"flex flex-col"}>
                  <FieldLabel>Voucher Status</FieldLabel>
                  {/* CAN DO SOME RED IF EXPIRED*/}
                  <p className={""}>{fetchedVoucher.voucherStatusEnum}</p>
                </div>
              </>
            ) : (
              <p>Nothing to show</p>
            )}
          </ContentCard>
        </div>
      </ConfirmModalV2>
    </PageStructure>
  );
}
