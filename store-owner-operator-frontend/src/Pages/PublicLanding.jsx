import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import SideBar from "../Components/SideBar/SideBar";
import "../index.css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Link } from "react-router-dom";
import background from "../Assets/image/studycafe.jpg";
import { ReactComponent as SGWIcon } from "../Assets/image/sgw-icon-white.svg";
import PublicStructure from "../Components/PageStructure/PublicStructure";

const PublicLanding = () => {
  return (
    <>
      <PublicStructure>
        <div className="flex flex-col relative items-center mx-auto justify-center text-center">
          <div className="flex flex-col text-white z-60 items-center mt-24">
            <SGWIcon />
            <h1 className="study-go-where-icon-font mb-3 relative text-white text-6xl">
              StudyGoWhere
            </h1>
            <h3 className="text-xl text-white mt-3">
              Empowering Students, Transforming Spaces
            </h3>
          </div>

          <button className="bg-custom-yellow px-20 py-3 my-12 rounded-full text-white items-center align-middle">
            <div className="large-medium items-center">
              Get discoverable with us
            </div>
          </button>
        </div>
      </PublicStructure>
    </>
  );
};

export default PublicLanding;
