import React from 'react';
import PageHeaderBasic from '../../Components/PageHeaderBasic';
import Button from "../../Components/Button";
import useEncodedToken from '../../Helpers/useEncodedToken';
import CreateSubscriptionTypeForm from '../../Components/SubscriptionType/CreateSubscriptionTypeForm';

const CreateSubscriptionTypePage = () => {
  const { encodedToken } = useEncodedToken();

  return (
    <div className="flex flex-col">
      <div>
        <PageHeaderBasic title="Create Subscription Type">
            <Button title="Back" location="/subscriptiontype"/>
        </PageHeaderBasic>
      </div>
      <div className="py-5 px-10">
        <div className="p-5  flex justify-center rounded-lg shadow-lg">
            <CreateSubscriptionTypeForm/>
        </div>
      </div>
    </div>
  )
}

export default CreateSubscriptionTypePage