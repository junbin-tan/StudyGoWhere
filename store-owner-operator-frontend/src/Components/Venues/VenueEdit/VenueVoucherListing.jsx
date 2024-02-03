import React from "react";
import CreateVoucherListingForm from "../../Voucher/CreateVoucherListingForm";
import VoucherListingCard from "../../Voucher/VoucherListingCard";

const VenueVoucherListing = ({ formData, encodedToken }) => {
  console.log(formData);
  return (
    <>
      <CreateVoucherListingForm formData={formData} />
      <VoucherListingCard />
    </>
  );
};

export default VenueVoucherListing;
