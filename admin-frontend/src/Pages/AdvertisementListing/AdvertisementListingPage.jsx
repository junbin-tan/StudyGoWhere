import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import PageHeaderListing from "../../Components/PageHeaderListing";
import Button from "../../Components/Button";
import useEncodedToken from "../../Helpers/useEncodedToken";
import Api from "../../Helpers/Api";
import AdvertisementDropDownButton from "../../Components/Advertisement/AdvertisementDropDownButton";


const AdvertisementListingPage = () => {
  const [pendingAdvertisements, setPendingAdvertisements] = useState([]);

  const [allAdvertisements, setAllAdvertisements] = useState([]);
  //   const [filteredAdvertisements, setFilteredAdvertisements] = useState([]);
  //   const [category, setCategory] = useState("");
  //   const [search, setSearch] = useState("");

  const { encodedToken } = useEncodedToken();

  useEffect(() => {
    fetchPendingAdvertisements();
    fetchAllAdvertisements();
  }, []);

  const fetchPendingAdvertisements = () => {
    Api.getAllPendingAdvertisements(encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedAdvertisement = data.map((adData) => ({
            id: adData.billableId,
            name: adData.name,
            billablePrice: adData.billablePrice,
            image: adData.image,
            description: adData.description,
            startDate: adData.startDate,
            endDate: adData.endDate,
            adCreatorUsername: adData.adCreatorUsername,
            costPerImpression: adData.costPerImpression,
            impressionsLeft: adData.impressionsLeft,
            budgetLeft: adData.budgetLeft,
            impressionCount: adData.impressionCount,
            reachCount: adData.reachCount,
            advertisementStatus: adData.advertisementStatus,
          }));
          setPendingAdvertisements(processedAdvertisement);
          // setFilteredSubTypes(processedSubTypes); // Set the filtered list to the full list initially
        } else {
          console.error("Received data is not an array:", data);
        }
      });
  };

  const fetchAllAdvertisements = () => {
    Api.getAllAdvertisements(encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedAdvertisement = data.map((adData) => ({
            id: adData.billableId,
            name: adData.name,
            billablePrice: adData.billablePrice,
            image: adData.image,
            description: adData.description,
            startDate: adData.startDate,
            endDate: adData.endDate,
            adCreatorUsername: adData.adCreatorUsername,
            costPerImpression: adData.costPerImpression,
            impressionsLeft: adData.impressionsLeft,
            budgetLeft: adData.budgetLeft,
            impressionCount: adData.impressionCount,
            reachCount: adData.reachCount,
            advertisementStatus: adData.advertisementStatus,
          }));
          setAllAdvertisements(processedAdvertisement);
          // setFilteredSubTypes(processedSubTypes); // Set the filtered list to the full list initially
        } else {
          console.error("Received data is not an array:", data);
        }
      });
  };



  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 140 },
    // { field: "billablePrice", headerName: "Price", type: "number", width: 140, align: "center" },
    // { field: "image", headerName: "Image", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "startDate", headerName: "Start Date", width: 140 },
    { field: "endDate", headerName: "End Date", width: 140 },
    // { field: "adCreatorUsername", headerName: "Creator", width: 140 },
    // { field: "costPerImpression", headerName: "Cost/Impression", type: "number", width: 150, align: "center" },
    // { field: "impressionsLeft", headerName: "Impressions Left", type: "number", width: 160, align: "center" },
    { field: "budgetLeft", headerName: "Budget Left", width: 150 },
    // { field: "impressionCount", headerName: "Impression Count", type: "number", width: 160, align: "center" },
    // { field: "reachCount", headerName: "Reach Count", type: "number", width: 140, align: "center" },
    { field: "advertisementStatus", headerName: "Status", width: 140 }, 
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <AdvertisementDropDownButton advert={params.row} refreshData={fetchPendingAdvertisements} />,
    },
  ];

  console.log(allAdvertisements);

  return (
    <div className="flex flex-col">
      <div>
        <PageHeaderListing title="Advertisements">
          {/* <Button
            title="Add Subscription Type"
            location="/createSubscriptionType"
          /> */}
        </PageHeaderListing>
      </div>
      {/* <div className="px-10">
        <SearchComponent 
            handleCategoryChange={handleCategoryChange}
            changeSearch={changeSearch}
          />
      </div> */}
      <div className="py-5 px-10 ">
        <div className="p-5 items-center align-middle justify-center rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Pending Advertisements</h2>
          <div className="">
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={pendingAdvertisements}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </div>
        </div>
      </div>
      <div className="py-5 px-10 ">
        <div className="p-5 items-center align-middle justify-center rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">All Advertisements</h2>
          <div className="">
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={allAdvertisements}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[5, 10]}
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

export default AdvertisementListingPage;
