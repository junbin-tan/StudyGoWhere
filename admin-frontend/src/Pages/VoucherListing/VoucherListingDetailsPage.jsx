import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Api from "../../Helpers/Api";
import PageHeaderBasic from "../../Components/PageHeaderBasic";
import Button from "../../Components/Button";
import useEncodedToken from "../../Helpers/useEncodedToken";
import ViewVoucherListingForm from "../../Components/VoucherListing/ViewVoucherListingForm";

const VoucherListinDetailsPage = () => {


  const { voucherListingId } = useParams();
  const [voucherListingData, setVoucherListingData] = useState(null);

  const { encodedToken } = useEncodedToken();

  useEffect(() => {
    Api.getVoucherListingById(voucherListingId, encodedToken)
      .then((response) => response.json())
      .then((data) => {
        setVoucherListingData(data);
      })
      .catch((error) => {
        console.error("Error fetching voucher listing details:", error);
      });
  }, [voucherListingId]);

  console.log(voucherListingData)


  return (
    <div className="flex flex-col">
      <div>
        <PageHeaderBasic title="View Voucher Listing">
          <Button title="Back" location="/viewVoucherListingPage" />
        </PageHeaderBasic>
      </div>
      <div className="py-5 px-10">
        <div className="p-5  flex justify-center rounded-lg shadow-lg">
            <ViewVoucherListingForm vcListing={voucherListingData} />
        </div>
      </div>
    </div>
  );
}

export default VoucherListinDetailsPage