import { Alert, Card, Snackbar, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { BACKEND_PREFIX } from "../../FunctionsAndContexts/serverPrefix";
import axios from "axios";
import { decodeJwt } from "jose";
import { useNavigate } from "react-router-dom";
import Api from "../../FunctionsAndContexts/Api";

function VerificationCard({ email, username, setToken, setEncodedToken }) {
  const [pins, setPins] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [subTypeDetails, setSubTypeDetails] = useState({
    subscriptionTypeId: "1",
    subscriptionTypeName: "Free",
    subscriptionTypeVenueLimit: 1,
    subscriptionTypePrice: 0,
    subscriptionTypeDetails: "Free Tier",
  });
  let navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackBarSeverity] = useState("error");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };
  const handleVerify = async (e) => {
    const verificationCode = pins.join("");
    e.preventDefault();
    if (verificationCode.length < 6) {
      setSnackbarMessage("Incomplete Verification Code");
      setOpenSnackbar(true);
    } else {
      console.log("VERIFY CODE HERE");

      try {
        const response = await axios.post(
          `${BACKEND_PREFIX}/public/owner/verify`,
          {
            username,
            verificationCode,
          }
        );

        if (response.status == 200) {
          console.log("redirect")
          let tokenString = response.data.token;
          setEncodedToken(tokenString);
          let decodedToken = decodeJwt(tokenString);
          setToken(decodedToken);
          Api.buySubscription(subTypeDetails, tokenString);
          navigate("/");
        }
      } catch (error) {
        setSnackBarSeverity("error");
        if (error.status == 403) {
          setSnackbarMessage(error.response.data.error);
          setOpenSnackbar(true);
        } else if (error.status == 500) {
          setSnackbarMessage(error.response.data.error);
          setOpenSnackbar(true);
        } else {
          console.log(error);
          setSnackbarMessage(error);
          setOpenSnackbar(true);
        }
      }
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_PREFIX}/public/owner/resend-verification`,
        {
          username,
          email,
        }
      );
      if (response.status == 200) {
        setSnackBarSeverity("success");
        setSnackbarMessage("Successfully sent verification code");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackBarSeverity("error");
      setSnackbarMessage("Failed to send verification code");
      setOpenSnackbar(true);
    }
  };

  const handleBackspace = (index, event) => {
    if (event.keyCode === 8) {
      const newPins = [...pins];
      newPins[index] = "";
      setPins(newPins);
      if (index > 0) {
        inputRefs[index - 1].current.focus();
      }
      event.preventDefault();
    }
  };

  const handleOnFill = (index, event) => {
    const newPins = [...pins];
    newPins[index] = event.target.value;
    setPins(newPins);

    if (event.target.value.length === 1 && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  return (
    <>
      <div className="relative flex flex-row w-full justify-center px-16 lg:px-24 xl:px-52 py-10 pt-32">
        <Card variant="outlined" sx={{ maxWidth: 500, minWidth: 400 }}>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center md:text-2xl text-custom-yellow">
              Verify your account
            </h1>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
            <p>
              A verification code has been sent to <strong>{email}</strong>
            </p>
            <form
              className="space-y-2 md:space-y-4"
              onSubmit={(e) => handleVerify(e)}
            >
              <div className="flex flex-row items-center justify-center">
                {" "}
                {pins.map((pin, index) => {
                  return (
                    <input
                      ref={inputRefs[index]}
                      value={pins[index]}
                      className="text-center w-12 h-12 text-xl border-b border-black mx-1 outline-none"
                      maxLength={1}
                      onChange={(e) => handleOnFill(index, e)}
                      onKeyDown={(e) => handleBackspace(index, e)}
                    />
                  );
                })}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-green-400 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                // className={ButtonClassSets.success}
                // replace className with ButtonClassSets when the default styling is decided on
              >
                Verify
              </button>
              <div className="max-w-max mx-auto">
                <p
                  className="underline text-blue-400 cursor-pointer hover:text-blue-600"
                  onClick={handleResendCode}
                >
                  resend code
                </p>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}

export default VerificationCard;
