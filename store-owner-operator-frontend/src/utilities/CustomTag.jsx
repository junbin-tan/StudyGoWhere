import React from "react";
import TagClassSets from "./TagClassSets";

const CustomTag = ({ label, selected, onClick, className, style }) => {
  const handleClick = () => {
    // console.log("this is called")
    if (onClick) {
      onClick(label);
    }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${TagClassSets.default} ${className}`}
      style={style}
    >
      {label}
    </button>
  );
};

export default CustomTag;
