import React from "react";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import { Button } from "@mui/material";
import FieldLabel from "../CommonComponents/Form/FieldLabel";

const Modal = ({ isOpen, onClose, onSave, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="flex flex-col px-3 py-3 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-medium leading-6 text-gray-900">
            Add Menu Section
          </h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-4">{children}</div>
        <div className="px-4 py-3 bg-gray-50 flex justify-end">
          <button onClick={onSave} className={ButtonClassSets.primary}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
