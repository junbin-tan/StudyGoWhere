import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Link } from "react-router-dom";

const VenueDropdown = ({ title, children, linkTo, className, icon }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const header = linkTo ? (
    // <Link to={linkTo} className={"flex flex-row gap-2"}>
    //   {icon} {title}
    // </Link>
      <a href={linkTo} className={"flex flex-row gap-2"}>
        {icon} {title}
      </a>
  ) : (
    <p className="large-medium ">{title} </p>
  );

  return (
    <div className="flex flex-col gap-0">
      {/* Button to toggle the dropdown */}
      <div className={`flex flex-row rounded-xl justify-between ${className}`}>
        {header}

        <button onClick={toggleDropdown}>
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </button>
      </div>

      {/* Conditional rendering of the dropdown menu */}
      {isOpen && (
        <div className="max-h-48 overflow-y-auto ">
          <ul className="flex flex-col">{children}</ul>
        </div>
      )}
    </div>
  );
};

export default VenueDropdown;
