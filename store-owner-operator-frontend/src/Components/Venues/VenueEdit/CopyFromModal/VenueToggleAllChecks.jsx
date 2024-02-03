import { Checkbox, FormControlLabel } from "@mui/material";
import camelCaseToCapitalized from "../../../../utilities/camelCaseToCapitalized";
// we can actually save some work with checked and handleOnClick by inferring it from the value,
// but I think its much clearer to just pass it in as a prop in the modal
// Label here is automatically derived from value but we can set it manually as well.
export default function VenueToggleAllChecks({
  value,
  selectedFields,
  setSelectedFields,
  children,
}) {
  const isEveryFieldSelected = Object.values(selectedFields).every(
    (fieldValue) => fieldValue == true
  );

  const toggleAllFields = () => {
    console.log("isEveryFieldSelected", isEveryFieldSelected);
    if (isEveryFieldSelected) {
      const emptiedSelectedFields = { ...selectedFields };
      Object.keys(emptiedSelectedFields).forEach((key) => {
        emptiedSelectedFields[key] = false; // reverse each boolean value
      });

      // actually we don't have to do the above, we can just setSelectedFields to an empty object
      // but just to be safe, idw to deal with undefined values

      setSelectedFields(emptiedSelectedFields);
    } else {
      const filledSelectedFields = { ...selectedFields };
      Object.keys(filledSelectedFields).forEach((key) => {
        filledSelectedFields[key] = true;
      });
      setSelectedFields(filledSelectedFields);
    }
  };

  return (
    // change hover classes here
    <div
      className={`${
        isEveryFieldSelected
          ? "border-2 border-custom-yellow bg-custom-yellow text-white hover:bg-custom-yellow-hover   cursor-pointer"
          : "border border-gray-300 hover:bg-gray-300 cursor-pointer"
      } px-4 rounded-xl`}
      onClick={(e) => {
        e.preventDefault();
        toggleAllFields();
      }}
    >
      <FormControlLabel
        label={"Select All"}
        control={
          <Checkbox
            checked={isEveryFieldSelected}
            className={`${
              isEveryFieldSelected ? "text-white hover:text-custom-yellow" : ""
            }`}
            // style={{
            //   color: isEveryFieldSelected
            //     ? "white"
            //     : ":hover"
            //     ? "var(--custom-yellow)"
            //     : "",
            // }}
          />
        }
        componentsProps={{
          typography: {
            className: "font-semibold",
            onClick: (e) => e.stopPropagation(),
          },
        }}
        // you may wonder why we dont use onClick here,
        // its because the onClick is handled in the grandparent div of VenueInfoItem
        // if the div somehow fucks up, we can revert to using onClick={handleCheck} in the Checkbox component
      />
      {children}
    </div>
  );
}
