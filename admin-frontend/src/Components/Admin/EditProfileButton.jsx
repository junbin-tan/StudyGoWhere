import React from "react";
import { useNavigate } from "react-router-dom";

const EditProfileButton = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/viewmyprofilepage");
  };

  
  return (
    <button
      onClick={handleButtonClick}
      className={`bg-teal-400 hover:bg-teak-500text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
    >
      My Profile
    </button>
  );
};

export default EditProfileButton;
