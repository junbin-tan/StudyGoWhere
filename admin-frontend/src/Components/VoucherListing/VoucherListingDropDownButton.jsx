import React, { useContext, useEffect, useState } from "react";
import Api from "../../Helpers/Api";
import { useNavigate } from "react-router-dom";
import useEncodedToken from "../../Helpers/useEncodedToken";

const VoucherListingDropDownButton = ({ voucherListing, refreshData }) => {
  const { encodedToken } = useEncodedToken();
  const navigate = useNavigate();

  const handleToggleActivation = () => {
    Api.activateVoucher(voucherListing.id, encodedToken).then((response) => {
      if (response.ok) {
        console.log("Voucher action successfully");
        refreshData();
      } else {
        console.error("Error");
      }
    });
  };

  const handleEdit = () => {
    navigate(`/viewVoucherListingDetails/${voucherListing.id}`);
  };

  return (
    <div className="flex flex-row gap">
      <div>
        <button
          onClick={handleEdit}
          className="bg-blue-400 hover:bg-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-2 text-center mr-2" // Added some classes for styling
        >
          View
        </button>
      </div>

      <div>
        {voucherListing.adminBanned ? (
          <button
            onClick={handleToggleActivation}
            className="bg-green-400 hover:bg-green-500 text-white font-medium rounded-lg text-sm px-3 py-2 text-center"
          >
            Unban
          </button>
        ) : (
          <button
            onClick={handleToggleActivation}
            className="bg-red-400 hover:bg-red-500 text-white font-medium rounded-lg text-sm px-3 py-2 text-center"
          >
            Ban
          </button>
        )}
      </div>
    </div>
  );
};

export default VoucherListingDropDownButton;
