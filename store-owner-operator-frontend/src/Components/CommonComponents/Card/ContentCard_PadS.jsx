import React from "react";

// note that the "style" doesn't add on, unlike className.
// It overrides, since it is an object and im too lazy to implement the "adding" on of styles
// to be honest if you want to customise this, better off copying and making your own component; the props are a bit convoluted
// especially because classes are not really overridable (not reliably anyway)
const ContentCard_PadS = ({ className, bgClasses = "bg-lightgray-80", onClick, children, ...rest}) => {
  return (
    <div className={`card border border-solid border-gray-300 px-2 py-2 rounded-lg shadow-lg 
    ${className} + " " + ${bgClasses}`}
        {...rest}>
      {children}
    </div>
  );
};

export default ContentCard_PadS;
