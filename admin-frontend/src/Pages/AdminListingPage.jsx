import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Api from "../Helpers/Api";
import PageHeaderListing from "../Components/PageHeaderListing";
import Button from "../Components/Button";
import AdminDropDownButton from "../Components/Admin/AdminDropDownButton";
import useEncodedToken from "../Helpers/useEncodedToken";
import SearchComponent from "../Components/Admin/SearchComponentAdmin";
const AdminListing = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const { encodedToken } = useEncodedToken();
  useEffect(() => {
    fetchAdmins();
  }, []);
  const handleCategoryChange = (e) => {
      setCategory(e.target.value);
  }
  const changeSearch = (e) => {
      setSearch(e.target.value);
  }

  const fetchAdmins = () => {
    Api.getAllAdmins(encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedAdmins = data.map((adminData) => ({
            id: adminData.userId,
            name: adminData.name,
            username: adminData.username,
            email: adminData.email,
            enabled: adminData.enabled,
          }));
          setAdmins(processedAdmins);
          setFilteredAdmins(processedAdmins);
        } else {
          console.error("Received data is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching admins:", error);
      });
  };
  useEffect(() => {
      if (category) {
        setFilteredAdmins(filteredAdmins => {
            if (category == "enabled" || category == "id") {
              return admins.filter(a => String(a[category]).toLowerCase().includes(search.toLowerCase()));
            } 
            return admins.filter(a => a[category].toLowerCase().includes(search.toLowerCase()));
        })
      } else if (search == "") {
        setFilteredAdmins(admins);
      }
  }, [category, search]);
  
    console.log(admins)

  // make the column for the data
  //flex will grow to 1 fractiion of the size of flex , no flex wont grow
  // render cell will allow customeisaton of cell
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
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <AdminDropDownButton admin={params.row} refreshData={fetchAdmins} />,
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
        <PageHeaderListing title="Admin">
          <Button title="Add Admin" location="/createAdmin" />
        </PageHeaderListing>
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
                rows={filteredAdmins}
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

export default AdminListing;
