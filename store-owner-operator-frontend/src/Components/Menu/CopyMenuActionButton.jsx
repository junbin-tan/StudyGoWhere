import React, { useContext, useEffect, useState } from "react";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import Api from "../../FunctionsAndContexts/Api";
import { useNavigate } from "react-router-dom";

const CopyMenuActionButton = ({ menuHere, venue }) => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

//   console.log(menuHere);
  console.log(venue);

  const navigate = useNavigate();

  const handleCopyMenu = () => {
    Api.copyMenuToVenue(menuHere.id, venue.venueId, encodedToken).then(
      (response) => {
        if (response.ok) {
            window.location.reload();
          console.log("Menu copied successfully");
        } else {
          console.error("Error copying menu");
        }
      }
    );
  };

  return <div><button 
    onClick={handleCopyMenu}
  className="bg-green-400 hover:bg-green-500 text-white font-medium rounded-lg text-sm px-3 py-2 text-center">
    Copy</button></div>;
};

export default CopyMenuActionButton;
