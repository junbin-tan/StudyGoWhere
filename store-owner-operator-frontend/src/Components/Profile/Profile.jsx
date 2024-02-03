import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import profilePic from "../../Assets/image/profile_1.jpeg";
import storage from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { OperatorUserContext } from "../../FunctionsAndContexts/OperatorUserContext";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import FetchOwnerInfoAPI from "../../FunctionsAndContexts/FetchOwnerInfoAPI";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";

const Profile = ({ classNameProp }) => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  // the || {} is to prevent the useContext from returning undefined; similar to using &&
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext) || {};
  const { operatorData, setOperatorData } =
    useContext(OperatorUserContext) || {};

  const [propic, setPropic] = React.useState(profilePic);
  useEffect(() => {

    if (ownerData == undefined) return;
    async function fetchData() {
      try {
        const url = await getDownloadURL(
          ref(storage, "/user-images/" + ownerData?.userId)
        );
        setPropic(url);
      } catch (error) {
        console.log("error fetching userimages", error)
      }
    }

    fetchData();
  }, [ownerData]);

  return (
    <div className={classNameProp}>
      {/* need to edit this div later because it gets squished when zooming in*/}
      <div className="profile flex flex-col">
        <div className="flex flex-row justify-center items-center gap-5">
          <p className="text-gray-80">
            Welcome,{" "}
            {ownerData ?
            <Link
                to={{
                  pathname: "/viewmyprofile",
                  ownerData: { ownerData },
                }}
            >
            <span className="text-center font-semibold  hover:underline hover:text-custom-yellow ease-in duration-200">
              {ownerData?.name}
            </span>
            </Link> :

                <span className="text-center font-semibold">
                    {operatorData?.username}
                </span>
            }
          </p>

          {ownerData && (
          <Link
            to={{
              pathname: "/viewmyprofile",
              ownerData: { ownerData },
            }}
          >
            <img
              className="w-10 h-10 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 hover:ring-custom-yellow hover:shadow-lg transition-all duration-300"
              src={propic}
              alt="Bordered avatar"
            />
          </Link>
              )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
