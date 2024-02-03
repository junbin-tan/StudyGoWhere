import React from "react";
import ButtonClassSets from "../../utilities/ButtonClassSets";

const ModalAddMenuItem = ({ isOpen, onClose, onSave, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white ml-[10vw] rounded-lg overflow-hidden shadow-xl transform transition-all min-w-[800px] px-3 py-2">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">
            Add Menu Item
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-4">{children}</div>
        <div className="flex px-4 py-3 bg-gray-50 text-right justify-end">
          <button onClick={onSave} className={ButtonClassSets.primary}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddMenuItem;
