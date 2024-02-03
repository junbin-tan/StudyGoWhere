import React from "react";
import Api from "../../Helpers/Api";
import { useNavigate } from "react-router-dom";  
import useEncodedToken from "../../Helpers/useEncodedToken";

const AdminDropDownButton = ({ admin, refreshData }) => {
  const { encodedToken } = useEncodedToken();

  const handleToggleActivation = () => {
    if (admin.enabled) {
      Api.deleteAdmin(admin.id, encodedToken).then((response) => {
        if (response.ok) {
          console.log("Admin deactivated successfully");
          refreshData();
        } else {
          console.error("Error deactivating admin");
        }
      });
    } else {
      Api.activateAdmin(admin.id, encodedToken).then((response) => {
        if (response.ok) {
          console.log("Admin activated successfully");
          refreshData();
        } else {
          console.error("Error activating admin");
        }
      });
    }
  };

  const navigate = useNavigate();  // Initialize the useNavigate hook

  const handleEdit = () => {
    navigate(`/editAdmin/${admin.id}`); // Assuming the route for editing an admin is like /editAdmin/{adminId}
  };


  return (
    <div className="flex flex-row gap">
      <div>
      <button
        onClick={handleEdit}
        className="bg-blue-400 hover:bg-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-2 text-center mr-2" // Added some classes for styling
      >
        Edit
      </button>

      </div>

      <div>
        {admin.enabled ? (
          <button
            onClick={handleToggleActivation}
            className="bg-red-400 hover:bg-red-500 text-white font-medium rounded-lg text-sm px-3 py-2 text-center"
          >
            Deactivate
          </button>
        ) : (
          <button
            onClick={handleToggleActivation}
            className="bg-green-400 hover:bg-green-500 text-white font-medium rounded-lg text-sm px-3 py-2 text-center"
          >
            Activate
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminDropDownButton;
