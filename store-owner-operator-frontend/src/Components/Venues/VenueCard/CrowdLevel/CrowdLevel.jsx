import React from "react";
import "./style.css";
import "../venueCard.css";

export const CrowdLevel = ({ level, size, className, status, isBanned }) => {
  let levelColor;

  if (isBanned) {
    levelColor = "rgba(155, 155, 155, 1)";
  } else if (status === "DEACTIVATED") {
    levelColor = "rgba(155, 155, 155, 1)";
  } else {
    if (level === "GREEN") {
      levelColor = "#5CD931";
    } else if (level === "AMBER") {
      levelColor = "#F2C94C";
    } else if (level === "RED") {
      levelColor = "#EB5757";
    } else {
      levelColor = "rgba(155, 155, 155, 1)";
    }
  }

  return (
    <>
      <div
        className="tooltip"
        style={{ border: "3px solid", borderColor: levelColor }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 9 9"
          fill="none"
        >
          <circle cx="4.88464" cy="4.71387" r="4" fill={levelColor} />
        </svg>
        {isBanned ? (
          <p className="font-semibold" style={{ color: levelColor }}>
            BANNED
          </p>
        ) : status === "DEACTIVATED" ? (
          <p className="font-semibold" style={{ color: levelColor }}>
            DEACTIVATED
          </p>
        ) : (
          <p className="font-semibold" style={{ color: levelColor }}>
            {level}
          </p>
        )}
        <span className="tooltiptext">Current crowd level</span>
      </div>
    </>
  );
};
