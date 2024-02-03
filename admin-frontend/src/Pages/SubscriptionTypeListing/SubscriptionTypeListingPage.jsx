import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import PageHeaderListing from "../../Components/PageHeaderListing";
import Button from "../../Components/Button";
import useEncodedToken from "../../Helpers/useEncodedToken";
import Api from "../../Helpers/Api";
import SubscriptionTypeDropdDownButton from "../../Components/SubscriptionType/SubscriptionTypeDropdDownButton";
import SearchComponent from "../../Components/SubscriptionType/SearchComponentSubscriptionType";


const SubscriptionTypeListingPage = () => {
  const [subTypes, setSubTypes] = useState([]);

  const [filteredSubTypes, setFilteredSubTypes] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const { encodedToken } = useEncodedToken();

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  }
  const changeSearch = (e) => {
      setSearch(e.target.value);
  }
  useEffect(() => {
    fetchSubTypes();
  }, []);


  const fetchSubTypes = () => {
    Api.getAllSubscriptionTypes(encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedSubTypes = data.map((subTypeData) => ({
            id: subTypeData.subscriptionTypeId,
            subscriptionTypeName: subTypeData.subscriptionTypeName,
            subscriptionTypePrice: subTypeData.subscriptionTypePrice,
            subscriptionTypeDuration: subTypeData.subscriptionTypeDuration,
            subscriptionTypeDetails: subTypeData.subscriptionTypeDetails,
            subscriptionTypeStatusEnum: subTypeData.subscriptionTypeStatusEnum,
            subscriptionTypeVenueLimit: subTypeData.subscriptionTypeVenueLimit,
          }));
          setSubTypes(processedSubTypes);
          setFilteredSubTypes(processedSubTypes); // Set the filtered list to the full list initially
        } else {
          console.error("Received data is not an array:", data);
        }
      });
  };

 


  useEffect(() => {
    if (category) {
      console.log(category)
      console.log(subTypes)
      console.log(filteredSubTypes)
      setFilteredSubTypes(filteredSubTypes => {
          if (category == "id" || category == "subscriptionTypeName") {
            return subTypes.filter(a => String(a[category]).toLowerCase().includes(search.toLowerCase()));
          } 
          return subTypes.filter(a => a[category].toLowerCase().startsWith(search.toLowerCase()));
      })
    } else if (search == "") {
      setFilteredSubTypes(subTypes);
    }
}, [category, search]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "subscriptionTypeName",
      headerName: "Name",
      width: 140,
      cellClassName: "name-column-cell",
    },
    {
      field: "subscriptionTypePrice",
      type: "number",
      headerName: "Price",
      headerAlign: "center",
      align: "center",
      width: 140,
    },
    {
      field: "subscriptionTypeDuration",
      type: "number",
      headerName: "Duration",
      headerAlign: "center",
      align: "center",
      width: 140,
    },
    {
      field: "subscriptionTypeVenueLimit",
      type: "number",
      headerName: "Venue Limit",
      headerAlign: "center",
      align: "center",
      width: 140,
    },
    {
      field: "subscriptionTypeStatusEnum",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <SubscriptionTypeDropdDownButton subType={params.row} refreshData={fetchSubTypes} />,
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
        <PageHeaderListing title="Subscription Type">
          <Button
            title="Add Subscription Type"
            location="/createSubscriptionType"
          />
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
                rows={filteredSubTypes}
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

export default SubscriptionTypeListingPage;
