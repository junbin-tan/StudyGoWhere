import React from 'react';
import {Checkbox, FormControlLabel, Typography} from "@mui/material";
import camelCaseToCapitalized from "../../../utilities/camelCaseToCapitalized";
// we can actually save some work with checked and handleOnClick by inferring it from the value,
// but I think its much clearer to just pass it in as a prop in the modal
// Label here is automatically derived from value but we can set it manually as well.
export default function FormControlLabelWrapper({className, labelClassName, value, label = camelCaseToCapitalized(value),
                                                    checked, handleOnClick, children, disabled }) {

    return (
        // change hover classes here
        <div className={""}
             onClick={(e) => {
                 e.preventDefault() // this fixes the small area above the label bug
                 if (disabled) {
                     return;
                 }
                 handleOnClick()
             }}>
            <FormControlLabel
                label={label}
                disabled={disabled}
                control={<Checkbox disabled={disabled} value={value} checked={checked} />}
                // important! need to stop propagation of onClick in label to the parent div.
                // if not, clicking on the label will trigger the parent div's onClick, which will trigger the handleOnClick twice
                componentsProps={{ typography: {className: labelClassName, onClick: (e) => e.stopPropagation()} }}


                // you may wonder why we dont use onClick in the Checkbox,
                // its because the onClick is handled in the grandparent div of VenueInfoItem
                // if the div somehow fucks up, we can revert to using onClick={handleCheck} in the Checkbox component

            />
            {children}
        </div>
    )
}

