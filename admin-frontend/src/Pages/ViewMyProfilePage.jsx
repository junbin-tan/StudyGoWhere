import React from 'react';
import PageHeaderBasic from '../Components/PageHeaderBasic';
import Button from "../Components/Button";
import useEncodedToken from '../Helpers/useEncodedToken';
import MyProfileForm from '../Components/MyProfileForm';

const ViewMyProfilePage = () => {
  const { encodedToken } = useEncodedToken();


  return (
    <div className="flex flex-col">
      <div>
        <PageHeaderBasic title="My Profile">
            <Button title="Back" location="/home"/>
        </PageHeaderBasic>
      </div>
      <div className="py-5 px-10">
        <div className="p-5  flex justify-center rounded-lg shadow-lg">
           <MyProfileForm />
        </div>
      </div>
    </div>
  )
}

export default ViewMyProfilePage