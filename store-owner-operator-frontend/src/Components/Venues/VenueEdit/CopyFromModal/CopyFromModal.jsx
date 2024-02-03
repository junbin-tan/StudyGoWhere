import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { useContext, useEffect, useState } from "react";
import { OwnerVenuesContext } from "../../../../FunctionsAndContexts/OwnerVenuesContext";
import ContentCard from "../../../CommonComponents/Card/ContentCard";
import VenueInfoItem from "./VenueInfoItem";
import Amenities from "../../Amenities/Amenities";
import AveragePrice from "../../AveragePrice/AveragePrice";
import FetchOwnerInfoAPI from "../../../../FunctionsAndContexts/FetchOwnerInfoAPI";
import { LoginTokenContext } from "../../../../FunctionsAndContexts/LoginTokenContext";
import checkFormErrors from "../../../../FunctionsAndContexts/checkFormErrors";
import { FormAndFormErrorsContext } from "../../../../FunctionsAndContexts/FormAndFormErrorsContext";
import ButtonStyles from "../../../../utilities/ButtonStyles";
import VenueToggleAllChecks from "./VenueToggleAllChecks";
import VenueListing from "./VenueListing";
import { useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { BiSearch } from "react-icons/bi";
import HorizontalLine from "../../../CommonComponents/Line/HorizontalLine";
import FieldInfo from "../../../CommonComponents/Form/FieldInfo";
import ButtonClassSets from "../../../../utilities/ButtonClassSets";
import CFT_SelectedFields from "./CFT_SelectedFields";

// When using this component, user need to define his own boolean useState outside.

// const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

// const handleCloseConfirmModal = () => {
//     setIsConfirmModalOpen(false);
// };

// IMPORTANT NOTE: we have to include "max-w-full" because the default max-width is 50% i think
const modalPaperClassName =
  "w-1/2 max-w-full " + // we can also do "w-auto" or sth
  // "border-solid border-red-500 border-8 " +
  "";

const modalPaperProps = {
  className: modalPaperClassName,
  style: {
    // width: "2000px",
    // maxWidth: "xs",
  },
};

const emptySelectedFields = CFT_SelectedFields.empty;
export default function CopyFromModal({
  open = false,
  onClose = () => {},
  handleBackButton = () => {},
  handleConfirmButton = () => {},
  onSubmit = (event) => event.preventDefault(),
  preselectedFields = emptySelectedFields,
}) {
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext); // really need to rename this context but it may break things
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const [searchInput, setSearchInput] = useState("");

  const { id: thisVenueId } = useParams();
  // thisVenueId is for Editing a venue, when Adding a new venue we don't need to care
  // when in "Add venue", this is undefined, and we do this check later with a ternary operator

  function OwnerVenuesListComponent({ ownerVenuesList, preselectedFields }) {
    // group all the stuff related to rendering the venuesListComponent together, if not there will be rendering
    // and state management issues.

    // we can leave accordionsOpen as an empty object as undefined is evaluated as false later on
    const [accordionsOpen, setAccordionsOpen] = useState({});
    const handleAccordionChange = (venueId) => {
      const copyOfAccordionsOpen = {
        ...accordionsOpen,
        [venueId]: !accordionsOpen[venueId],
      };
      setAccordionsOpen(copyOfAccordionsOpen);
      console.log(copyOfAccordionsOpen);
    };

    // VERY IMPORTANT NOTE, for some reason I have to build this as a function to call that generates the component,
    // rather than defining it as a component itself.
    // This is to do with the accordion component not being at root level (relative from the accordionsOpen useState variable)
    // If not, the accordions' transitions will not occur, and they will expand and contract instantly
    // https://stackoverflow.com/questions/63430080/transition-of-accordion-in-material-ui-gone-after-controlling-the-accordion

    // Another side note, the above ^^ is not necessarily true??
    // I asked ChatGPT that the component-style and the function-style should produce the same code so it should work the same
    // but it doesnt behave the same way, so i have no idea
    return (
      <>
        {ownerVenuesList.length > 0 ? (
          ownerVenuesList.map((venue) =>
            VenueListing({
              venue,
              preselectedFields,
              accordionsOpen,
              handleAccordionChange,
              handleConfirmButton,
            })
          )
        ) : (
          <p> No venues found! </p>
        )}
        {/*{ownerVenuesList.map((venue) => <VenueListing venue={venue}/>)}*/}
      </>
    );
  }

  const filterVenues = (venues) => {
    const venuesMatchingInput = venues.filter((v) =>
      v.venueName.toLowerCase().includes(searchInput.toLowerCase())
    );
    return venuesMatchingInput
      .filter((v) => v.venueStatus !== "DELETED")
      .filter((v) => (thisVenueId ? v.venueId != thisVenueId : true));
  };

  // Return final generated modal component
  return (
    <Dialog open={open} onClose={onClose} PaperProps={modalPaperProps}>
      <DialogTitle>Copy Fields From ... </DialogTitle>
      <DialogContent>
        <div className={"flex flex-row justify-between items-center gap-4"}>
          <TextField
            name={"searchInput"}
            value={searchInput}
            placeholder={"Search for a venue"}
            onChange={(event) => setSearchInput(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position={"end"}>
                  <BiSearch />
                </InputAdornment>
              ),
            }}
          />
          <FieldInfo>Select a venue and the fields to copy from</FieldInfo>
        </div>
        <HorizontalLine />
        <OwnerVenuesListComponent
          ownerVenuesList={filterVenues(ownerData.venues)}
          preselectedFields={preselectedFields}
        />
      </DialogContent>
      <DialogActions spacing={10}>
        <Button
          variant={"contained"}
          onClick={handleBackButton}
          className={ButtonClassSets.secondary}
          sx={{ border: "2px solid " }}
        >
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
}
