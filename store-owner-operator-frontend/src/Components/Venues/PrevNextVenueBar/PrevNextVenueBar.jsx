import React, { useMemo } from "react";
import ContentCard from "../../CommonComponents/Card/ContentCard";
import { Button } from "@mui/material";
import ButtonStyles from "../../../utilities/ButtonStyles";
import { useNavigate } from "react-router-dom";
import ButtonClassSets from "../../../utilities/ButtonClassSets";
import { GrPrevious } from "react-icons/gr";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// explanation of my decision to include logic in this component:
// since we are using this in only a few specific use cases, the logic is very tightly coupled to the component
// and we don't have to worry about reusing this component in other places, so the handlePrevClick and handleNextClick
// are defined and used in here
export default function PrevNextVenueBar({
  ownerVenuesList,
  thisVenueId,
  pageName = undefined,
}) {
  const navigate = useNavigate();
  // pagename is optional, if it is not provided, we will assume that this is the venue dashboard

  const prevVenueURL = useMemo(() => {
    console.log("ownerVenuesList", ownerVenuesList);
    if (ownerVenuesList && ownerVenuesList.length !== 0) {
      const indexOfThisVenue = ownerVenuesList.findIndex(
        (venue) => venue.venueId == thisVenueId // need to use == here to typecast string to integer
      );

      let prevVenueIndex = indexOfThisVenue - 1;
      if (prevVenueIndex === -1) {
        prevVenueIndex = ownerVenuesList.length - 1;
      }

      console.log("reached prevVenueId, prevVenueIndex is:", prevVenueIndex);
      const prevVenueId = ownerVenuesList[prevVenueIndex].venueId;
      if (pageName == undefined) {
        // means user is in Dashboard
        return "/venues/" + prevVenueId;
      } else {
        return "/venues/" + prevVenueId + "/" + pageName;
      }
    }
  }, [ownerVenuesList, thisVenueId, pageName]);

  const nextVenueURL = useMemo(() => {
    if (ownerVenuesList && ownerVenuesList.length !== 0) {
      const indexOfThisVenue = ownerVenuesList.findIndex(
        (venue) => venue.venueId == thisVenueId
      );

      let nextVenueIndex = indexOfThisVenue + 1;
      if (nextVenueIndex == ownerVenuesList.length) {
        nextVenueIndex = 0;
      }

      const nextVenueId = ownerVenuesList[nextVenueIndex].venueId;
      if (pageName == undefined) {
        // means user is in Dashboard
        return "/venues/" + nextVenueId;
      } else {
        return "/venues/" + nextVenueId + "/" + pageName;
      }
    }
  }, [ownerVenuesList, thisVenueId, pageName]);

  return (
    // feel free to edit this ContentCard or replace it with whatever btw
    // u can see my gripes and going crazy over tailwind in the comments below
    <div className="flex flex-row justify-between">
      {" "}
      <Button
        // onClick={handlePrevClick}
        component={"a"}
        href={prevVenueURL}
        className={ButtonClassSets.secondary}
        startIcon={<IoChevronBack />}
        sx={{ border: "2px solid " }}
      >
        Prev Venue
      </Button>
      <Button
        component={"a"}
        href={nextVenueURL}
        className={ButtonClassSets.secondary}
        endIcon={<IoChevronForward />}
        sx={{ border: "2px solid " }}
      >
        Next Venue
      </Button>
    </div>
    // <ContentCard
    //   className={"flex flex-row justify-between px-1 py-0.5"}
    //   style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
    // >

    // </ContentCard>
  );
}

// === OLD IMPLEMENTATION ===
// export default function PrevNextVenueBar({handlePrevClick, handleNextClick}) {
//
//         return (
//             <ContentCard className={"flex flex-row justify-between px-2 py-1"}>
//                 <Button style={ButtonStyles.selected}>
//                     Prev
//                 </Button>
//                 <Button style={ButtonStyles.selected}>
//                     Next
//                 </Button>
//             </ContentCard>
//
//         )
// }
