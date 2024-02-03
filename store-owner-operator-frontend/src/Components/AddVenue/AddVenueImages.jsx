import React, { useEffect, useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import AddVenueImageCarousel from "./AddVenueImageCarousel";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import storage from "../../firebase";
import ButtonClassSets from "../../utilities/ButtonClassSets";

export default function AddVenueImages({
  formData,
  setFormData,
  paths,
  encodedToken,
}) {
  // boolean useStates
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // !== IMAGE UPLOADING METHODS ===
  // const [paths, setPaths] = useState(venuesPassed?.images);
  const onImageChange = (images) => {
    let newFormData = {};
    setFormData((prev) => {
      const _formData = { ...prev };
      console.log(_formData);
      _formData["images"] = formData["images"].concat(images);
      newFormData = _formData;
      return _formData;
    });
    return newFormData;
  };

  // this is for an upload error & success snackbars
  const handleUploadError = () => {
    setUploadError(true);
    setTimeout(() => {
      setUploadError(false);
    }, 5000);
  };
  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
    }, 5000);
  };
  const uploadImage = async (e) => {
    e.preventDefault();
    console.log("uploadImage is called");
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
        return onImageChange(pathArr);
      })
      .then((newFormData) => {
        // FetchOwnerInfoAPI.updateVenue(encodedToken, newFormData)
        handleUploadSuccess();
      })
      .catch((error) => {
        console.log(error);
        handleUploadError();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleOnDeletePicture = async (image_url, path) => {
    try {
      const fileRef = ref(storage, path);
      setFirebaseURL((prevFirebaseUrl) =>
        prevFirebaseUrl.filter((url) => url.imageURL !== image_url)
      );
      await deleteObject(fileRef);
      setFormData({
        ...formData,
        images: formData.images.filter((url) => url !== path),
      });

      console.log(formData);
    } catch (error) {
      console.log("Error deleting image URL for", path, ":", error);
    }
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
  // !-- END OF IMAGE UPLOADING METHODS --!

  // GETTING FIREBASE URLS FROM VENUE OBJECT
  const [firebaseURL, setFirebaseURL] = useState([]);
  useEffect(() => {
    // Assuming storage is already initialized elsewhere
    if (!paths) return; // Don't do anything if 'paths' is undefined
    Promise.all(
      paths.map(async (path) => {
        try {
          const url = await getDownloadURL(ref(storage, path));
          return { imageURL: url, path: path };
        } catch (error) {
          console.log("Error fetching download URL for", path, ":", error);
          return "null"; // or return a fallback URL or some default value
        }
      })
    ).then((urls) => {
      var toAdd = [];
      urls.map((url) => {
        if (url !== "null") {
          toAdd.push(url);
        }
      });
      setFirebaseURL(toAdd);
    });
  }, [paths]); // Re-run the effect whenever 'paths' changes <-- this is fucking dangerous wtf

  if (paths === undefined) return <></>;

  return (
    <div className="card border border-solid border-gray-300 px-5 py-8 rounded-lg shadow-lg bg-lightgray-80 ">
      <div className="grid grid-cols-4">
        {/* <ImageStepper images={firebaseURL}/> */}
        {/* === SNACKBARS ===*/}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={uploadError}
          onClose={() => setUploadError(false)}
          message="Error"
          key={"errorSnackbar"}
        >
          <Alert severity="error">Error in uploading image!</Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={uploadSuccess}
          onClose={() => setUploadSuccess(false)}
          message="Success"
          key={"successSnackbar"}
        >
          <Alert severity="success">Upload of image successful!</Alert>
        </Snackbar>
        {/* !== SNACKBARS-END ===*/}
        <p className="col-span-1 regular-medium">Venue Images</p>
        <div className="col-span-3">
          {firebaseURL && firebaseURL.length !== 0 ? (
            <AddVenueImageCarousel
              className="mx-auto"
              items={firebaseURL}
              onDelete={handleOnDeletePicture}
            />
          ) : (
            "You currently do not have any images uploaded."
          )}
        </div>
        <div className="col-span-1 md:col-span-3 lg:col-span-3 grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3  items-center">
          <label htmlFor="description" className="col-span-1 regular-medium">
            Upload Images
          </label>
          <div className="col-span-1 md:col-span-2">
            {!loading && (
              <Button
                component="label"
                variant="contained"
                className={ButtonClassSets.primary}
                sx={{ marginTop: 2 }}
                startIcon={<CloudUploadIcon />}
              >
                Upload image{" "}
                {uploaded && (
                  <div className="ml-4 text-center">
                    <CheckBoxIcon />
                  </div>
                )}
                <VisuallyHiddenInput type="file" onChange={uploadImage} />
              </Button>
            )}
            {loading && <CircularProgress />}
          </div>
        </div>
      </div>
    </div>
  );
}
