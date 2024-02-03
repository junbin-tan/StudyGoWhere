import {
    Button, capitalize, Checkbox,
} from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {OwnerVenuesContext} from "../../../../FunctionsAndContexts/OwnerVenuesContext";
import {LoginTokenContext} from "../../../../FunctionsAndContexts/LoginTokenContext";
import ButtonStyles from "../../../../utilities/ButtonStyles";
import {useParams} from "react-router-dom";
import ThisVenueComponent from "./ThisVenueComponent";
import OwnerVenuesListComponent from "./OwnerVenuesListComponent";
import ConfirmModalV2 from "../../../CommonComponents/Modal/ConfirmModalV2";
import FetchOwnerInfoAPI from "../../../../FunctionsAndContexts/FetchOwnerInfoAPI";
import VenueInfoItem from "../CopyFromModal/VenueInfoItem";
import FormControlLabelWrapper from "../../../CommonComponents/Form/FormControlLabelWrapper";
import "./tooltipStyles.css"
import CFT_SelectedFields from "../CopyFromModal/CFT_SelectedFields";
import ButtonClassSets from "../../../../utilities/ButtonClassSets";

// When using this component, user need to define his own boolean useState outside.

// const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

// const handleCloseConfirmModal = () => {
//     setIsConfirmModalOpen(false);
// };


// IMPORTANT NOTE: we have to include "max-w-full" because the default max-width is 50% i think
const modalPaperClassName = "w-1/2 max-w-full " + // we can also do "w-auto" or sth
    // "border-solid border-red-500 border-8 " +
    "";


