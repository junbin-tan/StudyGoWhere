import React, { useState, useEffect } from "react";
import { TextField, TextareaAutosize, Button } from "@mui/material";
import axios from "axios";
import { BACKEND_PREFIX } from "../../FunctionsAndContexts/serverPrefix";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { styled } from "@mui/material/styles";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import AddressAutocomplete from "../Venues/AddressAutocomplete";
import AddressMap from "../Venues/AddressMap";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import BusinessHours from "../BusinessHours/BusinessHours";
import AveragePrice from "../Venues/AveragePrice/AveragePrice";
import Amenities from "../Venues/Amenities/Amenities";

const SectionGrid = ({ children, htmlFor, label }) => {
  return (
    <div className="col-span-3 grid grid-cols-3 items-center">
      {label && (
        <label htmlFor={htmlFor} className="col-span-1">
          {label}
        </label>
      )}
      <div className="col-span-2">{children}</div>
    </div>
  );
};

// we can pass in owner Id as props??
function AddVenueForm({ token, encodedToken }) {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // price
  const [selectedPrice, setSelectedPrice] = useState(0);

  const handlePriceClick = (price) => {
    setSelectedPrice(price);
  };

  // amenities
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const handleAmenitiesChange = (amenityId) => {
    if (selectedAmenities.includes(amenityId)) {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId));
    } else {
      setSelectedAmenities([...selectedAmenities, amenityId]);
    }
  };

  const [selectedAddress, setSelectedAddress] = useState("");

  const [selectedLatLng, setSelectedLatLng] = useState({
    lat: 1.3521,
    lng: 103.8198,
  }); // this is center of sgpore
  useEffect(() => {
    setFormData({
      ...formData,
      addressLatitude: selectedLatLng.lat,
      addressLongitude: selectedLatLng.lng,
      addressLine1: selectedAddress,
    });
  }, [selectedAddress, selectedLatLng]);

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
  const SuccessModal = () => {
    return (
      // Modal content for success message
      <>
        <div className="modal-overlay"></div>
        {/* <dialog id="success" className="modal modal-bottom sm:modal-middle"> */}
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center inset-0 z-50 bg-lightgray-80 border border-solid border-lightgray-100 px-5 py-10 rounded-lg h-64 w-fit text-center flex flex-col justify-between">
          <h3 className="font-bold text-xl text-brown-90">
            Venue successfully created!
          </h3>
          <p>Venue {formData.venueName} has been added to your account.</p>

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
            Error while creating venue
          </h3>
          <p>Please try again later</p>

          <Link to="/venues">
            <button className="bg-brown-80 px-4 py-2 rounded-md text-white hover:bg-brown-100">
              Confirm
            </button>
          </Link>
        </div>
      </>
    );
  };

  const [formData, setFormData] = useState({
    venueName: "",
    addressLine1: "",
    addressPostalCode: "",
    addressLatitude: 0.0,
    addressLongitude: 0.0,
    phoneNumber: "",
    description: "",
    images: [],
    openingHours: [
      {
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        startTime: "09:00",
        endTime: "17:00",
      },
    ],
  });

  // Function to get the day of the week from the index
  const getDayOfWeek = (index) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[index];
  };

  const [errors, setErrors] = useState({
    venueName: false,
    addressLine1: false,
    addressPostalCode: false,
    phoneNumber: false,
  });

  const updateOpeningHour = (index, field, value) => {
    setFormData((prevState) => {
      const updatedOpeningHours = [...prevState.openingHours];
      updatedOpeningHours[index][field] = value.format("HH:mm");
      return { ...prevState, openingHours: updatedOpeningHours };
    });
    console.log(formData);
    // console.log(value.format('HH:mm'));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // explanation of the []: we have to use [name] to specify that the key
    // is the value of the "name" variable instead of a literal String name
    // this only applies to keys in this context apparently
    // #justjavascriptthings
    setFormData({ ...formData, [name]: value });

    // Add validation checks for specific fields
    switch (name) {
      case "venueName":
        setErrors({ ...errors, venueName: value.trim() === "" });
        break;
      case "addressLine1":
        setErrors({ ...errors, addressLine1: value.trim() === "" });
        break;
      case "addressPostalCode":
        setErrors({
          ...errors,
          addressPostalCode: !/^\d{6}$/.test(value),
        });
        break;
      case "phoneNumber":
        setErrors({ ...errors, phoneNumber: !/^\d{8}$/.test(value) });
        break;
      default:
        break;
    }
  };
  const onImageChange = (images) => {
    setFormData((prev) => {
      const _formData = { ...prev };
      _formData["images"] = images;
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
      const response = await axios.post(
        `${BACKEND_PREFIX}/owner/post-venue`,
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
      setIsErrorModalOpen(false);
    }
  };

  return (
    <>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-10">
          <div className="col-span-3 grid grid-cols-3 items-center">
            <p className="col-span-1">Venue Name</p>
            <TextField
              className="col-span-2  outline-required"
              name="venueName"
              required
              label="Venue name"
              value={formData.venueName}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 items-center">
            <div className="col-span-1 md:col-span-3">
              {/* needs a custom setPostalCode method because can't use handleChange here */}
              <AddressAutocomplete
                // selectedAddress={formData.address.address} setSelectedAddress={(addressString) => {
                //     setFormData({...formData, address: { ...formData["address"], address: addressString }})
                // }}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                selectedLatLng={selectedLatLng}
                setSelectedLatLng={setSelectedLatLng}
                selectedPostalCode={formData.addressPostalCode}
                setSelectedPostalCode={(postalCodeString) => {
                  setFormData({
                    ...formData,
                    addressPostalCode: postalCodeString,
                  });
                }}
                handlePostalCodeChange={handleChange}
                postalCodeError={errors.addressPostalCode}
                setPostalCodeError={(bool) => {
                  setErrors({ ...errors, addressPostalCode: bool });
                }}
              />
            </div>
          </div>
          <div className="col-span-3">
            <div className="flex justify-center">
              {selectedLatLng && (
                <AddressMap
                  containerStyle={{ height: "600px", width: "100%" }}
                  selectedLatLng={selectedLatLng}
                  setSelectedLatLng={setSelectedLatLng}
                />
              )}
            </div>
          </div>
          <SectionGrid htmlFor="postalCode" label="Postal Code">
            <TextField
              className="w-full"
              name={"addressPostalCode"}
              required
              label="Postal code"
              value={formData.addressPostalCode}
              onChange={handleChange}
              error={errors.addressPostalCode}
              helperText={errors.addressPostalCode && "Invalid postal code"}
            />
          </SectionGrid>
          <SectionGrid htmlFor="phoneNumber" label="Phone Number">
            <TextField
              className="w-full"
              name={"phoneNumber"}
              required
              label="Phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              helperText={errors.phoneNumber && "Invalid phone number"}
            />
          </SectionGrid>

          <div className="col-span-3 grid grid-cols-3 items-center">
            <label htmlFor="description" className="col-span-1">
              Description
            </label>
            <TextareaAutosize
              className="col-span-2 px-5 py-5 bg-lightgray-80 rounded-sm border border-solid border-gray-400"
              name="description"
              required
              minRows={5} // Set a minimum number of rows to start with
              style={{ width: "100%" }} // Adjust width as needed
              placeholder="Enter description here..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-3 ">
            <label htmlFor="businessHours" className="mb-3">
              Business Hours
            </label>
            <BusinessHours />
          </div>

          <div className="col-span-3 ">
            <label htmlFor="averagePrice" className="mb-3">
              Average Price
            </label>
            <AveragePrice
              selectedPrice={selectedPrice}
              handlePriceClick={handlePriceClick}
            />
          </div>

          <div className="col-span-3 ">
            <label htmlFor="amenities" className="mb-3">
              Available Amenities
            </label>
            <Amenities
              selectedAmenities={selectedAmenities}
              handleAmenitiesChange={handleAmenitiesChange}
            />
          </div>
          {/* <div className="col-span-3 grid grid-cols-3 items-center">
              <label htmlFor="openingHours" className="col-span-1">
                Opening Hours
              </label>
              <div className="flex flex-col col-span-2 md:col-span-2 gap-y-2">
                {formData.openingHours.map((openingHour, index) => (
                  <div key={index} className="">
                    <span className="regular-medium text-brown-90">
                      {getDayOfWeek(index)}:{" "}
                    </span>
                    <TimePicker
                      name={`openingHours[${index}].startTime`}
                      value={openingHour.startTime}
                      onChange={(value) =>
                        updateOpeningHour(index, "startTime", value)
                      }
                      views={["hours", "minutes"]}
                    />
                    -
                    <TimePicker
                      views={["hours", "minutes"]}
                      name={`openingHours[${index}].endTime`}
                      value={openingHour.endTime}
                      onChange={(value) =>
                        updateOpeningHour(index, "endTime", value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div> */}
          <div className="col-span-3 grid grid-cols-3 items-center ">
            <label htmlFor="description" className="col-span-1">
              Upload Images
            </label>
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
          <span className="col-span-2 lg:col-span-3"></span>
          <div className="col-span-1 lg:col-span-2">
            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "#C8AE7D",
                color: "white",
                fontSize: "16px",
                fontWeight: "500",
                fontFamily: "Montserrat",
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>

      {isSuccessModalOpen && <SuccessModal onClose={handleCloseSuccessModal} />}
      {isErrorModalOpen && <ErrorModal onClose={handleCloseErrorModal} />}
    </>
  );
}

export default AddVenueForm;
