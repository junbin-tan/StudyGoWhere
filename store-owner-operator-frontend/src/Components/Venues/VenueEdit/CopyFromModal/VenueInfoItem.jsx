import React from "react";
import {Checkbox, FormControlLabel, Typography} from "@mui/material";
import camelCaseToCapitalized from "../../../../utilities/camelCaseToCapitalized";
// we can actually save some work with checked and handleOnClick by inferring it from the value,
// but I think its much clearer to just pass it in as a prop in the modal
// Label here is automatically derived from value but we can set it manually as well.
import "./asterisk.css"

export default function VenueInfoItem({
  value,
  label = camelCaseToCapitalized(value),
  checked,
  handleOnClick,
  children,
    required = false,
}) {
  return (
    // small bug with clicking here:
    // clicking a small area above the label will trigger the handleOnClikc twice
    // why? no idea
    <div
      className={`${
        checked
          ? "border-2 border-custom-yellow hover:bg-custom-yellow hover:bg-opacity-20  cursor-pointer"
          : "border border-gray-300  hover:bg-gray-300 cursor-pointer"
      } px-4 py-4 rounded-xl`}
      onClick={(e) => {
        e.preventDefault(); // this fixes the small area above the label bug
        if (!required) {
          handleOnClick();
        }
      }}
    >
      <FormControlLabel
        label={label}
        required={required}
        disabled={required}
        control={
          <Checkbox
            value={value}
            checked={checked}
            style={{ color: checked ? "var(--custom-yellow)" : "" }}
          />
        }
        // important! need to stop propagation of onClick in label to the parent div.
        // if not, clicking on the label will trigger the parent div's onClick, which will trigger the handleOnClick twice
        componentsProps={{
          typography: {
            className: "font-semibold",
            onClick: (e) => {
              e.stopPropagation();
            },
          },
        }}

        // slotProps={{ typography: {onClick: handleOnClick} }} // slotprops is the old name for componentsProps

        // you may wonder why we dont use onClick in the Checkbox,
        // its because the onClick is handled in the grandparent div of VenueInfoItem
        // if the div somehow fucks up, we can revert to using onClick={handleCheck} in the Checkbox component
      />
      {/*{cloneChildrenWithOnClick(children, handleOnClick)}*/}

      {children}
    </div>
  );
}
