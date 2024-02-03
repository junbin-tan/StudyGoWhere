import EditAdminForm from "../Components/Admin/EditAdminForm";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Api from "../Helpers/Api";
import PageHeaderBasic from "../Components/PageHeaderBasic";
import Button from "../Components/Button";
import useEncodedToken from "../Helpers/useEncodedToken";

const EditAdminPage = () => {
  const { adminId } = useParams();
  const [adminData, setAdminData] = useState(null);

  const { encodedToken } = useEncodedToken();

  useEffect(() => {
    Api.getAdminById(adminId, encodedToken)
      .then((response) => response.json())
      .then((data) => {
        setAdminData(data);
      })
      .catch((error) => {
        console.error("Error fetching admin details:", error);
      });
  }, [adminId]);


  return (
    <div className="flex flex-col">
      <div>
        <PageHeaderBasic title="Edit Admin">
          <Button title="Back" location="/admin" />
        </PageHeaderBasic>
      </div>
      <div className="py-5 px-10">
        <div className="p-5  flex justify-center rounded-lg shadow-lg">
          <EditAdminForm admin={adminData} />
        </div>
      </div>
    </div>
  );
};

export default EditAdminPage;
