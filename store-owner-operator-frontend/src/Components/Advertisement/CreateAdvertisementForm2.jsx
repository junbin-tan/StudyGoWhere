import React, { useState, useContext, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { ref, uploadBytes } from "firebase/storage";
import storage from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import Api from "../../FunctionsAndContexts/Api";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import FormClassSets from "../../utilities/FormClassSets";
import FieldInfo from "../CommonComponents/Form/FieldInfo";
import FieldLabel from "../CommonComponents/Form/FieldLabel";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import FirebaseFunctions from "../../FunctionsAndContexts/FirebaseFunctions";
import sampleAdvert from "../../Assets/image/sample_advertisement_download.jpg";

const getCurrentDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

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

export default function CreateAdvertisementForm2({ formData }) {
  const [open, setOpen] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");

  const initialAdvertisementState = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    costPerImpression: 0,
    billablePrice: 0,
    image: "",
    impressionsLeft: 0,
    impressionCount: 0,
    reachCount: 0,
  };

  const [advertisement, setAdvertisement] = useState(initialAdvertisementState);

  const handleClear = () => {
    setAdvertisement(initialAdvertisementState); // Reset the advertisement state
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason !== "clickaway") {
      setOpenSnackbar(false);
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setAdvertisement((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadError = () => {
    setOpenSnackbar(true);
    setSnackbarMessage("ERROR Created");
  };

  const uploadImage = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (!file) {
      setLoading(false);
      return;
    }
    const path = "advertisement-images/" + uuidv4();
    const imageRef = ref(storage, path);
    uploadBytes(imageRef, file)
      .then((res) => {
        setUploaded(true);
        setAdvertisement((prev) => ({ ...prev, image: path }));
      })
      .then(() => {
        FirebaseFunctions.convertPathsToDownloadURLs([path]).then((urls) => {
          setUploadedImage(urls[0]);
        });
      })
      .catch(handleUploadError)
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreate = async () => {
    if (advertisement.costPerImpression <= 0) {
      setErrors((errors) => ({
        ...errors,
        costPerImpression: "Cost per impression must be greater than 0",
      }));
    }

    if (advertisement.billablePrice <= 0) {
      setErrors((errors) => ({
        ...errors,
        billablePrice: "Billable price must be greater than 0",
      }));
    }

    if (Object.values(errors).every((err) => !err)) {
      try {
        const response = await Api.addAnAdvertisement(
          advertisement,
          encodedToken
        );

        if (response.status === 200) {
          setOpenSnackbar(true);
          setSnackbarMessage("Advertisement Created");
          setSnackbarSeverity("success");
        } else if (response.status === 500) {
          setOpenSnackbar(true);
          setSnackbarMessage("Insufficient funds");
          setSnackbarSeverity("error"); // Set severity to error
        }
      } catch (error) {
        console.error("An error occurred while creating advertisement:", error);
      }
    }
  };
  
  const handleSampleDownload = () => {
    const fileUrl = sampleAdvert; // Replace with your file URL
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'sample_advertisement.jpg'); // Replace with your desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.open(fileUrl, '_blank');
  }

  useEffect(() => {
    if (advertisement.startDate > advertisement.endDate) {
      setErrors((errors) => ({
        ...errors,
        endDate: "End date must be after the start date",
      }));
    } else {
      setErrors((errors) => ({ ...errors, endDate: "" }));
    }
  }, [advertisement.startDate, advertisement.endDate]);
  return (
    <div className="card border border-solid border-gray-300 px-5 py-8 rounded-lg shadow-lg bg-lightgray-80 ">
      <div className={FormClassSets.formSpacing}>
        <h1 className="text-lg font-semibold -mb-8">
          Create a New Advertisement
        </h1>
        <FieldInfo>
          Advertisement will be shown to students near a venue.
        </FieldInfo>
        {/* Advertisement Name */}
        <div className={FormClassSets.fieldSpacing}>
          <FieldLabel>Advertisement Name</FieldLabel>
          <TextField
            className=""
            variant="outlined"
            name="name"
            required
            onChange={handleInputChange}
            value={advertisement.name}
          />
        </div>

        {/* Advertisement Description */}
        <div className={FormClassSets.fieldSpacing}>
          <FieldLabel>Advertisement Description</FieldLabel>
          <TextField
            className=""
            variant="outlined"
            name="description"
            multiline
            minRows={3}
            required
            onChange={handleInputChange}
            value={advertisement.description}
          />
        </div>

        {/* Start Date */}
        <div className={FormClassSets.fieldSpacing}>
          <FieldLabel>Start Date</FieldLabel>
          <input
            className={FormClassSets.dateField}
            type="date"
            name="startDate"
            required
            min={getCurrentDate()}
            onChange={handleInputChange}
            value={advertisement.startDate}
          />
        </div>

        {/* End Date */}
        <div className={FormClassSets.fieldSpacing}>
          <FieldLabel>End Date</FieldLabel>
          <input
            className={FormClassSets.dateField}
            type="date"
            name="endDate"
            required
            min={getCurrentDate()}
            onChange={handleInputChange}
            value={advertisement.endDate}
          />
        </div>

        {/* Cost Per Impression */}
        <div className={FormClassSets.fieldSpacing}>
          <FieldLabel>Cost Per Impression</FieldLabel>
          <FieldInfo>
            Set amount you would like to bid for each impression. Higher amount
            will be prioritized.
          </FieldInfo>
          <TextField
            className={FormClassSets.numberSpacing}
            variant="outlined"
            name="costPerImpression"
            type="number"
            required
            onChange={handleInputChange}
            value={advertisement.costPerImpression}
            error={Boolean(errors.costPerImpression)}
          />
        </div>

        {/* Total Budget */}
        <div className={FormClassSets.fieldSpacing}>
          <FieldLabel>Total Budget</FieldLabel>
          <TextField
            className={FormClassSets.numberSpacing}
            variant="outlined"
            name="billablePrice"
            type="number"
            required
            onChange={handleInputChange}
            value={advertisement.billablePrice}
            error={Boolean(errors.billablePrice)}
          />
        </div>

        {/* Image Upload */}
        <div className={FormClassSets.fieldSpacing}>
          <FieldLabel>Upload Advertisement Banner</FieldLabel>
          <FieldInfo className="mb-4">
            Please follow the sample advertisement for optimal display. You may find the sample here. <Button className="underline" onClick={handleSampleDownload}>Sample</Button>
          </FieldInfo>
          {uploadedImage && (
            <img src={uploadedImage} className="w-96 h-72 object-contain " />
          )}
          <div className="w-72">
            {!loading && (
              <Button
                component="label"
                variant="contained"
                className={ButtonClassSets.primary}
                startIcon={<CloudUploadIcon />}
              >
                {uploaded ? (
                  <p>
                    Change image <CheckBoxIcon />
                  </p>
                ) : (
                  "Upload image"
                )}
                <VisuallyHiddenInput
                  type="file"
                  onChange={uploadImage}
                  multiple
                />
              </Button>
            )}
            {loading && <CircularProgress />}
          </div>
        </div>

        {/* Submit and Cancel ttons */}
        <div className="flex gap-3 items-center justify-end ">
          <Button onClick={handleClear} className={ButtonClassSets.danger}>
            Clear
          </Button>

          <div className="flex flex-row items-center justify-items-end">
            <Button onClick={handleCreate} className={ButtonClassSets.primary}>
              Create Advertisement
            </Button>
          </div>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={snackbarSeverity} onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
