import React, { useState, useEffect } from "react";
import { TextField, TextareaAutosize, Button, Card } from "@mui/material";
import axios from "axios";
import { BACKEND_PREFIX } from "../../../FunctionsAndContexts/serverPrefix";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { styled } from "@mui/material/styles";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../../../firebase";
import FetchOwnerInfoAPI from "../../../FunctionsAndContexts/FetchOwnerInfoAPI";
import ButtonStyles from "../../../utilities/ButtonStyles";
import ConfirmModalV2 from "../../CommonComponents/Modal/ConfirmModalV2";
import AddressMap from "../AddressMap";
import AddressAutocomplete from "../AddressAutocomplete";

// we can pass in owner Id as props??
function VenueEditDetailsForm({ encodedToken, venue }) {
    const navigate = useNavigate();
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openingHours, setOpeningHours] = useState(venue.openingHours);
    // for some reason, accessing address and setting address directly within formData fks up the selecting of address
    // in the address autocomplete component, so we have to use this state variable to store the address string
    const [selectedAddress, setSelectedAddress] = useState(venue.address.address);
    
    const [selectedLatLng, setSelectedLatLng] = useState({
        lat: venue.address.latitude,
        lng: venue.address.longitude
    })
    useEffect(() => {
        setFormData({ ...formData, address: { ...formData["address"],
        address: selectedAddress, latitude: selectedLatLng.lat, longitude: selectedLatLng.lng } });
    }, [selectedAddress, selectedLatLng])
    
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


    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };
    const handleClose = (e) => {
        setUploadError(false);
    };
    const handleUploadError = () => {
        setUploadError(true);
        setTimeout(() => {
            setUploadError(false);
        }, 5000);
    };
    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

  const handleCloseConfirmDeleteModal = () => {
    setIsConfirmDeleteModalOpen(false);
  };

  const ConfirmDeleteModal = () => {
    return (
      <>
        <div className="modal-overlay"></div>
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center inset-0 z-50 bg-lightgray-80 border border-solid border-lightgray-100 px-5 py-10 rounded-lg h-64 w-fit text-center flex flex-col justify-between">
          <h3 className="font-bold text-xl text-brown-90">
            Are you sure you want to delete this venue?
          </h3>
          <p>This process is irreversible.</p>

          <Link to="/venues">
            <Button
              onClick={() =>
                FetchOwnerInfoAPI.deleteVenueById(
                  encodedToken,
                  venue.venueId
                ).then((res) => {
                  if (res.status == 200) navigate("/venues");
                })
              }
              variant="contained"
              style={ButtonStyles.delete}
            >
              Confirm delete
            </Button>
          </Link>
          <Button
            onClick={handleCloseConfirmDeleteModal}
            variant="contained"
            style={ButtonStyles.back}
          >
            Cancel
          </Button>
        </div>
      </>
    );
  };
  const SuccessModal = () => {
    return (
      // Modal content for success message
      <>
        <div className="modal-overlay"></div>
        {/* <dialog id="success" className="modal modal-bottom sm:modal-middle"> */}
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center inset-0 z-50 bg-lightgray-80 border border-solid border-lightgray-100 px-5 py-10 rounded-lg h-64 w-fit text-center flex flex-col justify-between">
          <h3 className="font-bold text-xl text-brown-90">
            Venue successfully updated!
          </h3>
          <p>Venue {formData.venueName} has been updated.</p>

          <Link to="/venues">
            <button className="bg-brown-80 px-4 py-2 w-fit rounded-md text-white hover:bg-brown-100">
              Confirm
            </button>
          </Link>
        </div>
        {/* </dialog> */}
      </>
    );
  };

  const ErrorModal = () => {
    return (
      // Modal content for error message
      <>
        <div className="fixed inset-0 z-50 bg-lightgray-80 border border-solid border-lightgray-100 px-5 py-10 rounded-lg h-64 w-auto text-center flex flex-col justify-between">
          <div className="modal-overlay"></div>
          <h3 className="font-bold text-xl text-brown-90">
            Error while updating venue
          </h3>
          <p>Please try again later</p>

          <button className="bg-brown-80 px-4 py-2 rounded-md text-white hover:bg-brown-100">
            Confirm
          </button>
        </div>
      </>
    );
  };

    const [formData, setFormData] = useState({
        venueId: venue.venueId,
        venueName: venue.venueName,
        address: {
            addressId: venue?.address?.addressId,
            address: venue?.address?.address,
            postalCode: venue?.address?.postalCode,
            latitude: venue?.address?.latitude,
            longitude: venue?.address?.longitude,
        },
        phoneNumber: venue.phoneNumber,
        description: venue.description,
        venueStatus: venue.venueStatus,
        images: venue.images, // this one need to confirm
    });

  const [errors, setErrors] = useState({
    venueName: false,
    addressLine1: false,
    addressPostalCode: false,
    phoneNumber: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name == "addressLine1") {
      setFormData({
        ...formData,
        address: { ...formData["address"], address: value },
      });
    } else if (name == "addressPostalCode") {
      setFormData({
        ...formData,
        address: { ...formData["address"], postalCode: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

        switch (name) {
            case "venueName":
                setErrors({ ...errors, venueName: value.trim() === "" });
                break;
            case "addressLine1":
                setErrors({ ...errors, addressLine1: value.trim() === "" });
                break;
            case "addressPostalCode":
                setErrors({ ...errors, addressPostalCode: !/^\d{6}$/.test(value) });
                break;
            case "phoneNumber":
                setErrors({ ...errors, phoneNumber: !/^\d{8}$/.test(value) });
                break;
            default:
                break;
        }
    };

  // !== IMAGE UPLOADING METHODS ===
  const onImageChange = (images) => {
    setFormData((prev) => {
      const _formData = { ...prev };
      _formData["images"] = formData["images"].concat(images);
      return _formData;
    });
  };
  const uploadImage = (e) => {
    e.preventDefault();
    const files = e.target.files;
    const promiseArr = [];
    const pathArr = [];
    for (const file of files) {
      const path = "venue-images/" + uuidv4();
      const imageRef = ref(storage, path);
      const promise = uploadBytes(imageRef, file);
      promiseArr.push(promise);
      pathArr.push(path);
    }

    Promise.all(promiseArr)
      .then((res) => {
        setUploaded(true);
        onImageChange(pathArr);
      })
      .catch((error) => {
        handleUploadError();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // !-- END OF EDIT VENUE OPENING HOURS
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("handleSubmit is called");

    if (Object.values(errors).some((error) => error)) {
      console.log("Form has errors. Please correct them before submitting.");
      return;
    }

    let authorisationString = "Bearer " + encodedToken;

    // REAL request sending, sends to protected endpoint
    try {
      const response = await axios.put(
        `${BACKEND_PREFIX}/owner/put-venue`,
        formData,
        {
          headers: {
            Authorization: authorisationString,
            "content-type": "application/json",
            // actually also need 'content-type': 'application/json' here, but i think spring boot takes care of the interpretation
          },
        }
      );
      console.log("Response from API:", response.data);
      setIsSuccessModalOpen(true); // Show success modal
    } catch (error) {
      console.error("Error sending the request:", error);
      setIsErrorModalOpen(true);
    }
  };

    return (
        <>
            {/*need to check if the <form> fucks up the styling*/}
            <div className="card border border-solid border-gray-300 px-5 py-8 rounded-lg shadow-lg bg-lightgray-80 ">
                <form onSubmit={handleSubmit}>
                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        open={uploadError}
                        onClose={handleClose}
                        message="Error"
                        key={"top" + "center"}
                    >
                        <Alert severity="error">Error in Uploading Image(s)</Alert>
                    </Snackbar>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 xl:gap-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 col-span-1 md:col-span-3 lg:col-span-3 items-center">
                            <p className="col-span-1 regular-medium">Venue Name</p>
                            <TextField
                                className="col-span-1 md:col-span-2"
                                name="venueName"
                                required
                                value={formData.venueName}
                                onChange={handleChange}
                            />
                        </div>

                        <hr className="md:col-span-3 border-solid border-lightgray-100 border-t-2" />

                        <div className="col-span-1 md:col-span-3 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 items-center">
                            {/* have to make this the only element in this grid, and it takes up all columns (1 or 3 depending on screen size */}
                            <div className="col-span-1 md:col-span-3">
                                {/* needs a custom setPostalCode method because can't use handleChange here */}
                                <AddressAutocomplete
                                // selectedAddress={formData.address.address} setSelectedAddress={(addressString) => {
                                //     setFormData({...formData, address: { ...formData["address"], address: addressString }})
                                // }}
                                selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress}
                                selectedLatLng={selectedLatLng} setSelectedLatLng={setSelectedLatLng}
                                selectedPostalCode={formData.address.postalCode}
                                setSelectedPostalCode={(postalCodeString) => { 
                                    setFormData({...formData, address: { ...formData["address"], postalCode: postalCodeString }})
                                }}
                                handlePostalCodeChange={handleChange}
                                postalCodeError = {errors.addressPostalCode}
                                setPostalCodeError = {((bool) => {
                                    setErrors({...errors, addressPostalCode: bool})
                                })}
                                />
                                
                            </div>
                        </div>
                        <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 items-center">
                            <div className="col-span-1 md:col-span-3 flex flex-row justify-center">
                                <AddressMap selectedLatLng={selectedLatLng} setSelectedLatLng={setSelectedLatLng} />
                            </div>
                        </div>

                        <hr className="md:col-span-3 border-solid border-lightgray-100 border-t-2" />

                        <div className="col-span-1 md:col-span-3 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3  items-center">
                            <p className="col-span-1 regular-medium">Phone number</p>
                            <TextField
                                className="col-span-1 md:col-span-2"
                                name={"phoneNumber"}
                                required
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                error={errors.phoneNumber}
                                helperText={errors.phoneNumber && "Invalid phone number"}
                            />
                        </div>
                        <hr className="md:col-span-3 border-solid border-lightgray-100 border-t-2" />
                        <div className="col-span-1 md:col-span-3 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3  items-center">
                            <label htmlFor="description" className="col-span-1 regular-medium">
                                Description
                            </label>
                            <TextareaAutosize
                                className="col-span-1  md:col-span-2 px-5 py-5 bg-lightgray-80 rounded-sm border border-solid border-gray-400"
                                name="description"
                                required
                                minRows={5} // Set a minimum number of rows to start with
                                style={{ width: "100%" }} // Adjust width as needed
                                placeholder="Enter description here..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <hr className="md:col-span-3 border-solid border-lightgray-100 border-t-2" />
                        <div className="col-span-1 md:col-span-3 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3  items-center">
                            <p className="col-span-1 regular-medium">Venue Status</p>
                            <p
                                className={`${
                                    formData.venueStatus === "DEACTIVATED"
                                        ? "text-red-500"
                                        : "text-green-500"
                                }`}
                            >
                                {formData.venueStatus}
                            </p>
                        </div>
                        <hr className="md:col-span-3 border-solid border-lightgray-100 border-t-2" />
                        <div className="col-span-1 md:col-span-3 lg:col-span-3 grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3  items-center">
                            <label htmlFor="description" className="col-span-1 regular-medium">
                                Upload Images
                            </label>
                            <div className="col-span-1 md:col-span-2">
                                {!loading && (
                                    <Button
                                        component="label"
                                        variant="contained"
                                        className={
                                            uploaded
                                                ? "bg-brown-80 text-center"
                                                : "bg-brown-80 text-center"
                                        }
                                        sx={{ marginTop: 2 }}
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload images{" "}
                                        {uploaded && (
                                            <div className="ml-4 text-center">
                                                <CheckBoxIcon />
                                            </div>
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
                        <hr className="md:col-span-3 border-solid border-lightgray-100 border-t-2" />
                        <div className="col-span-1 md:col-span-3 ">
                            <Button
                                onClick={() =>
                                    FetchOwnerInfoAPI.toggleVenueStatusById(
                                        encodedToken,
                                        venue.venueId
                                    ).then((res) => {
                                        if (res.status == 200) navigate(`/venues/${venue.venueId}`);
                                    })
                                }
                                variant="contained"
                                style={{
                                    backgroundColor: "orange",
                                    color: "white",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    fontFamily: "Montserrat",
                                }}
                            >
                                Change venue status
                            </Button>
                        </div>
                        <div className="col-span-1">
                            <Link to={`/venues/${venue.venueId}`}>
                                <Button variant="contained" style={ButtonStyles.back}>
                                    Back
                                </Button>
                            </Link>
                        </div>
                        <span className="hidden md:col-span-1 md:block"></span>
                        <div className="col-span-1">
                            <Button type="submit" variant="contained" style={ButtonStyles.default}>
                                Submit
                            </Button>
                        </div>
                    </div>
                    <div className="col-span-1 lg:col-span-2">
                        <Button
                            onClick={() => console.log(venue)}
                            variant="contained"
                            style={{
                                backgroundColor: "#C8AE7D",
                                color: "white",
                                fontSize: "16px",
                                fontWeight: "500",
                                fontFamily: "Montserrat",
                                display: "none",
                            }}
                        >
                            console.log(venue)
                        </Button>
                    </div>
                    <div className="col-span-1 lg:col-span-3">
                        <Button
                            onClick={() =>
                                FetchOwnerInfoAPI.getVenueById(encodedToken, venue.venueId).then(
                                    (v) => console.log(v)
                                )
                            }
                            variant="contained"
                            style={{
                                backgroundColor: "#C8AE7D",
                                color: "white",
                                fontSize: "16px",
                                fontWeight: "500",
                                fontFamily: "Montserrat",
                                display: "none",
                            }}
                        >
                            fetch venue and then console.log(venue)
                        </Button>
                    </div>

          <div className="col-span-1 lg:col-span-2">
            <Button
              onClick={() =>
                setIsConfirmDeleteModalOpen(!isConfirmDeleteModalOpen)
              }
              variant="contained"
              style={ButtonStyles.delete}
            >
              Delete venue
            </Button>
          </div>
        </form>
      </div>

      {isSuccessModalOpen && <SuccessModal onClose={handleCloseSuccessModal} />}
      {isErrorModalOpen && <ErrorModal onClose={handleCloseErrorModal} />}
      {/* {isConfirmDeleteModalOpen && <ConfirmDeleteModal />} */}
      <ConfirmModalV2
        open={isConfirmDeleteModalOpen}
        headerText="Are you sure you want to delete this venue?"
        bodyText="This process is irreversible."
        confirmButtonStyle={ButtonStyles.delete}
        confirmButtonText="Confirm delete"
        backButtonCallbackFn={() => setIsConfirmDeleteModalOpen(false)}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        confirmButtonCallbackFn={() => {
          FetchOwnerInfoAPI.deleteVenueById(encodedToken, venue.venueId).then(
            (res) => {
              if (res.status === 200) navigate("/venues");
            }
          );
        }}
      />
    </>
  );
}

export default VenueEditDetailsForm;
