import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import Api from "../FunctionsAndContexts/FetchOwnerInfoAPI";
import PageStructure from "../Components/PageStructure/PageStructure";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";
import EditVoucherListingForm from "../Components/Voucher/EditVoucherListingForm";
import { RiCoupon3Line } from "react-icons/ri";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const EditVoucherListingPage = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  const { voucherListingId } = useParams();
  const [vcListing, setVcListing] = useState(null);
  const [vcName, setVcName] = useState("");

  useEffect(() => {
    Api.getVoucherListingById(voucherListingId, encodedToken)
      .then((response) => response.json())
      .then((data) => {
        setVcListing(data);
      })
      .catch((error) => {
        console.error("Error fetching voucher listing details:", error);
      });
  }, [voucherListingId]);

  useEffect(() => {
    if (vcListing) {
      setVcName(vcListing.voucherName);
    }
  });

  console.log(voucherListingId);

  function ActiveLastBreadcrumb({ name }) {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/vouchers">
            Home
          </Link>
          <Link underline="hover" className="text-lightgray-100" to="/vouchers">
            Vouchers Listing
          </Link>
          <Link underline="hover" className="text-custom-yellow">
            Edit Voucher '{name}' Details
          </Link>
        </Breadcrumbs>
      </div>
    );
  }

  return (
    <>
      <PageStructure
        icon={<EditOutlinedIcon sx={{ fontSize: "1.2em" }} />}
        title={`Edit Voucher '${vcName}' Details`}
        breadcrumbs={<ActiveLastBreadcrumb name={vcName} />}
      >
        <EditVoucherListingForm vcListing={vcListing} />
      </PageStructure>
    </>
  );
};

export default EditVoucherListingPage;
