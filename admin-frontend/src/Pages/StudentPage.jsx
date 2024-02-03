import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Api from "../Helpers/Api";
import PageHeaderListing from "../Components/PageHeaderListing";
import Button from "../Components/Button";
import useEncodedToken from "../Helpers/useEncodedToken";
import SearchComponentStudent from "../Components/Student/SearchComponentStudent";
import StudentDropDownButton from "../Components/Student/AdminDropDownButton";
import { SnackbarProvider } from "../Helpers/SnackbarContext";
const StudentListing = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const { encodedToken } = useEncodedToken();
  useEffect(() => {
    fetchStudents();
  }, []);
  const handleCategoryChange = (e) => {
      setCategory(e.target.value);
  }
  const changeSearch = (e) => {
      setSearch(e.target.value);
  }

  const fetchStudents = () => {
    Api.getAllStudents(encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedStudents = data.map((studentData) => ({
            id: studentData.userId,
            name: studentData.name,
            username: studentData.username,
            email: studentData.email,
            enabled: studentData.enabled,
          }));
          setStudents(processedStudents);
          setFilteredStudents(processedStudents);
        } else {
          console.error("Received data is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };
  useEffect(() => {
      if (category) {
        setFilteredStudents(filteredStudents => {
            if (category == "enabled" || category == "id") {
              return students.filter(a => String(a[category]).toLowerCase().includes(search.toLowerCase()));
            } 
            return students.filter(a => a[category].toLowerCase().includes(search.toLowerCase()));
        })
      } else if (search == "") {
        setFilteredStudents(students);
      }
  }, [category, search]);
  
    console.log(students)

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
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <StudentDropDownButton student={params.row} refreshData={fetchStudents} />,
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
    <SnackbarProvider>
    <div className="flex flex-col">
      <div>
        <PageHeaderListing title="Student">
        </PageHeaderListing>
      </div>
      <div className="px-10">
        <SearchComponentStudent
            handleCategoryChange={handleCategoryChange}
            changeSearch={changeSearch}
          />
      </div>
      <div className="py-5 px-10 ">
        <div className="p-5 items-center align-middle justify-center rounded-lg shadow-lg">
          <div className="">
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={filteredStudents}
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

export default StudentListing;