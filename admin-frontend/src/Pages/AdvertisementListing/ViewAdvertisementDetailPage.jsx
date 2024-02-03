import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Api from "../../Helpers/Api";
import PageHeaderBasic from "../../Components/PageHeaderBasic";
import Button from "../../Components/Button";
import useEncodedToken from "../../Helpers/useEncodedToken";
import AdvertisementDetailsForm from "../../Components/Advertisement/AdvertisementDetailsForm";

const ViewAdvertisementDetailPage = () => {

    const { advertId } = useParams();
    const [adData, setAdData] = useState(null);

    const { encodedToken } = useEncodedToken();

    useEffect(() => {
        Api.getAdvertisementById(advertId, encodedToken)
          .then((response) => response.json())
          .then((data) => {
            setAdData(data);
          })
          .catch((error) => {
            console.error("Error fetching subscription type details:", error);
          });
      }, [advertId]);
    
      console.log("here")
      console.log(adData)

      return (
        <div className="flex flex-col"> 
          <div>
            <PageHeaderBasic title="Verify Advertisment">
              <Button title="Back" location="/advertisementlistingpage" />
            </PageHeaderBasic>
          </div>
          <div className="py-5 flex w-full px-10">
            <div className="p-5 w-full flex justify-center rounded-lg shadow-lg">
                <AdvertisementDetailsForm adData={adData} />
            </div>
          </div>
        </div>
      );
}

export default ViewAdvertisementDetailPage