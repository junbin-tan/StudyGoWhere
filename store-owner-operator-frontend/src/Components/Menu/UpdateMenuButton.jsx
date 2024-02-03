import React, { useState, useEffect, useContext } from "react";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import Api from "../../FunctionsAndContexts/Api";
import EditMenuModal from "./EditMenuModal";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import { AiOutlineEdit } from "react-icons/ai";
import FieldLabel from "../CommonComponents/Form/FieldLabel";
import { TextField } from "@mui/material";

const UpdateMenuButton = ({ menu }) => {
  console.log(menu);
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const [showModal, setShowModal] = useState(false);
  const [menuDetails, setMenuDetails] = useState({
    menuId: menu ? menu.menuId : "",
    menuName: menu ? menu.menuName : "",
    menuDescription: menu ? menu.menuDescription : "",
  });

  useEffect(() => {
    setMenuDetails({
      menuId: menu ? menu.menuId : "",
      menuName: menu ? menu.menuName : "",
      menuDescription: menu ? menu.menuDescription : "",
    });
  }, [menu]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    try {
      const response = await Api.updateMenu(menuDetails, encodedToken);
      const data = await response.json();
      if (response.ok) {
        console.log("Menu updated successfully:", data);
        window.location.reload();
      } else {
        console.error("Failed to update menu:", data);
      }
    } catch (error) {
      console.error("Error saving menu :", error);
    }

    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <button onClick={handleOpenModal} className={ButtonClassSets.secondary}>
        <AiOutlineEdit size="1.5rem" /> Edit{" "}
      </button>
      <EditMenuModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        title={"Update Menu"}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <FieldLabel>Menu Name</FieldLabel>
            <TextField
              type="text"
              name="menuName"
              value={menuDetails.menuName}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <FieldLabel>Menu Description</FieldLabel>
            <TextField
              name="menuDescription"
              value={menuDetails.menuDescription}
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

export default UpdateMenuButton;
