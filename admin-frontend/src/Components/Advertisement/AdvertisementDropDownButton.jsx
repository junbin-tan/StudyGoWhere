import React from "react";
import Api from "../../Helpers/Api";
import { useNavigate } from "react-router-dom";
import useEncodedToken from "../../Helpers/useEncodedToken";

const AdvertisementDropDownButton = ({ advert, refreshData }) => {
  const { encodedToken } = useEncodedToken();
  
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/verifyAdvert/${advert.id}`);
  };

  return (
    <div className="flex flex-row gap">
      <div>
        <button
          onClick={handleEdit}
          className="bg-blue-400 hover:bg-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-2 text-center mr-2" // Added some classes for styling
        >
          Verify
        </button>
      </div>

    </div>
  );
};

export default AdvertisementDropDownButton;
