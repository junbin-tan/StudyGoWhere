import React from "react";
import BodyCard from "../CommonComponents/Card/BodyCard";
import ButtonClassSets from "../../utilities/ButtonClassSets";

const EditMenuModal = ({ isOpen, onClose, onSave, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-xl w-full px-3 py-3">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-2xl font-medium leading-6 text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-4">{children}</div>
        <div className="flex px-4 py-3 bg-gray-50 justify-end">
          <button onClick={onSave} className={ButtonClassSets.primary}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMenuModal;
