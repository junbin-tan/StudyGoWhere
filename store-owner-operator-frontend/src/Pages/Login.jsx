import React, { useContext } from "react";
import "../index.css";
import LoginFormCard from "../Components/Login/LoginFormCard";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import Navbar from "../Components/Navbar/Navbar";
import background from "../Assets/image/studycafe.jpg";
import studyImage from "../Assets/image/librarystudy.jpg";
import PublicStructure from "../Components/PageStructure/PublicStructure";

const Login = () => {
  const [token, setToken, encodedToken, setEncodedToken] =
    useContext(LoginTokenContext);

  return (
    <>
      <PublicStructure>
        <div className="w-full ">
          <LoginFormCard
            setToken={setToken}
            setEncodedToken={setEncodedToken}
          />
        </div>

        {/* <div className="text-center z-20 pb-32">
            <LoginFormCard
              setToken={setToken}
              setEncodedToken={setEncodedToken}
            />
          </div> */}
      </PublicStructure>

      {/* <div className="landing-background">
        <div className="absolute left-1/2 text-center items-center translate-y-full -translate-x-1/2">
          <div className="flex flex-col gap-8 text-white">
            <h1 className="study-go-where-icon-font relative text-white text-7xl">
              StudyGoWhere
            </h1>
            <h3 className="text-xl">
              Empowering Students, Transforming Spaces
            </h3>
          </div>

          <button className="w-3/4 bg-brown-80 px-10 py-3 my-10 rounded-full text-white items-center align-middle">
            <div className="flex justify-between large-medium">
              Get discoverable with us <ArrowDownwardIcon />
            </div>
          </button>
          <Container>
            <LoginFormCard setToken={setToken} setEncodedToken={setEncodedToken}/>
          </Container>
        </div>
      </div> */}
    </>
  );
};

export default Login;
