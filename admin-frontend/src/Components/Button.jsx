import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ title, location }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (location) {
      navigate(location);
    }
  };

  const buttonClass =
    title === "Back"
      ? "bg-red-400 hover:bg-red-500"
      : "bg-blue-700 hover:bg-blue-800";

  return (
    <button
      onClick={handleButtonClick}
      className={`${buttonClass} text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
    >
      {title}
    </button>
  );
};

export default Button;
