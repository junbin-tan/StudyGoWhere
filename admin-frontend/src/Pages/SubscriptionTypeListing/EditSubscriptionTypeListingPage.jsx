import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Api from "../../Helpers/Api";
import PageHeaderBasic from "../../Components/PageHeaderBasic";
import Button from "../../Components/Button";
import useEncodedToken from "../../Helpers/useEncodedToken";
import EditSubscriptionTypeForm from "../../Components/SubscriptionType/EditSubscriptionTypeForm";

const EditSubscriptionTypeListingPage = () => {
  const { subTypeId } = useParams();
  const [subTypeData, setSubTypeData] = useState(null);

  const { encodedToken } = useEncodedToken();

  useEffect(() => {
    Api.getSubscriptionTypeById(subTypeId, encodedToken)
      .then((response) => response.json())
      .then((data) => {
        setSubTypeData(data);
      })
      .catch((error) => {
        console.error("Error fetching subscription type details:", error);
      });
  }, [subTypeId]);

  console.log(subTypeData)

  return (
    <div className="flex flex-col">
      <div>
        <PageHeaderBasic title="Edit Subscription Type">
          <Button title="Back" location="/subscriptiontype" />
        </PageHeaderBasic>
      </div>
      <div className="py-5 px-10">
        <div className="p-5  flex justify-center rounded-lg shadow-lg">
            <EditSubscriptionTypeForm subType={subTypeData} />
        </div>
      </div>
    </div>
  );
};

export default EditSubscriptionTypeListingPage;
