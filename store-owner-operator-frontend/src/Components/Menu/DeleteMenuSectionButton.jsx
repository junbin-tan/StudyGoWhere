import React, { useState, useEffect, useContext } from "react";
import Api from "../../FunctionsAndContexts/Api";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import { useNavigate } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import ButtonClassSets from "../../utilities/ButtonClassSets";

const DeleteMenuSectionButton = ({ menuSection }) => {
  const navigate = useNavigate();
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  const handleDelete = async () => {
    Api.deleteMenuSection(menuSection?.menuSectionId, encodedToken);
    navigate(0);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        className={ButtonClassSets.danger}
      >
        <AiOutlineDelete size="1.5rem" />
        Delete
      </button>
    </div>
  );
};

export default DeleteMenuSectionButton;
