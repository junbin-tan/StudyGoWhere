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

export default function CreateAdvertisementForm({ formData }) {
  const [open, setOpen] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState({});

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

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        await Api.addAnAdvertisement(advertisement, encodedToken);
        setOpenSnackbar(true);
        setSnackbarMessage("Advertisement Created");
      } catch (error) {
        console.error("An error occurred while creating advertisement:", error);
      }
    }
  };

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
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={false} // Define the Snackbar open state and message
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success" onClose={handleCloseSnackbar}>
          Advertisement Created
        </Alert>
      </Snackbar>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        startIcon={<CloudUploadIcon />}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Add Advertisement
        {uploaded && <CheckBoxIcon />}
      </Button>
      <Dialog open={open} fullWidth={true} maxWidth="sm" onClose={handleClose}>
        <form onSubmit={handleCreate}>
          <DialogContent className="">
            <h1 className="text-lg font-semibold">
              Create a New Advertisement
            </h1>

            <div className="flex flex-col gap-8 mt-5">
              <div>
                <h2 className="">Advertisement Name</h2>
                <TextField
                  // label="Advertisement Name"
                  variant="outlined"
                  fullWidth
                  name="name"
                  required
                  onChange={handleInputChange}
                  value={advertisement.name}
                />
              </div>
              <div>
                <h2 className="">Advertisement Description</h2>
                <TextField
                  // label="Advertisement Description"
                  variant="outlined"
                  fullWidth
                  name="description"
                  required
                  onChange={handleInputChange}
                  value={advertisement.description}
                />
              </div>
              <div>
                <h2 className="">Start Date</h2>
                <input
                  className="border border-gray-300 rounded-md"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px",
                    margin: "8px 0",
                    boxSizing: "border-box",
                  }}
                  type="date"
                  name="startDate"
                  required
                  min={getCurrentDate()}
                  onChange={handleInputChange}
                  value={advertisement.startDate}
                />
              </div>

              <div>
                <h2 className="">End Date</h2>
                <input
                  className="border border-gray-300 rounded-md"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px",
                    margin: "8px 0",
                    boxSizing: "border-box",
                  }}
                  type="date"
                  name="endDate"
                  required
                  min={getCurrentDate()}
                  onChange={handleInputChange}
                  value={advertisement.endDate}
                />
              </div>

              <div>
                <h2 className="">Cost Per Impression</h2>
                <TextField
                  // label="Cost Per Impression"
                  variant="outlined"
                  fullWidth
                  name="costPerImpression"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={advertisement.costPerImpression}
                  error={Boolean(errors.costPerImpression)}
                  helperText={errors.costPerImpression}
                />
              </div>
              <div>
                <h2 className="">Total Budget</h2>
                <TextField
                  // label="Billable Price"
                  variant="outlined"
                  fullWidth
                  name="billablePrice"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={advertisement.billablePrice}
                  error={Boolean(errors.billablePrice)}
                  helperText={errors.billablePrice}
                />
              </div>
            </div>

            {/* Add other form fields */}
            <div className="grid grid-cols-3 text-center items-center justify-items-center m-4">
              <div></div>
              <div>
                {!loading && (
                  <Button
                    component="label"
                    variant="contained"
                    className={"bg-brown-80 text-center font-medium"}
                    sx={{ marginTop: 2 }}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload image {uploaded && <CheckBoxIcon />}
                    <VisuallyHiddenInput
                      type="file"
                      onChange={uploadImage}
                      multiple
                    />
                  </Button>
                )}
                {loading && <CircularProgress />}
              </div>
              <div></div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} className="text-red-500">Cancel</Button>
            <Button type="submit" variant="contained" className="bg-blue-500 hover:bg-blue-600 text-white">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
