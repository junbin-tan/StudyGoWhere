import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import storage from "../../../firebase";
import EditImageCarousel from "./EditImageCarousel";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import ButtonStyles from "../../../utilities/ButtonStyles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import FetchOwnerInfoAPI from "../../../FunctionsAndContexts/FetchOwnerInfoAPI";
import PageStructure from "../../PageStructure/PageStructure";
import LocalImageCarousel from "./LocalImageCarousel";
import ImageNameList from "./ImageNameList/ImageNameList";
import ButtonClassSets from "../../../utilities/ButtonClassSets";
import FieldLabel from "../../CommonComponents/Form/FieldLabel";

export default function VenueImages({
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

  const [localImagesSrc, setLocalImagesSrc] = useState([]);

  const uploadImageLocal = async (e) => {
    e.preventDefault();
    const imageFiles = [...e.target.files]; // e.target.files is a FileList, so we need to convert it to an array

    // creates a new FileReader for each file. trust me, its simpler and less clusterfucky this way
    imageFiles.forEach((imageFile) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target.result;
        console.log("adding dataURL to localImagesSrc", dataURL);
        setLocalImagesSrc((prev) => [...prev, dataURL]);
      };
      reader.file = imageFile;
      reader.readAsDataURL(imageFile);
    });
  };

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
        FetchOwnerInfoAPI.updateVenue(encodedToken, newFormData);
        handleUploadSuccess();
      })
      .catch((error) => {
        console.log(error);
        handleUploadError();
      })
      .finally(() => {
        setLoading(false);
        // setTriggerReload(!triggerReload);
      });
  };

  const [deleteImageSuccess, setDeleteImageSuccess] = useState(false);
  const [deleteImageError, setDeleteImageError] = useState(false);
  const handleOnDeletePicture = async (image_url, path) => {
    try {
      setFirebaseURL((prevFirebaseUrl) =>
        prevFirebaseUrl.filter((url) => url.imageURL !== image_url)
      );
      /** Initially we deleted the actual image and its reference stored on firebase.
       *However we decided that keeping the image reference would facilitate much more efficient operations,
       *such as copying of venues and admin stuff (having a copy of a deleted image)
       * We then can periodically "clean" the database by deleting images with no venue back-reference
       */

      // const fileRef = ref(storage, path);
      // await deleteObject(fileRef);

      // delete image path from formData
      const modifiedFormData = {
        ...formData,
        images: formData.images.filter((formPath) => formPath !== path),
      };

      // delete display image path if it is the same as the deleted image path
      console.log("formData.displayImagePath is", formData.displayImagePath);
      console.log("path is", path);

      if (formData.displayImagePath === path) {
        console.log("display image path is the same as deleted image path");
        modifiedFormData.displayImagePath = null;
      }

      setFormData(modifiedFormData);
      await FetchOwnerInfoAPI.updateVenue(encodedToken, modifiedFormData);
      setDeleteImageSuccess(true);
    } catch (error) {
      console.log("Error deleting image URL for", path, ":", error);
      setDeleteImageError(error.message);
    }
  };

  const [changeDisplayImageSuccess, setChangeDisplayImageSuccess] =
    useState(false);
  const [changeDisplayImageError, setChangeDisplayImageError] = useState(false);
  const handleOnSetDisplayImage = async (path) => {
    const modifiedFormData = { ...formData, displayImagePath: path };
    setFormData(modifiedFormData);
    console.log("modifiedFormData is", modifiedFormData);
    FetchOwnerInfoAPI.updateVenue(encodedToken, modifiedFormData)
      .then(() => setChangeDisplayImageSuccess(true))
      .catch((error) => setChangeDisplayImageError(error.message));
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
  }, [paths]); // Re-run the effect whenever 'paths' changes

  if (paths === undefined) return <></>;

  return (
    <div className="card border border-solid border-gray-300 px-5 py-8 rounded-lg shadow-lg bg-lightgray-80 ">
      <div className="flex flex-col">
        {/* <ImageStepper images={firebaseURL}/> */}
        {/* === SNACKBARS ===*/}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={uploadError}
          onClose={() => setUploadError(false)}
          message="Error"
          autoHideDuration={5000}
          key={"errorSnackbar"}
        >
          <Alert severity="error">Error in uploading image!</Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={uploadSuccess}
          onClose={() => setUploadSuccess(false)}
          message="Success"
          autoHideDuration={5000}
          key={"successSnackbar"}
        >
          <Alert severity="success">Upload of image successful!</Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={changeDisplayImageSuccess}
          onClose={() => setChangeDisplayImageSuccess(false)}
          message="Success"
          autoHideDuration={5000}
          key={"displaySuccessSnackbar"}
        >
          <Alert
            onClose={() => setChangeDisplayImageSuccess(false)}
            severity="success"
          >
            Successfully set image as display image!
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={changeDisplayImageError}
          onClose={() => setChangeDisplayImageError(false)}
          message="Error!"
          autoHideDuration={5000}
          key={"displayErrorSnackbar"}
        >
          <Alert
            onClose={() => setChangeDisplayImageError(false)}
            severity="error"
          >
            Something went wrong ! Please try again. Error message:{" "}
            {changeDisplayImageError}
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={deleteImageSuccess}
          onClose={() => setDeleteImageSuccess(false)}
          message="Success"
          autoHideDuration={5000}
          key={"deleteImageSuccessSnackbar"}
        >
          <Alert
            onClose={() => setDeleteImageSuccess(false)}
            severity="success"
          >
            Successfully deleted image!
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={deleteImageError}
          onClose={() => setDeleteImageError(false)}
          message="Error!"
          autoHideDuration={5000}
          key={"deleteImageErrorSnackbar"}
        >
          <Alert onClose={() => setDeleteImageError(false)} severity="error">
            Something went wrong ! Please try again. Error message:{" "}
            {deleteImageError}
          </Alert>
        </Snackbar>
        {/* !== SNACKBARS-END ===*/}
        <div className="flex flex-col">
          <FieldLabel className="">Venue Images</FieldLabel>
          <div className="">
            {firebaseURL && firebaseURL.length !== 0 ? (
              <EditImageCarousel
                className="mx-auto"
                items={firebaseURL}
                onDelete={handleOnDeletePicture}
                onSetDisplayImage={handleOnSetDisplayImage}
              />
            ) : (
              "You currently do not have any images uploaded."
            )}
          </div>
        </div>

        {/*<ImageNameList/>*/}

        {/*{firebaseURL && firebaseURL.length !== 0 ? <EditImageCarousel className="mx-auto" items={firebaseURL} onDelete={handleOnDeletePicture}/> :*/}

        {/*{localImagesSrc.length != 0 &&  <LocalImageCarousel items={localImagesSrc.map(src => ({imageURL: src})) } />}*/}

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
                    ? "bg-custom-yellow text-center"
                    : "bg-custom-yellow text-center"
                }
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

            {/*<Button*/}
            {/*    component="label"*/}
            {/*    variant="contained"*/}
            {/*    className={*/}
            {/*        uploaded*/}
            {/*            ? "bg-brown-80 text-center"*/}
            {/*            : "bg-brown-80 text-center"*/}
            {/*    }*/}
            {/*    sx={{ marginTop: 2 }}*/}
            {/*    startIcon={<CloudUploadIcon />}*/}
            {/*>*/}
            {/*    [LOCAL UPLOAD] Upload image{" "}*/}

            {/*    <VisuallyHiddenInput*/}
            {/*        type="file"*/}
            {/*        multiple={true}*/}
            {/*        onChange={uploadImageLocal}*/}
            {/*    />*/}
            {/*</Button>*/}
          </div>
        </div>
      </div>
    </div>
  );
}
