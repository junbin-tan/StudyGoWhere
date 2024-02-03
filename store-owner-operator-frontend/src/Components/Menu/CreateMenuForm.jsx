import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, TextField } from "@mui/material"; // Added TextField import
import { Select, MenuItem } from "@mui/material";
import Api from "../../FunctionsAndContexts/Api";
import Button from "@mui/material/Button";
import FieldLabel from "../CommonComponents/Form/FieldLabel";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import { useNavigate } from "react-router-dom";
import BodyCard from "../CommonComponents/Card/BodyCard";
import FieldInfo from "../CommonComponents/Form/FieldInfo";
import ButtonClassSets from "../../utilities/ButtonClassSets";

// TODO: Add validation for menu name and description
const CreateMenuForm = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);
  const initialMenu = {
    menuName: "",
    menuDescription: "",
  };
  const [menu, setMenu] = useState(initialMenu);
  const navigate = useNavigate();

  const handleClear = () => {
    setMenu(initialMenu);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setMenu((prevMenu) => ({
      ...prevMenu,
      [name]: value,
    }));
  };

  const handleCreateMenu = async (e) => {
    try {
      const response = await Api.ownerCreateMenuTemplate(
        ownerData.userId,
        menu,
        encodedToken
      );
      if (response.status === 200) {
        const responseData = await response.json();
        console.log("Menu created successfully");
        const menuObject = responseData;
        navigate(`/edit-menu/${menuObject.menuId}`);
      } else {
        console.log("Error in creating menu");
      }
    } catch (error) {
      console.error("An error occurred while creating menu:", error);
    }
  };

  return (
    <BodyCard>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-lg font-semibold">Create New Menu</h2>
          <FieldInfo>Fill in details of new menu</FieldInfo>
        </div>

        {/* Menu Name */}
        <div className="flex flex-col">
          <FieldLabel>Menu Name</FieldLabel>
          <TextField
            className="w-[500px]"
            variant="outlined"
            name="menuName"
            required
            onChange={handleInputChange}
            value={menu.menuName}
          />
        </div>

        {/* Menu Description */}
        <div className="flex flex-col">
          <FieldLabel>Menu Description</FieldLabel>
          <TextField
            className="w-[500px]"
            variant="outlined"
            name="menuDescription"
            multiline
            minRows={3}
            required
            onChange={handleInputChange}
            value={menu.menuDescription}
          />
        </div>

        {/* Submit and Cancel buttons */}
        <div className="flex gap-3 items-center justify-end ">
          <Button
            onClick={handleClear}
            style={{ border: "1px solid" }}
            className={ButtonClassSets.secondary}
          >
            Clear
          </Button>
          <Button
            onClick={handleCreateMenu}
            className={ButtonClassSets.primary}
          >
            Create Menu
          </Button>
        </div>
      </div>
    </BodyCard>
  );
};
export default CreateMenuForm;
