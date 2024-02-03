import React from "react";
export const renderStars = (icon, predicate) => {
    return Array.from({ length: 5 }, (_, index) => index + 1)
                .map((num) => {
                    if (predicate(num)) {
                        return <React.Fragment key={num}>{icon}</React.Fragment>;
                    }
                });
}
