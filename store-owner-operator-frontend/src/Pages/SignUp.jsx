import React, { useContext } from "react";
import "../index.css";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import SignUpFormCard from "../Components/SignUp/SignUpFormCard";
import Navbar from "../Components/Navbar/Navbar";
import { ReactComponent as SignUpSvg } from "../Assets/image/studying.svg";
import { ReactComponent as SGWIcon } from "../Assets/image/sgw-icon-orange.svg";
import studyImage from "../Assets/image/studying.jpg";
import background from "../Assets/image/studycafe.jpg";
import PublicStructure from "../Components/PageStructure/PublicStructure";

const SignUp = () => {
  const [token, setToken, encodedToken, setEncodedToken] =
    useContext(LoginTokenContext);

  return (
    <PublicStructure>
      <div className="w-full ">
        <SignUpFormCard setToken={setToken} setEncodedToken={setEncodedToken} />
      </div>
    </PublicStructure>

    // <>
    //   <div className="landing-background">
    //     <div className="absolute left-1/2 text-center items-center translate-y-full -translate-x-1/2">
    //       <div className="flex flex-col gap-8 text-white">
    //         <h1 className="study-go-where-icon-font relative text-white text-7xl">
    //           StudyGoWhere
    //         </h1>
    //         <h3 className="text-xl">
    //           Empowering Students, Transforming Spaces
    //         </h3>
    //       </div>
    //
    //       <button className="w-3/4 bg-brown-80 px-10 py-3 my-10 rounded-full text-white items-center align-middle">
    //         <div className="flex justify-between large-medium">
    //           Get discoverable with us <ArrowDownwardIcon />
    //         </div>
    //       </button>
    //
    //     </div>
    //     <Container>
    //       <LoginFormCard/>
    //     </Container>
    //   </div>
    // </>
  );
};

export default SignUp;
