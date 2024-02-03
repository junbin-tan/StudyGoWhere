import React from "react";

const CustomLine = ({ className }) => {
  return (
    <hr
      className={`md:col-span-3 border-solid border-lightgray-100 border-t-2 ${className}`}
    />
  );
};

export default CustomLine;
