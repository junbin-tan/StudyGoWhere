import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Helpers/Api";
import useEncodedToken from "../Helpers/useEncodedToken";
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

const MyProfileForm = () => {
  const { encodedToken } = useEncodedToken();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [emailInUseError, setEmailInUseError] = useState(false);


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

  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    Api.getAdminByToken(encodedToken)
      .then((response) => response.json())
      .then((data) => setAdmin(data))
      .catch((error) => console.error("Error fetching admin:", error));
  }, [encodedToken]); // The effect will re-run if encodedToken changes

  const [adminDetails, setAdminDetails] = useState({
    id: "",
    name: "",
    email: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    setAdminDetails({
      id: admin?.userId || "",
      name: admin?.name || "",
      email: admin?.email || "",
      username: admin?.username || "",
      password: "",
    });
  }, [admin]);

  const handleChange = (e) => {
    setAdminDetails({
      ...adminDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      let response;
      console.log(adminDetails.id);
      if (adminDetails.password.trim() === "") {
        const { password, ...adminDetailsWithoutPassword } = adminDetails;
        console.log(adminDetailsWithoutPassword);
        response = await Api.updateAdminNoPassword(
          adminDetails.id,
          adminDetailsWithoutPassword,
          encodedToken
        );
      } else {
        response = await Api.updateAdmin(
          adminDetails.id,
          adminDetails,
          encodedToken
        );
      }
  
      const data = await response.json();
      console.log(response);
      if (response.ok) {
        setOpenSnackbar(true);
        setSnackbarMessage("Account has been updated");
      } else {
        if (response.status === 409) {
          setEmailInUseError(true);
        } else {
          setEmailInUseError(true);
          console.error("Error:", data.error);
        }
      }
    } catch (error) {
      setEmailInUseError(true);
      console.error("Error:", error);
    }
  };
  

  return (
    <div>
      <div className="w-screen rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            <span className="text-gray-700">Profile:</span>
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={adminDetails.name}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder=""
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium "
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={adminDetails.email}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder=""
                required
              />
            </div>

            {/* <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium "
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={adminDetails.username}
                onChange={handleChange}
                className=" bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                required
              />
            </div> */}

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={adminDetails.password}
                  onChange={handleChange}
                  className=" bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="***********"
                />
                <button
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Update account
              </button>
            </div>
          </form>
        </div>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={emailInUseError}
          autoHideDuration={5000}
          onClose={() => setEmailInUseError(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setEmailInUseError(false)} severity="error">
            Email is already in use, please use another email account
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default MyProfileForm;
