import React from "react";
import background from "../../Assets/image/studycafe.jpg";
import Navbar from "../Navbar/Navbar";

const PublicStructure = ({ children }) => {
  return (
    <div
      className="landing-background min-h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
      }}
    >
      <div className="fixed inset-0 bg-black opacity-70 z-0"></div>
      <Navbar />
      {children}
    </div>
  );
};

export default PublicStructure;
