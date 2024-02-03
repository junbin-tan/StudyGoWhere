// PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import useEncodedToken from "./useEncodedToken";
import useToken from "./useToken";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { token, setToken } = useToken();
  const { encodedToken } = useEncodedToken();


  if (!token || token.role !== "Admin" || token.exp < Date.now() / 1000) {
    return <Navigate to="/login" replace />;
  }


  return children;
};

export default PrivateRoute;
