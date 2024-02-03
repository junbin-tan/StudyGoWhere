import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Api from "../../Helpers/Api";
import PageHeaderBasic from "../../Components/PageHeaderBasic";
import Button from "../../Components/Button";
import useEncodedToken from "../../Helpers/useEncodedToken";
import ViewOwnerForm from "../../Components/Owner/ViewOwnerForm";

const ViewOwnerPage = () => {

    const { ownerId } = useParams();
    const [ownerData, setOwnerData] = useState(null);
  
    const { encodedToken } = useEncodedToken();
  
    useEffect(() => {
      Api.getOwnerById(ownerId, encodedToken)
        .then((response) => response.json())
        .then((data) => {
            setOwnerData(data);
        })
        .catch((error) => {
          console.error("Error fetching owner details:", error);
        });
    }, [ownerId]);
  

    // console.log(ownerData)

    return (
        <div className="flex flex-col">
          <div>
            <PageHeaderBasic title="View Owner Details">
              <Button title="Back" location="/ownerlistingpage" />
            </PageHeaderBasic>
          </div>
          <div className="py-5 px-10">
            <div className="p-5  flex justify-center rounded-lg shadow-lg">
                <ViewOwnerForm owner={ownerData} />
            </div>
          </div>
        </div>
      );
}

export default ViewOwnerPage