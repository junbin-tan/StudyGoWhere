import React from "react";
import Api from "../../Helpers/Api";
import { useNavigate } from "react-router-dom";  
import useEncodedToken from "../../Helpers/useEncodedToken";
import RefundDialog from "./RefundDialog";
const StudentDropDownButton = ({ student, refreshData }) => {
  const { encodedToken } = useEncodedToken();

  const handleToggleActivation = () => {
      Api.changeActivationStatus(student, encodedToken)
      .then(res => {
        if (res.ok) {
          console.log("SUCCESS");
          refreshData();
        }
      })
  }

  const navigate = useNavigate();  // Initialize the useNavigate hook
  const [open, setOpen] = React.useState(false);
  return (
    <>
    <RefundDialog 
        handleClose={() => setOpen(false)}
        open={open}
        student={student}>
    </RefundDialog>
    <div className="flex flex-row gap-3">
      <div>
        {student.enabled ? (
          <button
            onClick={handleToggleActivation}
            className="bg-red-400 hover:bg-red-500 text-white font-medium rounded-lg text-sm px-3 py-2 m-1 text-center"
          >
            Deactivate
          </button>
        ) : (
          <button
            onClick={handleToggleActivation}
            className="bg-green-400 hover:bg-green-500 text-white font-medium rounded-lg text-sm px-3 py-2 m-1 text-center"
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
    </>
  );
};

export default StudentDropDownButton;
