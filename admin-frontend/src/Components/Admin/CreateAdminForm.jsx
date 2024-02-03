import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar, Button } from "@mui/material";
import Api from "../../Helpers/Api";
import useEncodedToken from "../../Helpers/useEncodedToken";

const CreateAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { encodedToken } = useEncodedToken();

  const [adminDetails, setAdminDetails] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.name = adminDetails.name ? "" : "Name is required.";
    tempErrors.email = adminDetails.email ? "" : "Email is required.";
    tempErrors.username = adminDetails.username ? "" : "Username is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    setAdminDetails({
      ...adminDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      Api.createAdmin(adminDetails, encodedToken)
        .then((response) => response.json())
        .then((data) => {
          console.log("Admin created:", data);
          navigate("/admin");
          setAdminDetails({
            name: "",
            email: "",
            username: "",
            password: "",
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          setOpenSnackbar(true);
          setSnackbarMessage("Account username/email already exists or other error occurred.");
        });
    } else {
      setOpenSnackbar(true);
      setSnackbarMessage("Please fill in all the fields.");
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="w-screen rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            Create an account
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
                // required
              />
              {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium ">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={adminDetails.email}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder=""
                // required
              />
              {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium ">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={adminDetails.username}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                // required
              />
              {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateAdmin;
