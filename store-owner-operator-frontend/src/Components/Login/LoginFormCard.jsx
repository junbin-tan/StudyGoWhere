import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { decodeJwt } from "jose";
import { BACKEND_PREFIX } from "../../FunctionsAndContexts/serverPrefix";
import { useNavigate } from "react-router-dom";
import VerificationCard from "../Verification/VerificationCard";
import BodyCard from "../CommonComponents/Card/BodyCard";
import studyImage from "../../Assets/image/librarystudy.jpg";

function LoginFormCard({ setToken, setEncodedToken }) {
  let navigate = useNavigate();
  const [errors, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openVerification, setOpenVerification] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_PREFIX}/public/owner/authenticate`,
        {
          username: formData.username,
          password: formData.password,
        }
      );
      if (response.status === 200) {
        let tokenString = response.data.token;
        setEncodedToken(tokenString);
        let decodedToken = decodeJwt(tokenString);
        setToken(decodedToken);
        navigate("/");
        console.log("success");
      } else {
        setError({ ...errors, invalid: "Invalid username or password" });
      }
      if (response.status === 404) {
        setOpenSnackbar(true);
        setSnackbarMessage("Invalid username or password.");
      }
      console.log("Response from API:", response.status, response.data);
    } catch (error) {
      console.log(error);
      // need to do optional chaining if server is turned off off, because there will be no response object
      // ALSO, these are shitty error codes, since 403 is for forbidden, and 404 is for not found
      // but in our case, 403 is for not verified, and 404 is for banned.
      // and 500 is for internal server error, but we use it as invalid username or password.
      // but I'm not changing anything because things might break.
      if (error.response?.status === 403) {
        setFormData({ ...formData, email: error.response.data.email });
        setOpenVerification(true);
      } else if (error.response?.status === 404) {
        setOpenSnackbar(true);
        setSnackbarMessage(error.response?.data?.error);
      } else if (error.response?.status === 500) {
        console.error("Error sending the request:", error);
        setOpenSnackbar(true);
        setSnackbarMessage("Invalid username or password.");
      } else if (error.code == "ERR_NETWORK") {
        setOpenSnackbar(true);
        setSnackbarMessage("Network error. Please try again later.");
      } else {
        setOpenSnackbar(true);
        setSnackbarMessage("An unknown error has occurred.");
      }
    }
  };

  const logTokenValue = () => {
    console.log(localStorage.getItem("token"));
  };
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  // takes name variable from TextField and maps the key:value pair accordingly to the formData
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return !openVerification ? (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="relative flex flex-row w-full justify-center px-16 lg:px-24 xl:px-72 py-24 md:py-16 lg:py-10 ">
        <div
          className="w-full rounded-l-2xl px-2 "
          style={{
            backgroundImage: `url(${studyImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        ></div>
        <BodyCard variant="outlined" className="rounded-l-none w-full">
          {/* form */}

          <div className="flex flex-col items-center py-12 md:py-16 lg:py-20">
            <div className="flex flex-col gap-2 items-center pb-10">
              <h1 className="text-2xl font-semibold  text-custom-yellow text-center">
                Login to your
                <br />
                business account
              </h1>
              <h1 className="text-base text-gray-80">
                Please enter your email and password
              </h1>
            </div>

            <form
              className="flex flex-col gap-5 w-full px-10"
              onSubmit={handleLogin}
            >
              <div className="text-left">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-custom-yellow"
                >
                  Username
                </label>
                <TextField
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="text-left">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-custom-yellow"
                >
                  Password
                </label>
                <div className="relative">
                  <TextField
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
              {/* <div className="flex items-center justify-between">
                  <div></div>
                  <a href="#" className="text-sm font-medium text-white hover:underline">Forgot password?</a>
              </div> */}
              <button
                type="submit"
                className="w-full mt-5 text-white bg-custom-yellow hover:drop-shadow-lg duration-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
            </form>
          </div>
        </BodyCard>
        {/* <SignUpSvg className="w-72 h-72 mx-auto" /> */}
      </div>
    </>
  ) : (
    <>
      <VerificationCard
        username={formData.username}
        email={formData.email}
        setToken={setToken}
        setEncodedToken={setEncodedToken}
      />
    </>
  );
}

export default LoginFormCard;
