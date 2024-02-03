import React, {useEffect} from "react";


// added clickable prop to use in static pages where user cannot edit amenities (eg. CopyFromModal, VenueDashboard)
const Amenities = ({ selectedAmenities = [], handleAmenitiesChange, clickable = true }) => {
  const amenities = [
    { id: 1, name: "Wifi" },
    { id: 2, name: "Charging Ports" },
    { id: 3, name: "Takeaway Availability" },
  ];

  const toggleAmenity = (amenityName) => {
    const changedSelectedAmenities = [...selectedAmenities];
    if (changedSelectedAmenities.includes(amenityName)) {
        changedSelectedAmenities.splice(
            changedSelectedAmenities.indexOf(amenityName),
            1
        );
    } else {
        changedSelectedAmenities.push(amenityName);
    }

    handleAmenitiesChange(changedSelectedAmenities);
  };

  return (
    <div className="flex flex-row gap-2 ">
      {amenities.map((amenity) => (
        <div
          key={amenity.id}
          className={
            selectedAmenities.includes(amenity.name)
              ? "amenity amenity-selected"
              : "amenity"
              // need to set a different class for when the amenity is non-clickable!!!
          }
          onClick={clickable ? () => toggleAmenity(amenity.name) : null}
        >
          {amenity.name}
        </div>
      ))}
    </div>
  );
};

export default Amenities;
