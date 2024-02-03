import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Api from "../../Helpers/Api";
import PageHeaderBasic from "../../Components/PageHeaderBasic";
import Button from "../../Components/Button";
import useEncodedToken from "../../Helpers/useEncodedToken";
import ViewVenueForm from "../../Components/Venue/ViewVenueForm";

const ViewVenuePage = () => {
  const { venueId } = useParams();
  const [venueData, setVenueData] = useState(null);

  const { encodedToken } = useEncodedToken();

  useEffect(() => {
    Api.getVenueById(venueId, encodedToken)
      .then((response) => response.json())
      .then((data) => {
        setVenueData(data);
      })
      .catch((error) => {
        console.error("Error fetching venue details:", error);
      });
  }, [venueId]);


   console.log(venueData)

   return (
    <div className="flex flex-col">
      <div>
        <PageHeaderBasic title="View Venue Details">
          <Button title="Back" location="/venuelistingpage" />
        </PageHeaderBasic>
      </div>
      <div className="py-5 px-10">
        <div className="p-5  flex justify-center rounded-lg shadow-lg">
            <ViewVenueForm venue={venueData} />
        </div>
      </div>
    </div>
  );
};

export default ViewVenuePage;
