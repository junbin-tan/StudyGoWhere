import React, {useEffect, useState} from "react";
import FirebaseFunctions from "../../../../FunctionsAndContexts/FirebaseFunctions";
import ContentCard from "../../../CommonComponents/Card/ContentCard";
import VenueToggleAllChecks from "../CopyFromModal/VenueToggleAllChecks";
import VenueInfoItem from "../CopyFromModal/VenueInfoItem";
import ImageCarousel from "../../../ImageCarousel/ImageCarousel";
import Amenities from "../../Amenities/Amenities";
import AveragePrice from "../../AveragePrice/AveragePrice";
import {capitalize} from "@mui/material";
import DayBusinessHours from "../../../BusinessHours/DayBusinessHours";
import HolidayDatesSection from "../../../BusinessHours/HolidayDatesSection";

export default function ThisVenueComponent({venue, selectedFields, setSelectedFields, requireMandatoryFields = false}) {

    const [imageDownloadURLs, setImageDownloadURLs] = useState([]);
    const [displayImageDownloadURLs, setDisplayImageDownloadURLs] = useState([]);

    useEffect(() => {
        console.log("thisVenue passed into venue is:", venue)
        if (venue?.images?.length > 0) {
            FirebaseFunctions.convertPathsToDownloadURLs(venue.images)
                .then((downloadURLs) => setImageDownloadURLs(downloadURLs));
            FirebaseFunctions.convertPathsToDownloadURLs([venue.displayImagePath])
                .then((downloadURLs) => setDisplayImageDownloadURLs(downloadURLs));
        }
    }, [venue])

    const handleCheck = (e) => {
        console.log("e.target.value:", e.target.value)
        const copyOfSelectedFields = {...selectedFields, [e.target.value]: !selectedFields[e.target.value]};
        console.log("copyOfSelectedFields", copyOfSelectedFields)
        setSelectedFields(copyOfSelectedFields);
    }

    const changeChecked = (checkedKey) => {
        const fakeEvent = {target: {value: checkedKey}};
        handleCheck(fakeEvent);
    }
    return (
        <ContentCard>
            <p className={"font-bold pb-8"}>{venue.venueName}</p>
            <VenueToggleAllChecks selectedFields={selectedFields} setSelectedFields={setSelectedFields}/>

            <VenueInfoItem value={"venueName"} checked={selectedFields.venueName} handleOnClick={() => changeChecked("venueName")}
            required={requireMandatoryFields}
            >
                <p>{venue.venueName}</p>
            </VenueInfoItem>
            <VenueInfoItem value={"description"} checked={selectedFields.description} handleOnClick={() => changeChecked("description")}
                           required={requireMandatoryFields}>
                <p>{venue.description}</p>
            </VenueInfoItem>

            <VenueInfoItem value={"address"} checked={selectedFields.address} handleOnClick={() => changeChecked("address")}
                           required={requireMandatoryFields}>
                <p>{venue.address.address}</p>
                <p>{venue.address.postalCode}</p>
            </VenueInfoItem>
            {/*override label here because the default would be PhoneNumber without a space*/}
            <VenueInfoItem value={"phoneNumber"} checked={selectedFields.phoneNumber} handleOnClick={() => changeChecked("phoneNumber")}
                           required={requireMandatoryFields}>
                <p>{venue.phoneNumber}</p>
            </VenueInfoItem>
            <VenueInfoItem value={"images"} checked={selectedFields.images} handleOnClick={() => changeChecked("images")}>
                <ImageCarousel downloadURLs={imageDownloadURLs} />
            </VenueInfoItem>
            <VenueInfoItem value={"displayImagePath"} label={"Display Image"} checked={selectedFields.displayImagePath} handleOnClick={() => changeChecked("displayImagePath")}>
                <ImageCarousel downloadURLs={displayImageDownloadURLs} />
            </VenueInfoItem>
            <VenueInfoItem value={"amenities"} checked={selectedFields.amenities} handleOnClick={() => changeChecked("amenities")}>
                <Amenities selectedAmenities={venue.amenities} clickable={false}/>
            </VenueInfoItem>
            <VenueInfoItem value={"averagePrice"} checked={selectedFields.averagePrice} handleOnClick={() => changeChecked("averagePrice")}
                           required={requireMandatoryFields}>
                <AveragePrice selectedAveragePrice={venue.averagePrice} clickable={false}/>
            </VenueInfoItem>
            <VenueInfoItem value={"businessHours"} checked={selectedFields.businessHours} handleOnClick={() => changeChecked("businessHours")}>
                <h2>Regular Business Hours</h2>
                <div className="flex flex-col gap-2">
                    {Object.keys(venue.businessHours).map((key, index) => {
                        if (key == "holidays") return; // skip holidays
                        if (key == "businessHoursId") return; // skip businessHoursId
                        const day = capitalize(key);
                        const timeRangeList = venue.businessHours[key];
                        return (
                            <DayBusinessHours
                                key={day}
                                day={day}
                                timeRangeList={timeRangeList}
                            />
                        );
                    })}
                </div>
                <h2>Holiday Dates</h2>
                <div>
                    <HolidayDatesSection
                        dateRangeList={venue.businessHours.holidays}
                        addonFlexClassNames={"items-start"}
                    />
                </div>
            </VenueInfoItem>

        </ContentCard>
    )
}
