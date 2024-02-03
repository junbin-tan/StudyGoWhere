import FirebaseFunctions from "../../../../FunctionsAndContexts/FirebaseFunctions";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import ContentCard from "../../../CommonComponents/Card/ContentCard";
import FieldLabel from "../../../CommonComponents/Form/FieldLabel";
import {InsertPhoto} from "@mui/icons-material";
import {Button} from "@mui/material";
import ImageCarousel from "../../../ImageCarousel/ImageCarousel";
import FieldInfo from "../../../CommonComponents/Form/FieldInfo";

export default function VenueItem({venue, selectedVenueIds, setSelectedVenueIds}) {

    const [displayImageDownloadURLs, setDisplayImageDownloadURLs] = useState([]);

    useEffect(() => {
        if (venue.displayImagePath && venue.displayImagePath != "") {
            const displayPathList = [venue.displayImagePath];
            console.log("displayPathList is:", displayPathList)
            FirebaseFunctions.convertPathsToDownloadURLs(displayPathList)
                .then((downloadURLs) => {
                    setDisplayImageDownloadURLs(downloadURLs);
                    console.log("downloadURLs being set to:", downloadURLs);
                    return downloadURLs;
                })
                .catch((e) => console.log(e));
        }
    }, [venue])

    const handleClick = (venueId) => {
        console.log("handleClick called")
        const copyOfSelectedVenueIds = [...selectedVenueIds];
        console.log("copyOfSelectedVenueIds", copyOfSelectedVenueIds)
        if (copyOfSelectedVenueIds.includes(venueId)) {
            copyOfSelectedVenueIds.splice(copyOfSelectedVenueIds.indexOf(venueId), 1);
        } else {
            copyOfSelectedVenueIds.push(venueId);
        }
        setSelectedVenueIds(copyOfSelectedVenueIds);
    }

    return (
        <ContentCard bgClasses={selectedVenueIds.includes(venue.venueId) ?
            "bg-amber-300 hover:bg-amber-400 cursor-pointer"
            : "bg-gray-300 hover:bg-gray-400 cursor-pointer"
        }
                     onClick={() => handleClick(venue.venueId)}>

            <div className={"flex flex-row "}
                 >
                {/* Margin-right: 4 on this div because of the padding on its left side from the card*/}
                <div id={"displayImage"} className={"w-1/4 mr-4 flex flex-row justify-start"}>
                    {displayImageDownloadURLs.length > 0 ?
                        <img className="my-auto" src={displayImageDownloadURLs[0]} alt="Display Image"/>
                        : <InsertPhoto className={"w-full h-full"}/>}
                {/*     ^^^ the w-full h-full takes the full size of the displayImage div which is w-1/4*/}
                </div>
                <div id={"nameAndAddress"} className={"w-3/4"}>
                    <FieldLabel>{venue.venueName}</FieldLabel>
                    <FieldInfo>{venue.address.address}</FieldInfo>
                    {/*<Button onClick={() => console.log(displayImageDownloadURLs[0])}>*/}
                    {/*    log display image url*/}
                    {/*</Button>*/}
                </div>

            </div>
        </ContentCard>
    )
}