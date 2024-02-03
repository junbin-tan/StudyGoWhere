import React from 'react'
import Api from "../../Helpers/Api";
import { useNavigate } from "react-router-dom";  
import useEncodedToken from "../../Helpers/useEncodedToken";
import RefundDialog from './RefundDialog';
const OwnerDropDownButton = ({owner, refreshData}) => {
    const { encodedToken } = useEncodedToken();

    const handleToggleActivation = () => {
        Api.activateDeactivateOwner(owner.id, encodedToken).then((response) => {
          if (response.ok) {
            console.log("Owner action successfully");
            refreshData();
          } else {
            console.error("Error");
          }
        });
    };
  
    const navigate = useNavigate();  // Initialize the useNavigate hook
  
    const handleEdit = () => {
        navigate(`/viewowner/${owner.id}`);
      };
    const [open, setOpen] = React.useState(false);
  
    return (
      <div className="flex flex-row gap">
        <RefundDialog 
            handleClose={() => setOpen(false)}
            open={open}
            owner={owner}>
        </RefundDialog>
        <div>
        <button
          onClick={handleEdit}
          className="bg-blue-400 hover:bg-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-2 text-center mr-2" // Added some classes for styling
        >
          View
        </button>
  
        </div>
  
        <div>
          {owner.enabled ? (
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
          <button
            onClick={() => setOpen(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg text-sm px-3 py-2 m-1 text-center"
          >
            Refund
          </button>
        </div>
      </div>
    );
}

export default OwnerDropDownButton