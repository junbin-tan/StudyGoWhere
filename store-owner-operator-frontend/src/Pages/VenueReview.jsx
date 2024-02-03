import React, {useState, useEffect, useContext, useReducer} from "react";
import ReviewCard from "../Components/VenueReview/ReviewCard";
import Pagination from '@mui/material/Pagination';
import "../index.css";  
import SideBar from "../Components/SideBar/SideBar";
import { ReviewAPI } from "../FunctionsAndContexts/ReviewAPI";
import useEncodedToken from "../FunctionsAndContexts/useEncodedToken";
import SearchComponent from "../Components/VenueReview/VenueSearch";
import Search from "@mui/icons-material/Search";
import Snackbar  from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import EditReview from "../Components/VenueReview/EditReview";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";
import PageStructure from "../Components/PageStructure/PageStructure";
import { reviewReducer } from "../Components/VenueReview/ReviewReducers";
import RatingStats from "../Components/VenueReview/RatingStats";
import {OwnerVenuesContext} from "../FunctionsAndContexts/OwnerVenuesContext";
import {OperatorUserContext} from "../FunctionsAndContexts/OperatorUserContext";
  const errorSearchSnackbar = {
    message : "Error in searching",
    severity : "error",
    open : true
  }
  const errorReplySnackbar = {
    message : "Error in replying to review",
    severity : "error",
    open : true
  }
  const successSnackbar = {
    message : "Review Created/Updated",
    severity : "success",
    open : true
  }
  export default function VenueReview() {
    const initialSearchObj = {page:1, 
                              keyword :"",
                              category : "subject"};
   const sampleReview = [{ starRating: 3, subject: "TEST", description: "DESCRIBE", ownerReply: "", student: "STUDENT USERNAME" }];
    const { id } = useParams();
    //const [reviews, setReviews] = useState([]);
    const [reviews, reviewDispatch] = useReducer(reviewReducer, []);
    const { encodedToken } = useEncodedToken();
    const [count, setCount] = useState(1);
    const [snackbar, setSnackbar] = useState({});
    const [searchObj, setSearchObj] = useState({...initialSearchObj});

      const { ownerData, setOwnerData } = useContext(OwnerVenuesContext) || {};
      const { operatorData, setOperatorData } = useContext(OperatorUserContext) || {};

    const handleSearchChange = (field) => (event, value) => {
      console.log(value)
      setSearchObj(prev => ({...prev, [field] : value}));
    }
    const handleTextSearchChange = (field) => (event) => {
      setSearchObj(prev => ({...prev, [field] : event.target.value}));
    }
    const handleClose = (e) => {
      setSnackbar(snackbar => ({...snackbar, open : false}));
    }
    const searchReviews = () => {
      setSearchObj(prev => ({...prev}))
    }
    const saveReviewReply = (reviewId, reply) => {
        ReviewAPI.reply({reply : reply, reviewId : reviewId}, encodedToken)
        .then(res => {
          console.log(id)
          reviewDispatch({type : "REPLY", id : reviewId, ownerReply : reply})
          setSnackbar(successSnackbar);
        })
        .catch(error => {
          console.log(error)
          setSnackbar(errorReplySnackbar);
        })
    }

    useEffect(() => {
      let ignore = false;
      console.log(searchObj)

        const currVenueId = operatorData?.venue.venueId ?? id;
      console.log("currvenueid", currVenueId)

      ReviewAPI.getReviews({...searchObj, venueId : currVenueId}, encodedToken)
      .then(resObj => {
        if (!ignore) {
          reviewDispatch({type : "SET", reviews : resObj.first});
          setCount(Math.ceil(resObj.second/5));
        }
      })
      .catch(error => {
        setSnackbar(errorSearchSnackbar);
        console.log("error in fetching reviews: ", error)
      })
      return () => {
        ignore = true;
      }
    }, [searchObj])


    function ActiveLastBreadcrumb() {
      return (
        <div role="presentation" onClick={(e) => e.preventDefault()}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" className="text-lightgray-100" to={`/venues/${id}`}>
              Home
            </Link>
            <Link
              underline="hover"
              className="text-brown-90"
              href={`/venues/${id}/reviews`}
              aria-current="page"
            >
              Reviews
            </Link>
          </Breadcrumbs>
        </div>
      );
    }
    return (
            <>
    <PageStructure
      title={"Reviews"}
      breadcrumbs={<ActiveLastBreadcrumb />}
    >
                  <div className="main-content flex flex-col">
                     <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleClose} 
                                  anchorOrigin={{ vertical : "top", horizontal : "center" }}>
                      <Alert onClose={handleClose} 
                        severity={snackbar.severity} 
                        sx={{ width: '100%' }}>
                        {snackbar.message}
                      </Alert>
                    </Snackbar>
                    <SearchComponent  searchObj={searchObj}
                                      searchReviews={searchReviews} 
                                      handleTextSearchChange={handleTextSearchChange}>      
                    </SearchComponent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mx-5">
                          <div className="col-span-2">
                          {reviews.map(r => {
                            return (<React.Fragment key={r.reviewId}>
                                      <ReviewCard review={r}
                                                  reviewDispatch={reviewDispatch}
                                                  searchReviews={searchReviews}
                                                  saveReviewReply={saveReviewReply}/>
                                  </React.Fragment>)
                          })}
                          <div className="flex justify-center">
                            <Pagination count={count} page={searchObj.page} onChange={handleSearchChange("page")} />
                          </div>
                        </div>
                        <RatingStats></RatingStats>
                      </div>
                  </div>
                  </PageStructure>
            </>
            )
  }
