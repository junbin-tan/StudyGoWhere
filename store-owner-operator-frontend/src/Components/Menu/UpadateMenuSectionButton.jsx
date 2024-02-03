import React, { useState, useEffect, useContext } from "react";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import Api from "../../FunctionsAndContexts/Api";
import EditMenuModal from "./EditMenuModal";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import { AiOutlineEdit } from "react-icons/ai";
import FieldLabel from "../CommonComponents/Form/FieldLabel";
import { TextField } from "@mui/material";

const UpdateMenuSectionButton = ({ menuSection }) => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const [showModal, setShowModal] = useState(false);
  const [menuSectionDetails, setMenuSectionDetails] = useState({
    menuSectionId: "",
    menuSectionName: "",
    menuSectionDescription: "",
  });

  useEffect(() => {
    setMenuSectionDetails({
      menuSectionId: menuSection ? menuSection.menuSectionId : "",
      menuSectionName: menuSection ? menuSection.menuSectionName : "",
      menuSectionDescription: menuSection
        ? menuSection.menuSectionDescription
        : "",
    });
  }, [menuSection]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    try {
      const response = await Api.updateMenuSection(
        menuSectionDetails,
        encodedToken
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Menu section updated successfully:", data);
        window.location.reload();
      } else {
        console.error("Failed to update menu section:", data);
      }
    } catch (error) {
      console.error("Error saving menu section:", error);
    }
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuSectionDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <button onClick={handleOpenModal} className={ButtonClassSets.secondary}>
        <AiOutlineEdit size="1.5rem" /> Edit
      </button>
      <EditMenuModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        title={"Update Menu Section"}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <FieldLabel>Menu Section Name</FieldLabel>
            <TextField
              type="text"
              name="menuSectionName"
              value={menuSectionDetails.menuSectionName}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <FieldLabel>Menu Section Description</FieldLabel>
            <TextField
              name="menuSectionDescription"
              value={menuSectionDetails.menuSectionDescription}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </div>
        </div>
      </EditMenuModal>
    </>
  );
};

export default UpdateMenuSectionButton;
