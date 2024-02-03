import React, { useState } from "react";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import CopyMenuContent from "./CopyMenuContent";

const AddMenuToVenue = ({ thisVenue }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={ButtonClassSets.primary} onClick={openModal}>
        Copy Menu
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black z-50 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-3/6 h-auto">
            <div className="flex flex-row align-middle justify-between mb-5">
              <h2 className="text-lg font-bold mb-4">Select menu to copy</h2>
              <button
                onClick={closeModal}
                className=" bg-red-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>

            <CopyMenuContent venue={thisVenue} />
          </div>
        </div>
      )}
    </>
  );
};

export default AddMenuToVenue;
