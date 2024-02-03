import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, TextField } from "@mui/material"; // Added TextField import
import { Select, MenuItem } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Api from "../../FunctionsAndContexts/Api";
import Button from "@mui/material/Button";
import FieldLabel from "../CommonComponents/Form/FieldLabel";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";

const MenuDetailForms = () => {
  return (
    <div>MenuDetailForms</div>
  )
}

export default MenuDetailForms