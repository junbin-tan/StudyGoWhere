import React from "react";

export default function ResponsiveDivider({vertical = false}) {
    if (vertical) {
        return (
            <>
                <hr className="hidden lg:block lg:border-r-2 lg:border-lightgray-100 lg:h-auto" />
                <hr className="lg:hidden border-t-2 border-lightgray-100 w-auto" />
            </>
        )
    } else {
        return (
                <hr className="border-t-2 border-lightgray-100 w-auto" />
        )
    }
}