import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = () => {
    localStorage.clear();

    // Replace the current entry in the history stack with "/login"
    // This way, pressing the "back" button won't go back to the protected page.
    navigate("/login", { replace: true });
  };

  return (
    <button
      onClick={handleButtonClick}
      className={`bg-red-400 hover:bg-red-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
