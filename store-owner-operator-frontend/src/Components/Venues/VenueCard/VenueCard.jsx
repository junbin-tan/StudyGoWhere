import React, { useEffect } from "react";
import { CrowdLevel } from "./CrowdLevel/CrowdLevel";
import { Link } from "react-router-dom";
import "./venueCard.css";
import { getDownloadURL, ref } from "firebase/storage";
import storage from "../../../firebase";
import catPic from "../../../Assets/image/profile_1.jpeg";

export const VenueCard = ({
  id,
  venueImagePath,
  name,
  crowdLevel,
  status,
  isBanned,
}) => {
  console.log(crowdLevel);
  const [imageURL, setImageURL] = React.useState(null);
  useEffect(() => {
    console.log("venueImagePath is: ", venueImagePath);
    if (venueImagePath) {
      getDownloadURL(ref(storage, venueImagePath))
        .then((url) => setImageURL(url))
        .catch((err) => console.log(err.message));
    }
  }, [venueImagePath]);

  return (
    <Link to={`/venues/${id}`} className="card-link">
      <div
        // className={"venue-card"}
        className={`venue-card rounded-xl shadow-md hover:shadow-lg ${
          isBanned == true
            ? "border-4 text-gray-500 border-gray-500 hover:bg-gray-500 hover:text-white"
            : status === "DEACTIVATED"
            ? "border-4 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
            : "border-4 text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
        }`}
        style={
          venueImagePath
            ? {
                backgroundImage: `url(${imageURL})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
              }
            : {
                // backgroundImage: `url(${catPic})`
              }
        }
      >
        <CrowdLevel level={crowdLevel} status={status} isBanned={isBanned} />

        <div
          className="text-wrapper-2 text-xl font-semibold"
          style={
            venueImagePath && {
              color: "white",
              textShadow:
                "-1px -1px 0 black," +
                "1px -1px 0 black," +
                "-1px  1px 0 black," +
                "1px  1px 0 black",
            }
          }
        >
          {name}
        </div>
        {/*


      hide crowd level and store status for now

        {/* <div className="store-status">
          <div className="text-wrapper-3">{status}</div>
        </div> */}
      </div>
    </Link>
  );
};
