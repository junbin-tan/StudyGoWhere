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
import { SwitchCameraSharp } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import VerificationCard from "../Verification/VerificationCard";
import Api from "../../FunctionsAndContexts/Api";
import BodyCard from "../CommonComponents/Card/BodyCard";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import studyImage from "../../Assets/image/studying.jpg";

function SignUpFormCard({ setToken, setEncodedToken }) {
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openVerification, setOpenVerification] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };
  //   const [email, setEmail] = useState("");
  //   const [emailExists, setEmailExists] = useState(false);

  const [subTypeDetails, setSubTypeDetails] = useState({
    subscriptionTypeId: "1",
    subscriptionTypeName: "Free",
    subscriptionTypeVenueLimit: 1,
    subscriptionTypePrice: 0,
    subscriptionTypeDetails: "Free Tier",
  });

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (formData.password !== confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords mismatched" });
      return;
    } else {
      setErrors({ ...errors, confirmPassword: undefined });
    }
    if (Object.values(errors).some((error) => error)) {
      console.log("Form has errors. Please correct them before submitting.");
      return;
    }
    try {
      setIsWaitingForResponse(true);
      const response = await axios.post(
        `${BACKEND_PREFIX}/public/owner/first-register`,
        formData
      );

      if (response.status === 200) {
        setOpenVerification(true);
      }

      console.log("Response from API:", response.status, response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          console.log(
            "Username / Email already exists. Please choose a different one."
          );
          // Show a message to the user or trigger a snackbar here
          setOpenSnackbar(true);
          setSnackbarMessage(
            "Username / Email already exists. Please choose a different one."
          );
        } else if (error.response.status === 403) {
          setOpenSnackbar(true);
          setSnackbarMessage(
            "User is registered but not verified. Please login to verify account."
          );
        }
      } else if (error.request) {
        console.log("No response received.");
      } else {
        console.log("Error:", error.message);
      }
    }
    setIsWaitingForResponse(false);
  };

  const logTokenValue = () => {
    console.log(localStorage.getItem("token"));
  };
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
  });

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    console.log(confirmPassword);
  };

  // takes name variable from TextField and maps the key:value pair accordingly to the formData
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    // Add validation checks for specific fields
    // Add validation checks for specific fields
    switch (name) {
      case "email":
        setErrors({
          ...errors,
          email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? "Email must be a valid email address!"
            : undefined,
        });
        break;
      case "password":
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        const isValidPassword = passwordRegex.test(value);
        setErrors({
          ...errors,
          password: isValidPassword
            ? undefined
            : "Password must be at least 8 characters with at least 1 uppercase, 1 lowercase, 1 numeric & 1 special character",
        });
        break;
      // Add validations for other fields as needed
      default:
        break;
    }
  };

  return !openVerification ? (
    <>
      <div className="relative flex flex-row w-full justify-center px-16 lg:px-24 xl:px-52 py-10">
        <div
          className="w-full rounded-l-2xl px-2 "
          style={{
            backgroundImage: `url(${studyImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        >
          {/* <SignUpSvg className="w-72 h-72 mx-auto" /> */}
        </div>
        <BodyCard variant="outlined" className="rounded-l-none w-full">
          {/* form */}
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
          <div className="p-6 sm:p-8">
            <h1 className="text-xl font-semibold text-center md:text-2xl text-custom-yellow mb-8">
              Get Started <br />
              <span className="text-base font-normal text-gray-80">
                Join our StudyGoWhere network.
              </span>
            </h1>

            <form className="space-y-2 md:space-y-6" onSubmit={handleSignUp}>
              <div className="text-left">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-custom-yellow"
                >
                  Full Name
                </label>
                <TextField
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  sx={{ width: "100%" }}
                  required
                />
              </div>
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
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-custom-yellow"
                >
                  Email
                </label>
                <TextField
                  type="text"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  sx={{ width: "100%" }}
                  error={errors.email}
                  helperText={errors.email && "Invalid email address"}
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

                <TextField
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  sx={{ width: "100%" }}
                  error={errors.password}
                  helperText={
                    errors.password &&
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
                  }
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="text-left">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-custom-yellow"
                >
                  Confirm Password
                </label>

                <TextField
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Enter same password"
                  sx={{ width: "100%" }}
                  error={errors.confirmPassword}
                  helperText={
                    errors.confirmPassword &&
                    "Passwords must be the same, please try again"
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                className={
                  "w-full mt-5 text-white bg-custom-yellow hover:drop-shadow-lg duration-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center" +
                  " " +
                  (isWaitingForResponse ? "opacity-50 cursor-not-allowed" : "")
                }
                //   className={ButtonClassSets.primary + " text-center"}
                // disabled={isWaitingForResponse}
              >
                Sign Up
              </Button>
            </form>
          </div>
        </BodyCard>
      </div>

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
    </>
  ) : (
    <>
      <VerificationCard
        email={formData.email}
        username={formData.username}
        setToken={setToken}
        setEncodedToken={setEncodedToken}
      />
    </>
  );
}

export default SignUpFormCard;
