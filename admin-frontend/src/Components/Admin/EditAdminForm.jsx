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
import React from "react";
import { useState, useEffect } from "react";
import Api from "../../Helpers/Api";
import { useNavigate } from "react-router-dom";
import useEncodedToken from "../../Helpers/useEncodedToken";

const EditAdminForm = ({ admin }) => {
  const { encodedToken } = useEncodedToken();
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    setAdminDetails({
      name: admin?.name || "",
      email: admin?.email || "",
      username: admin?.username || "",
      password: "",
    });
  }, [admin]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let response;
      if (adminDetails.password.trim() === "") {
        const { password, ...adminDetailsWithoutPassword } = adminDetails;
        response = await Api.updateAdminNoPassword(
          admin.userId,
          adminDetailsWithoutPassword,
          encodedToken
        );
      } else {
        response = await Api.updateAdmin(
          admin.userId,
          adminDetails,
          encodedToken
        );
      }

      const data = await response.json();
      if (response.ok) {
        // navigate("/admin");
        setOpenSnackbar(true);
        setSnackbarMessage("Account details has been updated");
      } else {
        console.error("Error updating admin:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    setAdminDetails({
      ...adminDetails,
      [e.target.name]: e.target.value,
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
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

            {/* <div>
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
            </div> */}

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
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default EditAdminForm;
