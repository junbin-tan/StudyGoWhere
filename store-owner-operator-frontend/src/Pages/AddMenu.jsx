import React, { useContext, useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link } from "react-router-dom";
import { Breadcrumbs, Card } from "@mui/material";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";
import PageStructure from "../Components/PageStructure/PageStructure";
import CreateMenuForm from "../Components/Menu/CreateMenuForm";

const AddMenu = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);

  function ActiveLastBreadcrumb({}) {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/menus">
            Home
          </Link>
          <Link underline="hover" className="text-lightgray-100" to="/menus">
            Menus
          </Link>
          <Link underline="hover" className="text-custom-yellow" to="/add-menu">
            Add Menus
          </Link>
        </Breadcrumbs>
      </div>
    );
  }

  return (
    <>
      <PageStructure
        icon={<MenuBookIcon size="2.5rem" />}
        title={"Create Menu"}
        breadcrumbs={<ActiveLastBreadcrumb />}
      >
        <CreateMenuForm />
      </PageStructure>
    </>
  );
};

export default AddMenu;
