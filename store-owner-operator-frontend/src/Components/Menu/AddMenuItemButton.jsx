import React, { useState, useEffect, useContext } from "react";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import Api from "../../FunctionsAndContexts/Api";
import ModalAddMenuItem from "./ModalAddMenuItem";
import FormClassSets from "../../utilities/FormClassSets";
import FieldInfo from "../CommonComponents/Form/FieldInfo";
import FieldLabel from "../CommonComponents/Form/FieldLabel";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import Button from "@mui/material/Button";
import { ref, uploadBytes } from "firebase/storage";
import storage from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import FirebaseFunctions from "../../FunctionsAndContexts/FirebaseFunctions";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { FiPlusCircle } from "react-icons/fi";

const AddMenuItemButton = ({ menuSection }) => {
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");

  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const [showModal, setShowModal] = useState(false);
  const [menuItem, setmenuItem] = useState({
    menuItemName: "",
    menuItemDescription: "",
    imageURL: "",
    sellingPrice: 0,
    costPrice: 0,
    enabled: true,
    adminBanned: false,
  });
  //   console.log(menuItem)

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setmenuItem({
      menuItemName: "",
      menuItemDescription: "",
      imageURL: "",
      sellingPrice: 0,
      costPrice: 0,
      enabled: true,
      adminBanned: false,
    });
    setUploaded(false);
    setUploadedImage("");
    setShowModal(false);
  };

  const handleUploadError = () => {
    alert("Failed to upload image");
  };

  const handleSave = async () => {
    try {
      const response = await Api.addMenuItemToSection(
        menuSection?.menuSectionId,
        menuItem,
        encodedToken
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Menu item added successfully:", data);
        setmenuItem({
          menuItemName: "",
          menuItemDescription: "",
          imageURL: "",
          sellingPrice: 0,
          costPrice: 0,
          enabled: true,
          adminBanned: false,
        });
        window.location.reload();
      } else {
        console.error("Failed to add menu item:", data);
      }
    } catch (error) {
      console.error("Error saving menu item:", error);
    }

    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setmenuItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const uploadImage = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (!file) {
      setLoading(false);
      return;
    }
    const path = "menuItem-images/" + uuidv4();
    const imageRef = ref(storage, path);
    uploadBytes(imageRef, file)
      .then((res) => {
        setUploaded(true);
        setmenuItem((prev) => ({ ...prev, imageURL: path }));
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

  return (
    <>
      <button onClick={handleOpenModal} className={ButtonClassSets.primary}>
        <FiPlusCircle size="1.5rem" />
        Add Menu Item
      </button>
      <ModalAddMenuItem
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <FieldLabel>Menu Item Name</FieldLabel>
            <TextField
              name="menuItemName"
              value={menuItem.menuItemName}
              onChange={handleChange}
              required
              sx={{ width: "500px" }}
            />
          </div>
          <div className="flex flex-col">
            <FieldLabel>Menu Item Description</FieldLabel>
            <TextField
              name="menuItemDescription"
              multiline
              rows={4}
              value={menuItem.menuItemDescription}
              onChange={handleChange}
              sx={{ width: "500px" }}
            />
          </div>
          <div className="flex flex-col">
            <FieldLabel>Selling Price</FieldLabel>
            <TextField
              name="sellingPrice"
              type="number"
              value={menuItem.sellingPrice}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <FieldLabel>Cost Price</FieldLabel>
            <TextField
              name="costPrice"
              type="number"
              value={menuItem.costPrice}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>Upload Image</FieldLabel>
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
        </div>
      </ModalAddMenuItem>
    </>
  );
};

export default AddMenuItemButton;
