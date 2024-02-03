import React, { useEffect, useState, useContext } from "react";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import StripedDataGrid from "../../utilities/StripedDataGrid";
import { Button } from "@mui/material";
import ButtonClassSets from "../../utilities/ButtonClassSets";
import Api from "../../FunctionsAndContexts/FetchOwnerInfoAPI";
import { useNavigate } from "react-router-dom";
import {VenueContext} from "../Venues/VenueBookingSchedule/DaySchedules/helpers/VenueContext";
import SnackbarContext from "../../FunctionsAndContexts/SnackbarContext";

// TODO: add handle delete here
// TODO: fetch data from backend
const dummyData = [
  {
    id: 1,
    name: "1 seater",
    description: "1 seater table",
    basePrice: 10,
    pricePerHalfHour: 5,
    seats: 1,
  },
  {
    id: 2,
    name: "2 seater",
    description: "2 seater table",
    basePrice: 20,
    pricePerHalfHour: 10,
    seats: 2,
  },
  {
    id: 3,
    name: "3 seater",
    description: "3 seater table",
    basePrice: 30,
    pricePerHalfHour: 15,
    seats: 3,
  },
];

const TableTypeList = ({ tableData, thisVenueId }) => {
  const [tableTypes, setTableTypes] = useState([]);
  const tableTypesFromVenueData = tableData;
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const navigate = useNavigate();
  const {thisVenue, setThisVenue} = useContext(VenueContext);

  const {setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity} = useContext(SnackbarContext);

  const handleDelete = (id) => {
    Api.deleteTableType(id, encodedToken)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          console.log("Table type deleted successfully");
          // Update state to trigger re-render
          setTableTypes((prevTableTypes) =>
            prevTableTypes.filter((tableType) => tableType.id !== id)
          );
          setThisVenue((prevVenue) => {
            return {
              ...prevVenue,
              tableTypes: prevVenue.tableTypes.filter(
                (tableType) => tableType.id !== id
              ),
            };
          });

            setOpenSnackbar(true);
            setSnackbarMessage("Table type deleted successfully");
            setSnackbarSeverity("success");
        } else {
          console.error("Error:", response.status, response.statusText);
        }
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        setOpenSnackbar(true);
        setSnackbarMessage(error.response.data);
        setSnackbarSeverity("error");
      });
  };

  const actionButtons = (params) => {
    return (
      <div className="flex flex-row gap-2">
        <Button
          className={ButtonClassSets.tableDelete}
          onClick={() => handleDelete(params.id)}
        >
          Delete
        </Button>
        <Button
          className={ButtonClassSets.tableEdit}
          onClick={() => navigate(`edit-table-type/${params.id}`)}
        >
          Edit
        </Button>
      </div>
    );
  };
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      headerClassName: "regular-bold ",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      headerAlign: "center",
      align: "center",
      flex: 0.8,
      headerClassName: "regular-bold ",
    },
    {
      field: "description",
      headerName: "Description",
      headerAlign: "center",
      align: "center",
      flex: 1,
      headerClassName: "regular-bold ",
    },
    {
      field: "basePrice",
      headerName: "Base Price",
      headerAlign: "center",
      align: "center",
      width: 200,
      headerClassName: "regular-bold ",
      renderCell: (params) => {
        return <p>${params.value / 100}</p>;
      },
    },
    {
      field: "pricePerHalfHour",
      headerName: "Price Per Half Hour",
      headerAlign: "center",
      align: "center",
      width: 200,
      headerClassName: "regular-bold ",
      renderCell: (params) => {
        return <p>${params.value / 100}</p>;
      },
    },
    {
      field: "seats",
      headerName: "Seats",
      headerAlign: "center",
      align: "center",
      width: 120,
      headerClassName: "regular-bold ",
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      flex: 1,
      headerClassName: "regular-bold ",
      renderCell: actionButtons,
    },
  ];

  // TODO: set table types here
  useEffect(() => {
    if (tableTypesFromVenueData && Array.isArray(tableTypesFromVenueData)) {
      const nonDeletedTableTypes = tableTypesFromVenueData.filter(
        (tableType) => !tableType.deleted
      );
      setTableTypes(nonDeletedTableTypes);
    }
  }, [tableTypesFromVenueData]);

  return (
    <StripedDataGrid
      rows={tableTypes} // later change with tableTypes
      columns={columns}
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "30px",
        border: "1px solid #E0E0E0",
      }}
      pageSizeOptions={[5, 10, 15, 20]}
      checkboxSelection={false}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      disableRowSelectionOnClick
    />
  );
};

export default TableTypeList;
