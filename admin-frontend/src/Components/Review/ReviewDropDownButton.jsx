import React from "react";
import Api from "../../Helpers/Api";
import { useNavigate } from "react-router-dom";  
import useEncodedToken from "../../Helpers/useEncodedToken";

const ReviewDropDownButton = ({ review, refreshData, snackbarDispatch }) => {
  const { encodedToken } = useEncodedToken();

  const handleDelete = () => {
    console.log(review)
      Api.deleteReview(review.id, encodedToken)
      .then(res => {
        refreshData();
        snackbarDispatch({type : "SUCCESS"})
      })
      .catch(error => {
        snackbarDispatch({type : "ERROR"})
      })
  }

  const navigate = useNavigate();  // Initialize the useNavigate hook


  return (
    <div className="flex flex-row gap">

      <div>          <button
            onClick={handleDelete}
            className="bg-red-400 hover:bg-red-500 text-white font-medium rounded-lg text-sm px-3 py-2 text-center"
          >
            Delete
          </button>
    
      </div>
    </div>
  );
};

export default ReviewDropDownButton;
