import React, { useState, useEffect, useContext } from "react";
import Api from "../../FunctionsAndContexts/Api";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import { useNavigate } from "react-router-dom";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import { AiOutlineDelete } from "react-icons/ai";

const DeleteMenuButton = ({ menu }) => {
  const navigate = useNavigate();
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  const handleDelete = async () => {
    Api.deleteMenu(menu?.menuId, encodedToken);
    navigate("/menus"); 
    window.location.reload();
  };

  console.log(menu);
  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        className={ButtonClassSets.danger}
      >
        <AiOutlineDelete size="1.5rem" /> Delete
      </button>
    </div>
  );
};

export default DeleteMenuButton;
