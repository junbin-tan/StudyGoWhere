import ConfirmModalV2 from "../../../CommonComponents/Modal/ConfirmModalV2";
import ThisVenueComponent from "../CopyToModal/ThisVenueComponent";
import React, {useContext, useEffect, useState} from "react";
import {OwnerVenuesContext} from "../../../../FunctionsAndContexts/OwnerVenuesContext";
import {LoginTokenContext} from "../../../../FunctionsAndContexts/LoginTokenContext";
import {useParams} from "react-router-dom";
import CFT_SelectedFields from "../CopyFromModal/CFT_SelectedFields";
import ContentCard from "../../../CommonComponents/Card/ContentCard";
import TextField from "@mui/material/TextField";
import FieldLabel from "../../../CommonComponents/Form/FieldLabel";
import FormControlLabelWrapper from "../../../CommonComponents/Form/FormControlLabelWrapper";
import FieldInfo from "../../../CommonComponents/Form/FieldInfo";
import FetchOwnerInfoAPI from "../../../../FunctionsAndContexts/FetchOwnerInfoAPI";


const defaultSelectedFields = {
    ...CFT_SelectedFields.empty,
    venueName: true,
    description: true,
};

export default function DuplicateModal({
    open = false,
    onClose = () => {},
    handleConfirmButton = () => {console.log("conf button clicked")},
    handleBackButton = () => {},
                                       }) {
    const { ownerData, setOwnerData } = useContext(OwnerVenuesContext); // really need to rename this context but it may break things
    const [token, setToken, encodedToken] = useContext(LoginTokenContext);

    const {id: thisVenueId} = useParams();
    const [thisVenue, setThisVenue] = useState(null);

    const [numDuplicates, setNumDuplicates] = useState(1);
    // const [selectedFields, setSelectedFields] = useState(defaultSelectedFields);
    const [appendNumberToName, setAppendNumberToName] = useState(true);

    const [awaitResponseModalOpen, setAwaitResponseModalOpen] = useState(false);
    const [awaitResponseModalHeader, setAwaitResponseModalHeader] = useState("Awaiting response from server...");
    const [awaitResponseModalMessage, setAwaitResponseModalMessage] = useState("Waiting for server response...");

    const duplicateVenues = () => {
        console.log("duplicateVenues called")
        console.log("numDuplicates is", numDuplicates)
        console.log("appendNumberToName is", appendNumberToName)

        console.log("thisVenue is", thisVenue)
        const duplicateVenueData = {
            venueName: thisVenue.venueName,
            description: thisVenue.description,
            address: {...thisVenue.address, addressId: null},
            phoneNumber: thisVenue.phoneNumber,
            businessHours: {...thisVenue.businessHours, businessHoursId: null},
            images: thisVenue.images,
            displayImagePath: thisVenue.displayImagePath,
            amenities: thisVenue.amenities,
            averagePrice: thisVenue.averagePrice,
        }


        const forLoopArray = Array(parseInt(numDuplicates)).fill(null);
        const createVenuePromises = forLoopArray.map((_, index) => {
            const currentDuplicate = {...duplicateVenueData, venueName: duplicateVenueData.venueName + " " + (index + 1)};
            return FetchOwnerInfoAPI.createVenue(encodedToken, currentDuplicate)
        })

        Promise.all(createVenuePromises)
            .then(results => {
                console.log(results)
                // == This updates the current owner; however if we're refreshing the page anyway I think we don't need this ==
                // setOwnerData(prev => {
                //     const newVenues = [...prev.venues, ...results.map(res => res.data)];
                //     return {...prev, venues: newVenues}
                // })
                setAwaitResponseModalHeader("Success")
                setAwaitResponseModalMessage("Successfully duplicated venues!")
            })
            .catch(error => {
                console.log("At least one promise was rejected: ", error)
                setAwaitResponseModalHeader("Error")
                setAwaitResponseModalMessage("Couldn't duplicate venues! Please try again later.")
            })
            .finally(() => {
                setAwaitResponseModalOpen(true);
            })

    }

    useEffect(() => {
        setThisVenue(ownerData.venues.find(v => v.venueId == thisVenueId));
    }, [ownerData])
    return (
        <ConfirmModalV2
            open={open}
            onClose={onClose}
            headerText={"Duplicate this venue?"}
            confirmButtonCallbackFn={() => {
                duplicateVenues()
                setAwaitResponseModalOpen(true)
            }}
            backButtonCallbackFn={handleBackButton}
            paperClassName={"w-1/3 max-w-full"}
            leftSideActions={
                <FormControlLabelWrapper value={"appendNumberingToVenueNames"} checked={appendNumberToName}
                                         handleOnClick={() => setAppendNumberToName(!appendNumberToName)}
                />
            }

        >

            <ContentCard>
                <div className={"flex flex-col gap-2"}>
                <FieldLabel htmlFor="numDuplicates">Duplicates to generate:</FieldLabel>
                    <TextField id="numDuplicates" type={"number"} className={"max-w-xs"}
                               value={numDuplicates} onChange={(e) => setNumDuplicates(e.target.value)}
                               placeholder={"Enter number"}
                               InputProps={{inputProps: {min: 1, max: 100}}}
                    />
                    <FieldInfo>Please note that operator accounts will not be duplicated, and operators will have to be set for each duplicate manually.</FieldInfo>
                    <FieldInfo>Futhermore, all duplicates will have their statuses set as <b>DEACTIVATED</b>.</FieldInfo>
                </div>
            </ContentCard>

            {/* -- This part was for selecting fields to duplicate, but doesn't add much value -- */}
            {/*{thisVenue &&*/}
            {/*    <ThisVenueComponent venue={thisVenue} requireMandatoryFields={true}*/}
            {/*selectedFields={selectedFields} setSelectedFields={setSelectedFields}/>}*/}


            {/* == Modal for awaiting response from server once the request to duplicate venues is sent ==*/}
            <ConfirmModalV2
                open={awaitResponseModalOpen}
                onClose={() => {
                    setAwaitResponseModalOpen(false)
                    window.location.href = "/venues";
                }}
                headerText={awaitResponseModalHeader}
                confirmButtonCallbackFn={() => {
                    setAwaitResponseModalOpen(false);
                    handleConfirmButton();
                    window.location.href = "/venues";
                }}
                renderBackButton={false}
            >
                <p>{awaitResponseModalMessage}</p>

            </ConfirmModalV2>

        </ConfirmModalV2>




    )

}