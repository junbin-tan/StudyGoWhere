import React, { useContext, useEffect, useState } from "react";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import Api from "../../FunctionsAndContexts/FetchOwnerInfoAPI";
import { useNavigate } from "react-router-dom";

const VoucherListingDropDownButton = ({ vcList, refreshData }) => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  const handleToggleActivation = () => {
    Api.activateDeactivateVoucherListingForOwner(vcList.id, encodedToken).then(
      (response) => {
        if (response.ok) {
          console.log("VoucherListing deactivated successfully");
          refreshData();
        } else {
          console.error("Error");
        }
      }
    );
  };

  const navigate = useNavigate();

  const handleEdit = () => {
    // do something
    navigate(`/editVoucherListing/${vcList.id}`);
  };
  console.log(vcList.id);

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

      <div>
        {vcList.enabled == true ? (
          <button
            onClick={handleToggleActivation}
            className={`font-medium rounded-lg text-sm px-3 py-2 text-center w-24 ${
              vcList.adminBanned
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-red-400 hover:bg-red-500 text-white"
            }`}
            disabled={vcList.adminBanned}
          >
            Deactivate
          </button>
        ) : (
          <button
            onClick={handleToggleActivation}
            className={`font-medium rounded-lg text-sm px-3 py-2 text-center w-24 ${
              vcList.adminBanned
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-green-400 hover:bg-green-500 text-white"
            }`}
            disabled={vcList.adminBanned}
          >
            Activate
          </button>
        )}
      </div>
    </div>
  );
};

export default VoucherListingDropDownButton;
