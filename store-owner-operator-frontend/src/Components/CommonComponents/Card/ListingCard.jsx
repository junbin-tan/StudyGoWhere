import React from "react";

// note that the "style" doesn't add on, unlike className.
// It overrides, since it is an object and im too lazy to implement the "adding" on of styles
// to be honest if you want to customise this, better off copying and making your own component; the props are a bit convoluted
// especially because classes are not really overridable (not reliably anyway)
const ListingCard = ({ className, bgClasses = "bg-lightgray-80", style, onClick = () => null, cursorPointer = true, children }) => {
  return (
    <div className={`card border border-solid border-gray-300 px-2 py-2 rounded-lg shadow-lg ${cursorPointer ? "cursor-pointer" : " "}
    ${className} + " " + ${bgClasses}`}
    style={style} onClick={onClick}>
      {children}
    </div>
  );
};

export default ListingCard;
