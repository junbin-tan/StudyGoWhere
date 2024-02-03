import React from "react";

const BodyCard = ({ children, className }) => {
  return (
    <div
      className={`card border border-solid border-gray-300 px-5 py-8 rounded-lg shadow-lg bg-lightgray-80 ${className}`}
    >
      {children}
    </div>
  );
};

export default BodyCard;
