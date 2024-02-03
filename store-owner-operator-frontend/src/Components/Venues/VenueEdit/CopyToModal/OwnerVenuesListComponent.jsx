import React, {useEffect, useState} from "react";
import FirebaseFunctions from "../../../../FunctionsAndContexts/FirebaseFunctions";
import VenueItem from "./VenueItem";

export default function OwnerVenuesListComponent({ownerVenuesList, selectedVenueIds, setSelectedVenueIds}) {

    return <>
        {ownerVenuesList.map((venue, index) => {
            return (
                <VenueItem key={venue.venueId} venue={venue}
                           selectedVenueIds={selectedVenueIds} setSelectedVenueIds={setSelectedVenueIds}/>
            )
        })
        }

    </>

}
