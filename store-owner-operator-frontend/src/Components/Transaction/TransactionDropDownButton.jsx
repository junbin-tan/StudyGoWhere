import React from "react";
import { useNavigate } from "react-router-dom";  
import useEncodedToken from "../../FunctionsAndContexts/useEncodedToken";
import Api from "../../FunctionsAndContexts/Api";
const TransactionDropDownButton = ({ transaction, scope }) => {
  const { encodedToken } = useEncodedToken();

  const handleEdit = () => {  
    navigate(`/transactions/${transaction.id}`);
  }

  const navigate = useNavigate();  // Initialize the useNavigate hook


  return (
    <div className="flex flex-row gap">

      <div>          <button
            onClick={handleEdit}
            className="bg-blue-400 hover:bg-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-2 text-center mr-2" 
          >
            View Details
          </button>
    
      </div>
    </div>
  );
};

export default TransactionDropDownButton;
