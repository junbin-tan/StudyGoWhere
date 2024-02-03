import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import PageHeaderListing from "../../Components/PageHeaderListing";
import Button from "../../Components/Button";
import useEncodedToken from "../../Helpers/useEncodedToken";
import Api from "../../Helpers/Api";
import OwnerDropDownButton from "../../Components/Owner/OwnerDropDownButton";
import { SnackbarProvider } from "../../Helpers/SnackbarContext";
const OwnerListingPage = () => {
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const { encodedToken } = useEncodedToken();
  useEffect(() => {
    fetchOwners();
  }, []);
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  const changeSearch = (e) => {
    setSearch(e.target.value);
  };

  const fetchOwners = () => {
    Api.getAllOwners(encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedOwners = data.map((ownerData) => ({
            id: ownerData.userId,
            name: ownerData.name,
            username: ownerData.username,
            email: ownerData.email,
            enabled: ownerData.enabled,
          }));
          setOwners(processedOwners);
          setFilteredOwners(processedOwners);
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
      setFilteredOwners((filteredOwners) => {
        if (category == "enabled" || category == "id") {
          return owners.filter((a) =>
            String(a[category]).toLowerCase().includes(search.toLowerCase())
          );
        }
        return owners.filter((a) =>
          a[category].toLowerCase().includes(search.toLowerCase())
        );
      });
    } else if (search == "") {
      setFilteredOwners(owners);
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
      field: "username",
      headerName: "Username",
      headerAlign: "left",
      align: "left",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "left",
      align: "left",
      width: 250,
    },
    { field: "enabled", headerName: "Enabled", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 400,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <OwnerDropDownButton owner={params.row} refreshData={fetchOwners} />,
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



  console.log()



  return (
    <SnackbarProvider>
    <div className="flex flex-col">
      <div>
        <PageHeaderListing title="Owner">

        </PageHeaderListing>
      </div>
      <div className="px-10">
        {/* <SearchComponent 
            handleCategoryChange={handleCategoryChange}
            changeSearch={changeSearch}
          /> */}
      </div>
      <div className="py-5 px-10 ">
        <div className="p-5 items-center align-middle justify-center rounded-lg shadow-lg">
          <div className="">
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={filteredOwners}
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
    </SnackbarProvider>
  );
};

export default OwnerListingPage;
