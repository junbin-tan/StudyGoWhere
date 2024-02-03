import React, { useState, useEffect, useContext } from "react";
import Api from "../../FunctionsAndContexts/Api";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import { useNavigate } from "react-router-dom";
import ButtonClassSets from "../../utilities/ButtonClassSets";

const DeleteMenuItemButton = ({ menuItem }) => {
  const navigate = useNavigate();
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  const handleDelete = async () => {
    Api.deleteMenuItem(menuItem?.menuItemId, encodedToken);
    navigate(0);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        className={ButtonClassSets.danger}
      >
        Delete
      </button>
    </div>
  );
};

export default DeleteMenuItemButton;
