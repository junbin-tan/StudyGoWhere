import React from "react";
import { useNavigate } from "react-router-dom";

const AdvertisementDropDownButton = ({ advert }) => {

  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/viewAdvertisementDetails/${advert.id}`);
  };

  return (
    <div className="flex flex-row gap">
      <div>
        <button
          onClick={handleEdit}
          className="bg-blue-400 hover:bg-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-2 text-center mr-2" // Added some classes for styling
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default AdvertisementDropDownButton;
