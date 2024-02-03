import React from 'react';
import PageHeaderBasic from '../Components/PageHeaderBasic';
import CreateAdminForm from '../Components/Admin/CreateAdminForm';
import Button from "../Components/Button";
import useEncodedToken from '../Helpers/useEncodedToken';

const CreateAdminPage = () => {
  const { encodedToken } = useEncodedToken();

  return (
    <div className="flex flex-col">
      <div>
        <PageHeaderBasic title="Create Admin">
            <Button title="Back" location="/admin"/>
        </PageHeaderBasic>
      </div>
      <div className="py-5 px-10">
        <div className="p-5  flex justify-center rounded-lg shadow-lg">
            <CreateAdminForm className=""/>
        </div>
      </div>
    </div>
  )
}

export default CreateAdminPage