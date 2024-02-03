import React from "react";

export default function CustomToolbar({className, children, style, ...rest}) {

    return (
        <div
            className={`card border border-solid border-gray-300 px-1 py-1 rounded-lg shadow-lg` +
                `${className} ` +
                `flex flex-row justify-between items-stretch gap-2`} // items-stretch ensures all buttons/items are the same height
            style={style}
            {...rest}
        >
            {children}
        </div>

    )
}