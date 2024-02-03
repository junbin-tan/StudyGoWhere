import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Api from "../../Helpers/Api";
import PageHeaderNonAccount from "../../Components/PageHeaderNonAccount";
import Button from "../../Components/Button";
import useEncodedToken from "../../Helpers/useEncodedToken";
import VenueDropDownButton from "../../Components/Venue/VenueDropDownButton";
import SearchComponent from "../../Components/Venue/SearchComponentVenue";

const VenueListingPage = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");


  const { encodedToken } = useEncodedToken();
  useEffect(() => {
    fetchVenues();
  }, []);
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  const changeSearch = (e) => {
    setSearch(e.target.value);
  };



  const fetchVenues = () => {
    Api.getAllVenues(encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedVenues = data.map((venueData) => ({
            id: venueData.venueId,
            name: venueData.venueName,
            description: venueData.description,
            phoneNumber: venueData.phoneNumber,
            venueCrowdLevel: venueData.venueCrowdLevel,
            venueStatus: venueData.venueStatus,
            owner: venueData.ownerUsername,
            adminBanned: venueData.adminBanned,

          }));
          setVenues(processedVenues);
          setFilteredVenues(processedVenues);
        } else {
          console.error("Received data is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching venue:", error);
      });
  };

  useEffect(() => {
    if (category) {
      setFilteredVenues(filteredVenues => {
          if (category == "id" || category == "name") {
            return venues.filter(a => String(a[category]).toLowerCase().includes(search.toLowerCase()));
          } 
          return venues.filter(a => a[category].toLowerCase().startsWith(search.toLowerCase()));
      })
    } else if (search == "") {
      setFilteredVenues(venues);
    }
}, [category, search]);



  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      cellClassName: "name-column-cell",
    },
    {
      field: "owner",
      headerName: "Owner",
      headerAlign: "left",
      align: "left",
      width: 150,
    },
    {
      field: "venueCrowdLevel",
      headerName: "Crowd Level",
      headerAlign: "left",
      align: "left",
      width: 150,
    },
    { field: "venueStatus", headerName: "Venue Status", width: 150 },
    { field: "adminBanned", headerName: "Admin Banned", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <VenueDropDownButton venue={params.row} refreshData={fetchVenues} />,
    },
  ];

  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  return (
    <div className="flex flex-col">
      <div>
        <PageHeaderNonAccount title="Venues">
          {/* <Button title="Add Admin" location="/createAdmin" /> */}
        </PageHeaderNonAccount>
      </div>
      <div className="px-10">
        <SearchComponent 
            handleCategoryChange={handleCategoryChange}
            changeSearch={changeSearch}
          />
      </div>
      <div className="py-5 px-10 ">
        <div className="p-5 items-center align-middle justify-center rounded-lg shadow-lg">
          <div className="">
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={filteredVenues}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 15, 20]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueListingPage;