const modalPaperProps = {
    className: modalPaperClassName,
    style: {
        // width: "2000px",
        // maxWidth: "xs",
    }
}
const emptySelectedFields = CFT_SelectedFields.empty;
export default function CopyToModal({
                                          open = false,
                                        onClose = () => {},
                                        handleConfirmButton = () => {},
                                        handleBackButton = () => {},
                                          onSubmit = (event) => event.preventDefault(),
                                          preselectedFields = emptySelectedFields,
                                      }) {

    const {ownerData, setOwnerData} = useContext(OwnerVenuesContext) // really need to rename this context but it may break things
    const [token, setToken, encodedToken] = useContext(LoginTokenContext)

    const [selectedFields, setSelectedFields] = useState(emptySelectedFields);

    const [selectedVenueIds, setSelectedVenueIds] = useState([]);

    const {id: thisVenueId} = useParams();
    const [thisVenue, setThisVenue] = useState(ownerData.venues.find(v => v.venueId == thisVenueId));

    // we use this one to store the list of filtered venues (eg. not thisVenue, not deleted)
    const [ownerVenuesList, setOwnerVenuesList] = useState([])
    const [appendNumberToName, setAppendNumberToName] = useState(true);

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const [awaitResponseModalOpen, setAwaitResponseModalOpen] = useState(false);
    const [awaitResponseModalHeader, setAwaitResponseModalHeader] = useState("Awaiting response from server...");
    const [awaitResponseModalMessage, setAwaitResponseModalMessage] = useState("Waiting for server response...");

    useEffect(() => {
        setThisVenue(ownerData.venues.find(v => v.venueId == thisVenueId));
        setOwnerVenuesList(ownerData.venues.filter(v => v.venueId != thisVenueId)
            .filter(v => v.venueStatus !== "DELETED"));
    }, [ownerData])
    // thisVenueId is for Editing a venue, when Adding a new venue we don't need to care
    // when in "Add venue", this is undefined, and we do this check later with a ternary operator


    const replaceSelectedVenuesFormData = () => {
        console.log(selectedVenueIds)
        console.log(selectedFields)
        const selectedVenues = ownerVenuesList.filter(v => selectedVenueIds.includes(v.venueId));
        console.log(selectedVenues)

        let numberCount = 1;

        selectedVenues.forEach(v => {

            v["operator"] = null; // backend won't do anyth if operator is null

            Object.keys(selectedFields).forEach(key => {
                if (selectedFields[key]) {
                    console.log("key is:", key)
                    console.log("thisVenue[key] is:", thisVenue[key])
                    console.log("v[key] is:", v[key])
                    if (key === "venueName" && appendNumberToName) {
                        v[key] = thisVenue[key] + " " + numberCount;
                        numberCount++;
                    } else if (key === "address") {
                        v["address"] = {...thisVenue["address"], addressId: v["address"].addressId}
                    } else if (key === "businessHours") {
                        v["businessHours"] = {...thisVenue["businessHours"], businessHoursId: v["businessHours"].businessHoursId}
                    } else {
                        v[key] = thisVenue[key];
                    }
                    console.log("after setting v[key] is:", v[key])
                }
            })
        })
        console.log("after setting selectedFields, selectedVenues is:", selectedVenues)

        // == SENDING REQUEST TO BACKEND ==
        const updatePromises = selectedVenues.map(v => {
            FetchOwnerInfoAPI.updateVenue(encodedToken, v)
        })

        Promise.all(updatePromises)
            .then((results) => {
                console.log('All promises are resolved:', results);
                setAwaitResponseModalHeader("Success")
                setAwaitResponseModalMessage("Successfully updated venues!")
            })
            .catch((error) => {
                console.error('At least one promise was rejected:', error);
                setAwaitResponseModalHeader("Error")
                setAwaitResponseModalMessage("Couldn't update venues! Please try again later.")
            })
            .finally(() => {
                setAwaitResponseModalOpen(true);
            })

    }


    // Return final generated modal component
    return (
        <Dialog open={open} onClose={onClose} PaperProps={modalPaperProps}>
            <DialogTitle>Copy Fields To ... </DialogTitle>
            {/* added padding & border utility classes to create the "dividing line"*/}
            <DialogContent>
                <div className={"flex flex-row"}>
                    <div className={"flex-auto order-solid border-r-2 border-lightgray-100 w-1/2"}>
                        {thisVenue &&
                            <ThisVenueComponent venue={thisVenue}
                                                selectedFields={selectedFields} setSelectedFields={setSelectedFields}
                                                appendNumberToName={appendNumberToName} setAppendNumberToName={setAppendNumberToName}
                            />}
                    </div>
                    <div className={"flex-auto pl-2 w-1/2"}>
                        {ownerVenuesList &&
                            <OwnerVenuesListComponent
                                ownerVenuesList={ownerVenuesList}
                                selectedVenueIds={selectedVenueIds}
                                setSelectedVenueIds={setSelectedVenueIds}
                            />
                        }
                    </div>

                </div>
            </DialogContent>
            <DialogActions spacing={10}>
                <div className={"flex-1 tooltip"}>
                    <FormControlLabelWrapper value={"appendNumberingToVenueNames"} checked={appendNumberToName}
                                             handleOnClick={() => setAppendNumberToName(!appendNumberToName)}
                                             disabled={!selectedFields.venueName}
                    />
                    {/* == I don't know how to get tooltip working, small issue == */}
                    {/*<span className={"tooltiptext"}>Numbers the copied venue names so it is easier to tell them apart.</span>*/}
                </div>
                <Button
                    variant={"contained"}
                    onClick={() => setConfirmModalOpen(true)}
                    className={ButtonClassSets.primary}
                    // style={ButtonStyles.selected}
                >
                    Confirm
                </Button>
                <Button
                    variant={"contained"}
                        onClick={handleBackButton}
                    className={ButtonClassSets.secondary}
                        // style={ButtonStyles.back}
                    >
                        Back
                    </Button>
                </DialogActions>

            {/* == Confirm modal, and inside confirm modal there's another AwaitResponse modal*/}
            <ConfirmModalV2
                open={confirmModalOpen}
                headerText={"Are you sure you want to copy and propagate these fields?"}
                confirmButtonCallbackFn={() => {
                    replaceSelectedVenuesFormData();
                }}
                backButtonCallbackFn={() => setConfirmModalOpen(false)}
                onClose={() => setConfirmModalOpen(false)}
            >
                <>
                    <p>This will replace the fields in the selected venues with the selected fields from this venue.</p>
                    <p>These changes are irreversible!</p>
                </>
                <ConfirmModalV2
                    open={awaitResponseModalOpen}
                    onClose={() => {
                        setAwaitResponseModalOpen(false)
                    }}
                    headerText={awaitResponseModalHeader}
                    confirmButtonCallbackFn={() => {
                        setAwaitResponseModalOpen(false);
                        handleConfirmButton();
                    }}
                    renderBackButton={false}
                >
                    <p>{awaitResponseModalMessage}</p>

                </ConfirmModalV2>
            </ConfirmModalV2>
        </Dialog>
    );
}
