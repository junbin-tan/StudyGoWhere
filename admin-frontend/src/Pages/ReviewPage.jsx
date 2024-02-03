import React from "react";
import { useState, useEffect, useReducer } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Api from "../Helpers/Api";
import PageHeaderListing from "../Components/PageHeaderListing";
import Button from "../Components/Button";
import useEncodedToken from "../Helpers/useEncodedToken";
import SearchComponentReview from "../Components/Review/SearchComponentReview";
import ReviewDropDownButton from "../Components/Review/ReviewDropDownButton";
import PageHeaderNonAccount from "../Components/PageHeaderNonAccount";
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { useSnackbar } from "../Helpers/SnackbarContext";
const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const { encodedToken } = useEncodedToken();
  useEffect(() => {
    fetchReviews();
  }, []);
  const handleCategoryChange = (e) => {
      setCategory(e.target.value);
  }
  const changeSearch = (e) => {
      setSearch(e.target.value);
  }
  const {snackbar, snackbarDispatch} = useSnackbar();

  const fetchReviews = () => {
    Api.getAllReviews(encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedReviews = data.map((reviewData) => ({
            id: reviewData.reviewId,
            student : reviewData.student,
            subject: reviewData.subject,
            starRating: reviewData.starRating,
            description: reviewData.description,
            ownerReply: reviewData.ownerReply,
            venue: reviewData.venue,
          }));
          setReviews(processedReviews);
          setFilteredReviews(processedReviews);
        } else {
          console.error("Received data is not an array:", data);
        }
      })
      .catch((error) => {
        snackbarDispatch({type : "ERROR"})
        console.error("Error fetching reviews:", error);
      });
  };
  useEffect(() => {
      if (category) {
        setFilteredReviews(filteredReviews => {
            if (!search.trim()) {
              return reviews;
            } else if (category == "starRating") {
              return reviews.filter(a => String(a[category]).toLowerCase().includes(search.toLowerCase()));
            } 
            return reviews.filter(a => a[category]?.toLowerCase().includes(search.toLowerCase()));
        })
      } else if (search == "") {
        setFilteredReviews(reviews);
      }
  }, [category, search]);
  
    console.log(reviews)

  // make the column for the data
  //flex will grow to 1 fractiion of the size of flex , no flex wont grow
  // render cell will allow customeisaton of cell
  const columns = [
    {
      field: "student",
      headerName: "Student",
      width: 200,
      cellClassName: "name-column-cell",
    },
    {
      field: "venue",
      headerName: "Venue",
      width: 150,
      cellClassName: "name-column-cell",
    },
    {
      field: "subject",
      headerName: "Subject",
      headerAlign: "left",
      align: "left",
      width: 150,
    },
    {
      field: "starRating",
      headerName: "Rating",
      headerAlign: "left",
      align: "left",
      width: 100,
    },
    { field: "description", headerName: "Description", width: 250 },
    { field: "ownerReply", headerName: "Reply", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <ReviewDropDownButton 
                                review={params.row} 
                                refreshData={fetchReviews} 
                                snackbarDispatch={snackbarDispatch}
                                />,
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
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbar?.open}
          onClose={(e) => snackbarDispatch({type : "CLOSE"})}
          message={snackbar?.message}
          key={"top" + "center2"}
        >
          <Alert severity={snackbar?.severity}>{snackbar?.message}</Alert>
        </Snackbar>
      <div>
        <PageHeaderNonAccount title="Reviews">
        </PageHeaderNonAccount>
      </div>
      <div className="px-10">
        <SearchComponentReview
            handleCategoryChange={handleCategoryChange}
            changeSearch={changeSearch}
          />
      </div>
      <div className="py-5 px-10 ">
        <div className="p-5 items-center align-middle justify-center rounded-lg shadow-lg">
          <div className="">
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={filteredReviews}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 15, 20]}
              />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;