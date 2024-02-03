import React, { useContext, useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import { Breadcrumbs, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import FetchOwnerInfoAPI from "../../FunctionsAndContexts/FetchOwnerInfoAPI";
import FetchOperatorInfoAPI from "../../FunctionsAndContexts/FetchOperatorInfoAPI";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import { OperatorUserContext } from "../../FunctionsAndContexts/OperatorUserContext";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb");
}

const PageStructure = ({
  title,
  breadcrumbs,
  children,
  actionButton,
  icon,
}) => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  // the || {} is to prevent the useContext from returning undefined; similar to using &&
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext) || {};
  const { operatorData, setOperatorData } =
    useContext(OperatorUserContext) || {};

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("encodedToken");
    navigate("/");
    window.location.reload(); // reloads the page so the logged out version is shown
  };
  // Fetches owner or operator data.
  // and also checks if they are enabled
  useEffect(() => {
    if (token.role == "Owner") {
      FetchOwnerInfoAPI.getOwner(encodedToken)
        .then((response) => {
          if (response.status == 200) {
            setOwnerData(response.data);
          }
          return response.data;
        })
        .then((owner) => {
          if (!owner.enabled) {
            logout();
          }
        })
        .catch((error) => {
          console.log(error);
          logout();
        });
    } else {
      // do the equivalent for Operator
      FetchOperatorInfoAPI.getOperator(encodedToken)
        .then((response) => {
          if (response.status == 200) {
            setOperatorData(response.data);
          }
          return response.data;
        })
        .then((operator) => {
          console.log("Is operator enabled?", operator.enabled);
          if (!operator.enabled) {
            logout();
          }
        })
        .catch((error) => {
          console.log(error);
          logout();
        });
    }
  }, []);

  return (
    <>
      <div className="flex flex-row overflow-x-hidden overflow-y-hidden bg-white min-h-screen">
        {/*<div className="fixed bg-white rounded-r-2xl rounded-bl-none border-r-2 border-t-2 border-b-2 border-custom-yellow h-screen overflow-y-auto z-20">*/}
        <div className="fixed bg-custom-yellow border-r-2  h-screen overflow-y-auto z-20">
          <SideBar />
        </div>

        <div className="w-full overflow-y-visible overflow-x-auto ml-60 z-10 bg-lightgray-80">
          <Profile classNameProp="px-8 py-8 absolute right-1" />
          <div className="main-content flex flex-col gap-y-12 pt-28 pb-24 px-10">
            <div className="page-title">
              <div className="flex flex-row justify-between gap-4 pr-5 items-center">
                <p className="text-3xl items-center font-semibold text-gray-90 flex flex-row gap-2">
                  {icon}
                  {title}
                </p>
                {actionButton}
              </div>

              {breadcrumbs}
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default PageStructure;
