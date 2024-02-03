import React, { useState, useContext, useRef, useEffect } from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { v4 as uuidv4 } from "uuid";
import Api from "../../FunctionsAndContexts/Api";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import { Doughnut } from "react-chartjs-2";
import BudgetChart from "./BudgetChart";

const AdvertisementSelectedDashboard = ({ adData }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageRef = ref(storage, adData.image);
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
        setImageError(false);
      } catch (error) {
        console.error("Error fetching image URL:", error);
        setImageError(true);
      }
    };

    fetchImage();
  }, [adData]);

  if (!adData) {
    return <div>Loading...</div>; // or any other placeholder/loading component
  }

  return (
    <div className="flex flex-col">
      {/* dashboard heree */}
      <div className="flex flex-col justify-center">
        <div className="flex flex-row gap-2 justify-center">
          <BudgetChart adData={adData} />
          <div className="flex flex-col gap-2 ">
            <div className="flex flex-col h-full justify-center w-64 bg-white shadow-lg rounded-lg p-4">
              <h1 className="flex justify-center text-8xl text-teal-500">
                {adData.impressionCount}
              </h1>
              <h2 className="flex justify-center text-xl font-medium text-gray-700-800 mb-4">
                Impressions Made
              </h2>
            </div>

            <div className="flex flex-col h-full justify-center w-64 bg-white shadow-lg rounded-lg p-4">
              <h1 className="flex justify-center text-8xl text-teal-500">
                {adData.reachCount}
              </h1>
              <h2 className="flex justify-center text-xl font-medium text-gray-700-800 mb-4">
                Users Reach
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-2 ">
            <div className="flex flex-col h-full justify-center w-64 bg-white shadow-lg rounded-lg p-4">
              <h1 className="flex justify-center text-8xl text-teal-500">
                {adData.impressionsLeft}
              </h1>
              <h2 className="flex justify-center text-xl font-medium text-gray-700-800 mb-4">
                Impressions Left
              </h2>
            </div>

            <div className="flex flex-col h-full justify-center w-64 bg-white shadow-lg rounded-lg p-4">
              <h2 className="flex justify-center text-xl font-medium text-gray-700-800 mb-2">
                Status:
              </h2>
              <h1
                className={`flex justify-center text-4xl ${
                  adData.advertisementStatus === "ACTIVATED"
                    ? "text-green-500"
                    : adData.advertisementStatus === "REJECTED"
                    ? "text-red-500"
                    : adData.advertisementStatus === "COMPLETED"
                    ? "text-orange-500"
                    : adData.advertisementStatus === "PENDING"
                    ? "text-gray-500"
                    : ""
                }`}
              >
                {adData.advertisementStatus}
              </h1>
            </div>
          </div>
          <div className=" bg-white shadow-lg rounded-lg p-4">
            <div className="">
              <label
                htmlFor="image"
                className="block mb-2 text-lg font-medium "
              >
                Image
              </label>
              {imageUrl ? (
                <img src={imageUrl} alt="Advertisement" />
              ) : imageError ? (
                <p className="text-red-500 flex justify-center align-middle">No image found</p>
              ) : (
                <p>Loading image...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementSelectedDashboard;
