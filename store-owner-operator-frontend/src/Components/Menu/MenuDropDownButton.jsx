import React, { useContext, useEffect, useState } from "react";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import Api from "../../FunctionsAndContexts/FetchOwnerInfoAPI";
import { useNavigate } from "react-router-dom";


const MenuDropDownButton = ({menuHere}) => {
    const [token, setToken, encodedToken] = useContext(LoginTokenContext);


    const navigate = useNavigate();

    const handleEdit = () => {
      // do something
      navigate(`/edit-menu/${menuHere.id}`);
    };
    return (
        <div className="flex flex-row w-48 items-center justify-center">
          <div>
            <button
              onClick={handleEdit}
              className="bg-blue-400 hover:bg-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-2 text-center mr-2"
            >
              Edit
            </button>
          </div>      
        </div>
      );
}

export default MenuDropDownButton