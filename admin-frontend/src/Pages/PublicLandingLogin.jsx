import React, { useState, useEffect, useContext } from "react";
import "../index.css";
import Api from "../Helpers/Api";
import studylogo from "../Resources/sgw-icon-orange.svg";
import { useNavigate } from "react-router-dom";
import { decodeJwt } from "jose";
import axios from "axios";

import { LoginTokenContext } from "../Helpers/LoginTokenContext";

const PublicLanding = () => {
  const [token, setToken, encodedToken, setEncodedToken] =
    useContext(LoginTokenContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const logTokenValue = () => {
    console.log(localStorage.getItem("token"));
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await Api.authenticateAdmin(formData);
      console.log("this is the repsonse");

      console.log(response);
      if (response.status === 200) {
        let tokenString = response.data.token;
        setEncodedToken(tokenString);
        let decodedToken = decodeJwt(tokenString);
        setToken(decodedToken);    
        navigate("/home");
        console.log("success");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Invalid login credentials. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-white ">
        {/* big border */}
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          {/* inner one */}

          <div className="flex items-center mb-6 text-2xl font-semibold text-gray-800">
            <img className="h-8 mr-2" src={studylogo} alt="logo" />
            StudyGoWhere
          </div>
          {/* form */}
          <div className="w-full bg-gray-800 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                Sign in to your account
              </h1>
              {error && <p className="text-red-500">{error}</p>}
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Your username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="username"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="*******"
                      required
                    />
                    <button
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                {/* <div className="flex items-center justify-between">
                  <div></div>
                  <a href="#" className="text-sm font-medium text-white hover:underline">Forgot password?</a>
              </div> */}
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign in
                </button>

                {/* <p className="text-sm font-medium text-gray-400">
                    Don’t have an account yet? <a href="#" className="font-medium text-white hover:underline ">Sign up</a>
              </p> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicLanding;
