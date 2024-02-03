import React from "react";

// className here "adds on" to the default classNames.
// It can also override, eg. if you add border-red-500, it will override the border-lightgray-100
// from the default className because it comes after it in the className string.
// For now, there are no default styles

const defaultMargin = "px-0 mt-2 mb-2";
export default function HorizontalLine({className = "", marginClass = defaultMargin, style}) {
    return (
        <hr className={"border-solid border-lightgray-100 border-t-2 " + marginClass + " " + className} style={style}/>
    )
}