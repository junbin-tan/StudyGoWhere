import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import SideBar from "../Components/SideBar/SideBar";
import useEncodedToken from "../FunctionsAndContexts/useEncodedToken";
import Api from "../FunctionsAndContexts/FetchOwnerInfoAPI";
import PageStructure from "../Components/PageStructure/PageStructure";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { styled } from "@mui/material/styles";
import storage from "../firebase";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ButtonClassSets from "../utilities/ButtonClassSets";
import FieldLabel from "../Components/CommonComponents/Form/FieldLabel";

const ViewMyProfile = ({ ownerData }) => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [updateAccount, setUpdateAccount] = useState(false);
  const { ownerData: owner, setOwnerData } = useContext(OwnerVenuesContext);
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    console.log(confirmPassword);
  };
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const { encodedToken } = useEncodedToken();
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  function ActiveLastBreadcrumb({ name }) {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/venues">
            Home
          </Link>
          <Link
            underline="hover"
            className="text-custom-yellow"
            aria-current="page"
          >
            {name}
          </Link>
        </Breadcrumbs>
      </div>
    );
  }

  useEffect(() => {
    Api.getOwner(encodedToken)
      .then((response) => {
        const { userId, username, email, name } = response.data;
        setUserData(response.data);
        setFormData({
          userId,
          username,
          password: "", // Always set password as empty string
          email,
          name,
        });
      })
      .catch((error) => {
        console.error("Error fetching admin details:", error);
      });
  }, [encodedToken]);

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    password: "",
    email: "",
    name: "",
  });

  console.log("inside");
  console.log(formData);
  console.log("inside");
  const onImageChange = (images) => {
    setFormData((data) => {
      const _formData = { ...data };
      _formData["images"] = images;
      return _formData;
    });
  };
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

  // ... Other parts of your code

  const handleEditProfile = async (event) => {
    event.preventDefault();

    const ownerId = formData.userId;
    if (formData.password !== confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords mismatched" });
      return;
    }
    try {
      const response = await Api.updateOwner(encodedToken, ownerId, formData);

      if (response.status === 200) {
        console.log("Update successful:", response.data);
        setUpdateAccount(true);
        setTimeout(() => {
          setUpdateAccount(false);
        }, 5000);
        // You can also add further handling here, like showing a success message or redirecting
        // add further handling here, like showing a success message or redirecting
        setIsSuccessModalOpen(true);
      } else {
        console.log("Error updating owner:", response.data);
        // Handle error scenarios here, like showing an error message
      }
    } catch (error) {
      console.error("Error sending the update request:", error);
    }
  };
  const SuccessModal = () => {
    return (
      // Modal content for success message
      <>
        <div className="modal-overlay"></div>
        {/* <dialog id="success" className="modal modal-bottom sm:modal-middle"> */}
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center inset-0 z-50 bg-lightgray-80 border border-solid border-lightgray-100 px-5 py-10 rounded-lg h-64 w-fit text-center flex flex-col justify-between">
          <h3 className="font-bold text-xl text-custom-yellow">
            Profile successfully updated!
          </h3>
          <p>Your profile has been updated successfully.</p>
          <Link to="/venues">
            <button className="bg-custom-yellow px-4 py-2 w-fit rounded-md text-white hover:bg-custom-yellow-hover">
              Confirm
            </button>
          </Link>
        </div>
        {/* </dialog> */}
      </>
    );
  };

  const uploadImage = async (event) => {
    setLoading(true);
    const promiseArr = [];
    const pathArr = [];
    const files = event.target.files;

    for (const file of files) {
      const path = "user-images/" + formData.userId;
      const imageRef = ref(storage, path);
      const promise = uploadBytes(imageRef, file)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
        })
        .catch((error) => {
          console.log("Error");
        })
        .finally(() => {
          setLoading(false);
        });
      promiseArr.push(promise);
      pathArr.push(path);
    }

    Promise.all(promiseArr)
      .then((res) => {
        setOwnerData(JSON.parse(JSON.stringify(owner)));
        setSnackbar(true);
        setTimeout(() => {
          setSnackbar(false);
        }, 5000);
        setUploaded(true);
        onImageChange(pathArr);
      })
      .catch((error) => {
        console.log("Error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const ErrorModal = () => {
    return (
      // Modal content for error message
      <>
        <div className="fixed inset-0 z-50 bg-lightgray-80 border border-solid border-lightgray-100 px-5 py-10 rounded-lg h-64 w-auto text-center flex flex-col justify-between">
          <div className="modal-overlay"></div>
          <h3 className="font-bold text-xl text-custom-yellow">
            Error while updating profile
          </h3>
          <p>Please try again later</p>

          <button className={ButtonClassSets.primary}>Confirm</button>
        </div>
      </>
    );
  };
  return (
    <>
      <PageStructure
        title="My Profile"
        breadcrumbs={<ActiveLastBreadcrumb name={"Profile"} />}
      >
        <div>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackbar}
            message="Success"
            key={"top" + "center1"}
          >
            <Alert severity="success">Image Upload Success</Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={updateAccount}
            message="Success"
            key={"top" + "center2"}
          >
            <Alert severity="success">Update Account Success</Alert>
          </Snackbar>
          {/* {isSuccessModalOpen && (
            <SuccessModal onClose={handleCloseSuccessModal} />
          )}
          {isErrorModalOpen && <ErrorModal onClose={handleCloseErrorModal} />} */}
          <form className="space-y-2 md:space-y-4" onSubmit={handleEditProfile}>
            <div className="text-left">
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <TextField
                type="text"
                name="name"
                id="name"
                value={formData.name} // Bind this value
                onChange={handleChange}
                placeholder="Full name"
                sx={{ width: "100%" }}
                required
              />
            </div>
            <div className="text-left">
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <TextField
                type="text"
                name="username"
                id="username"
                value={formData.username} // Bind this value
                onChange={handleChange}
                placeholder="Enter username"
                sx={{ width: "100%" }}
                disabled
              />
            </div>
            <div className="text-left">
              <FieldLabel htmlFor="username">Email</FieldLabel>
              <TextField
                type="text"
                name="email"
                id="email"
                value={formData.email} // Bind this value
                onChange={handleChange}
                placeholder="Enter email"
                sx={{ width: "100%" }}
                error={errors.email}
                helperText={errors.email && "Invalid email address"}
                required
              />
            </div>

            <div className="text-left">
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter new password if you want to change"
                onChange={handleChange}
                sx={{ width: "100%" }}
                error={errors.password}
                helperText={
                  errors.password &&
                  "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
                }
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
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>

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
              />
            </div>
            <div className="flex justify-center text-center">
              {!loading && (
                <Button
                  component="label"
                  variant="contained"
                  className={ButtonClassSets.primary}
                  sx={{ marginTop: 2 }}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload image{" "}
                  <span className="ml-2">{uploaded && <CheckBoxIcon />}</span>
                  <VisuallyHiddenInput
                    type="file"
                    onChange={uploadImage}
                    multiple
                  />
                </Button>
              )}
              {loading && <CircularProgress />}
            </div>
            <div className="flex justify-end">
              <Button type="submit" className={ButtonClassSets.primary}>
                Update Account
              </Button>
            </div>
          </form>
        </div>
      </PageStructure>
    </>
  );
};

export default ViewMyProfile;
