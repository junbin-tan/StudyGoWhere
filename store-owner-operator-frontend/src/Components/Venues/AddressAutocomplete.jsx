import React, { useState } from "react";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from "react-places-autocomplete";
import { useJsApiLoader } from "@react-google-maps/api";
import TextField from "@mui/material/TextField";
import "./AddressAutocomplete.css";

const AddressAutocomplete = ({
    passedHandleChange,
    selectedAddress,
    setSelectedAddress,
    selectedLatLng,
    setSelectedLatLng,
    selectedPostalCode,
    setSelectedPostalCode,
    handlePostalCodeChange,
    addressError,
    postalCodeError,
    setPostalCodeError,
}) => {
    // const [address, setAddress] = useState('');
    // const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

    // WE DONT NEED THIS CHUNK OF CODE SINCE THE SCRIPT IS LOADED IN <head> OF INDEX.HTML.
    // but good to keep here so we know what code to execute to load google scripts

    // const { isLoaded } = useJsApiLoader({
    //   id: 'google-map-script',
    //   googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    // })

    const handleChange = (address) => {
        setSelectedAddress(address);
        passedHandleChange({target: {name: "address.address", value: address}});
    };

    const handleSelect = async (address) => {
        // setting address and triggering handleChange for address
        setSelectedAddress(address);
        passedHandleChange({target: {name: "address.address", value: address}});

        console.log(address);

        // setting postalCode & latLng, and triggering handleChange for postalCode
        // this part is unnecessarily complicated due to my own ineptitude, but it works
        try {
            const results = await geocodeByAddress(address);
            const latLng = await getLatLng(results[0]);

            const postalCodeObj = results[0].address_components.find((comp) =>
                comp.types.includes("postal_code")
            );
            if (setSelectedLatLng) {
                // if it is not undefined
                setSelectedLatLng(latLng);
            }
            if (setSelectedPostalCode && postalCodeObj) {
                // because some addresses may not have postal codes
                setSelectedPostalCode(postalCodeObj.long_name);
                passedHandleChange({target: {name: "address.postalCode", value: postalCodeObj.long_name}});
                // setPostalCodeError(!/^\d{6}$/.test(postalCodeObj.long_name));
            } else {
                // if no postal code for that location is found reset it to nothing
                setSelectedPostalCode("");
                passedHandleChange({target: {name: "address.postalCode", value: ""}});
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-x-4">
            <div id="AutocompleteBox" className="col-span-1">
                <p className="regular-medium">Address</p>
                <PlacesAutocomplete
                    value={selectedAddress}
                    onChange={handleChange}
                    onSelect={handleSelect}
                >
                    {({
                        getInputProps,
                        suggestions,
                        getSuggestionItemProps,
                        loading,
                    }) => (
                        <div style={{ position: "relative" }}>
                            {/* forgive me for this black magic of inline styling (needed for absolute positioning) */}
                            <TextField
                                {...getInputProps({
                                    placeholder: "Enter your address...",
                                    fullWidth: true,
                                    variant: "outlined",
                                })}
                                value={selectedAddress}
                                error={addressError}
                                helperText={addressError && "Cannot have empty address"}
                                autoComplete={"new-password"}
                            />
                            <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map((suggestion, index) => {
                                    const className = suggestion.active
                                        ? "suggestion-item--active"
                                        : "suggestion-item";
                                    return (
                                        <div
                                            key={index}
                                            {...getSuggestionItemProps(
                                                suggestion,
                                                {
                                                    className,
                                                }
                                            )}
                                        >
                                            <span>
                                                {suggestion.description}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>
            </div>
            <div id="PostalCodeBox" className="flex flex-col col-span-1">
                <label htmlFor="postalCode" className="regular-medium">
                    Postal Code
                </label>
                <TextField
                    name={"addressPostalCode"} // i should change the name but if i change this it will break AddVenue
                    required
                    value={selectedPostalCode}
                    onChange={handlePostalCodeChange}
                    error={postalCodeError}
                    helperText={postalCodeError && "Postal code must be 6 digits"}
                    autoComplete={"new-password"}
                />
            </div>
        </div>
    );
};

export default AddressAutocomplete;
