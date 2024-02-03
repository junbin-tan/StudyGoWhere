import React, { useState, useEffect, useContext } from "react";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import Api from "../../FunctionsAndContexts/Api";
import Modal from "./Modal";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import { FiPlusCircle } from "react-icons/fi";
import FieldLabel from "../CommonComponents/Form/FieldLabel";
import TextField from "@mui/material/TextField";

const AddMenuSectionsButton = ({ menu }) => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const [showModal, setShowModal] = useState(false);
  const [menuSection, setMenuSection] = useState({
    menuSectionName: "",
    menuSectionDescription: "",
  });

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setMenuSection({
      menuSectionName: "",
      menuSectionDescription: "",
    });
    setShowModal(false);
  };

  const handleSave = async () => {
    try {
      const response = await Api.addSectionToMenu(
        menu?.menuId,
        menuSection,
        encodedToken
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Menu section added successfully:", data);
        setMenuSection({
          menuSectionName: "",
          menuSectionDescription: "",
        });
        window.location.reload();
      } else {
        console.error("Failed to add menu section:", data);
      }
    } catch (error) {
      console.error("Error saving menu section:", error);
    }

    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuSection((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // console.log(menu?.menuId ? menu?.menuId : "0");
  // console.log(menuSection);

  return (
    <>
      <button onClick={handleOpenModal} className={ButtonClassSets.primary}>
        <FiPlusCircle size="1.5rem" /> Add Menu Section
      </button>
      <Modal isOpen={showModal} onClose={handleCloseModal} onSave={handleSave}>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <FieldLabel className="block text-xl font-medium text-gray-700">
              Menu Section Name:
            </FieldLabel>
            <TextField
              type="text"
              name="menuSectionName"
              value={menuSection.menuSectionName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <FieldLabel className="block text-xl font-medium text-gray-700">
              Menu Section Description:
            </FieldLabel>
            <TextField
              name="menuSectionDescription"
              value={menuSection.menuSectionDescription}
              required
              onChange={handleChange}
              multiline
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddMenuSectionsButton;
