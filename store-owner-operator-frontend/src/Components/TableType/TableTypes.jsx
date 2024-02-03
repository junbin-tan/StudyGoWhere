import React, { useContext } from "react";
import BodyCard from "../CommonComponents/Card/BodyCard";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import { Button, Breadcrumbs } from "@mui/material";
import TableTypeList from "./TableTypeList";
import TextClassSets from "../../utilities/TextClassSets";
import FieldInfo from "../CommonComponents/Form/FieldInfo";
import { Link, useParams } from "react-router-dom";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import { OperatorUserContext } from "../../FunctionsAndContexts/OperatorUserContext";

const TableTypes = ({ venueData, thisVenueId }) => {
  const { id } = useParams();

  return (
    <BodyCard>
      <div className={TextClassSets.header}>
        <div className="flex flex-col">
          <h2 className={TextClassSets.h2}>Table Types</h2>
          <FieldInfo>
            List of available table types that your customers can book
          </FieldInfo>
        </div>
        <Link to={`/venues/${id}/add-table-type`}>
          <Button className={ButtonClassSets.primary} variant="contained">
            Add New Table Type
          </Button>
        </Link>
      </div>

      <TableTypeList
        tableData={venueData?.tableTypes}
        thisVenueId={thisVenueId}
      ></TableTypeList>
    </BodyCard>
  );
};

export default TableTypes;
