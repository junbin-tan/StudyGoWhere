import { Link, useParams } from "react-router-dom";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";
import PageStructure from "../Components/PageStructure/PageStructure";
import BodyCard from "../Components/CommonComponents/Card/BodyCard";
import ContentCard from "../Components/CommonComponents/Card/ContentCard";
import VenueStatuses from "../Components/Venues/VenueDashboard/VenueStatuses";
import DashboardImageCarousel from "../Components/Venues/VenueDashboard/DashboardImageCarousel";
import { OperatorUserContext } from "../FunctionsAndContexts/OperatorUserContext";
import { FetchAndReturnUser } from "../FunctionsAndContexts/FetchAndReturnUser";
import { Breadcrumbs, Button } from "@mui/material";
import FetchOwnerInfoAPI from "../FunctionsAndContexts/FetchOwnerInfoAPI";
import { getDownloadURL, ref } from "firebase/storage";
import storage from "../firebase";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PrevNextVenueBar from "../Components/Venues/PrevNextVenueBar/PrevNextVenueBar";
import ButtonClassSets from "../utilities/ButtonClassSets";
import FieldInfo from "../Components/CommonComponents/Form/FieldInfo";
import RatingStats from "../Components/VenueReview/RatingStats";
import TextClassSets from "../utilities/TextClassSets";
import AddMenuToVenue from "../Components/Menu/AddMenuToVenue";
import StripedDataGrid from "../utilities/StripedDataGrid";

export default function VenueDashboard() {
  const { id } = useParams();
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  // the || {} is to prevent the useContext from returning undefined; similar to using &&
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext) || {};
  const { operatorData, setOperatorData } =
    useContext(OperatorUserContext) || {};

  const [thisVenue, setThisVenue] = useState(null);
  const [thisVenueImageItems, setThisVenueImageItems] = useState([]);
  // ^^ this is to prevent the page from loading before the venue data is fetched
  const [thisVenueBookingsInfo, setThisVenueBookingsInfo] = useState([]);

  const linkToBookingSchedule = useMemo(() => {
    if (ownerData) {
      return `/venues/${id}/booking-schedule`;
    } else {
      return `/venue/booking-schedule`;
    }
  }, [ownerData]);

  const linkToReviews = useMemo(() => {
    if (ownerData) {
      return `/venues/${id}/reviews`;
    } else {
      return `/venue/reviews`;
    }
  }, [ownerData]);

  const generateNiceBookings = () => {
    // generate booking only for today

    const bookingsInfo = [];
    thisVenue.venueSchedule.daySchedules.forEach((daySchedule) => {
      daySchedule.tableTypeDayAvailabilities.forEach((ttda) => {
        ttda.bookings.forEach((booking) => {
          if (
            booking.fromDateTime.split("T")[0] !=
            new Date().toISOString().split("T")[0]
          )
            return;
          bookingsInfo.push({
            billableId: booking.billableId,
            bookStatus: booking.bookStatus,
            fromTime: booking.fromDateTime.split("T")[1],
            toTime: booking.toDateTime.split("T")[1],
            studentName: booking.studentName,
            tableTypeName: ttda.tableType.name,
            seats: ttda.tableType.seats,
            tableTypeId: ttda.tableType.tableTypeId,
            date: daySchedule.date,
            dayScheduleId: daySchedule.dayScheduleId,
            tableTypeDayAvailabilityId: ttda.id,
          });
        });
      });
    });
    return bookingsInfo;
  };

  const BookingsInfoTable = ({ bookingsInfo }) => {
    return (
      <div className={"flex flex-col"}>
        <BookingInfo bookingInfo={bookingsInfo} />
        {/* <BookingInfoHeader />
        {bookingsInfo.map((bi) => (
          <BookingInfo bookingInfo={bi} />
        ))} */}
      </div>
    );
  };

  const columns = [
    {
      field: "billableId",
      headerName: "ID",
      width: 100,
      headerClassName: "regular-bold ",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date",
      headerName: "Date",
      width: 200,
      headerClassName: "regular-bold ",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fromTime",
      headerName: "From",
      flex: 0.5,
      headerClassName: "regular-bold ",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "toTime",
      headerName: "To",
      flex: 0.5,
      headerClassName: "regular-bold ",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "studentName",
      headerName: "Name",
      flex: 0.5,
      headerClassName: "regular-bold ",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tableTypeName",
      headerName: "table type",
      flex: 0.5,
      headerClassName: "regular-bold ",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "seats",
      headerName: "Seats",
      // width: 200,
      headerClassName: "regular-bold ",
      headerAlign: "center",
      align: "center",
    },
  ];
  const BookingInfoHeader = () => {
    return (
      <div className={"flex flex-row gap-x-2"}>
        <p className={"flex-1"}>ID</p>
        <p className={"flex-1"}>Date</p>
        <p className={"flex-1"}>From Time</p>
        <p className={"flex-1"}>To Time</p>
        <p className={"flex-1"}>Student Name</p>
        <p className={"flex-1"}>Table Type Name</p>
        <p className={"flex-1"}>Seats</p>
      </div>
    );
  };
  const BookingInfo = ({ bookingInfo }) => {
    return (
      <>
        <StripedDataGrid
          rows={bookingInfo} // later change with tableTypes
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
          getRowId={(row) => row.billableId} // Specify a custom id based on your data
        />
      </>
      // <div className={"flex flex-row gap-x-2"}>
      //   <p className={"flex-1"}>{bookingInfo.billableId}</p>
      //   <p className={"flex-1"}>{bookingInfo.date}</p>
      //   <p className={"flex-1"}>{bookingInfo.fromTime}</p>
      //   <p className={"flex-1"}>{bookingInfo.toTime}</p>
      //   <p className={"flex-1"}>{bookingInfo.studentName}</p>
      //   <p className={"flex-1"}>{bookingInfo.tableTypeName}</p>
      //   <p className={"flex-1"}>{bookingInfo.seats}</p>
      // </div>
    );
  };
  // UseEffect to fetch ownerData or operatorData on page load and id change
  useEffect(() => {
    if (token.role == "Owner") {
      try {
        FetchAndReturnUser.owner(encodedToken).then((ownerData) =>
          setOwnerData(ownerData)
        );
      } catch (err) {
        console.log(err.message); // request failed somehow
      }
    } else if (token.role == "Operator") {
      try {
        FetchAndReturnUser.operator(encodedToken).then((fetchedOperator) => {
          setOperatorData(fetchedOperator);
          console.log(
            "operatorData is (called from same fn as setOperator): ",
            fetchedOperator
          );
        });
      } catch (err) {
        console.log(err.message); // request failed somehow
      }
    }
  }, [id]);

  // UseEffects to set thisVenue from ownerData/operatorData that was fetched
  useEffect(() => {
    if (ownerData && !(ownerData instanceof Promise)) {
      // flow of ownerData value is (null -> Promise -> {...ownerdata})
      // when Promise resolves, the ownerData value changes and this useEffect is triggered again
      // console.log("HELLOO ownerdata is: ", ownerData)
      // console.log(ownerData.venues)

      const extractedVenue = ownerData.venues.find((v) => v.venueId == id);
      setThisVenue(extractedVenue);
    }
  }, [ownerData]);
  useEffect(() => {
    console.log("operatorData logging", operatorData);
    if (operatorData && !(operatorData instanceof Promise)) {
      // if (operatorData.venue.venueId == id) setThisVenue(operatorData.venue); // operator only has 1 venue
      console.log("setting this venue", operatorData.venue);
      setThisVenue(operatorData.venue);
    }
  }, [operatorData]);

  // SETTING IMAGE PATHS ONCE VENUE IS FETCHED
  // ALSO SETS thisVenueBookings.
  useEffect(() => {
    console.log("thisVenue", thisVenue);
    if (thisVenue && thisVenue.images.length > 0) {
      const urlAndPathsPromises = thisVenue.images.map((relativePath) =>
        getDownloadURL(ref(storage, relativePath))
          .then((url) => ({ imageURL: url, path: relativePath }))
          .catch((err) => {
            console.log(err.message);
            return null;
          })
      );

      // this code below will ignore all invalid urls and output the valid ones
      // may be good or bad, because it hinders debugging of invalid urls
      // but it ensures that the app doesnt break upon encountering invalid urls
      Promise.all(urlAndPathsPromises)
        .then((entireFulfilledPromiseArray) => {
          const validItems = entireFulfilledPromiseArray.filter(
            (item) => item != null
          );
          setThisVenueImageItems(validItems);
          return validItems;
        })
        .then((validItems) => console.log("logging validItems", validItems))
        .catch((err) => console.log("error message", err.message));
    } else {
      setThisVenueImageItems([]);
      // need to do this to make sure the Carousel component updates
      // naively i moved the logic for fetching URLs outside the carousel, so we have to do this
    }

    // === SETTING THIS VENUE BOOKINGS ===
    if (thisVenue) {
      console.log("NICE BOOKING GENERATING", generateNiceBookings());
      setThisVenueBookingsInfo(generateNiceBookings());
    }
  }, [thisVenue]);

  // !== HANDLE ON SET DISPLAY IMAGE CODE FOR CAROUSEL ===
  // formData and thisVenue is equivalent in this case, formData is used in the editing pages to make it clearer

  const [changeDisplayImageSuccess, setChangeDisplayImageSuccess] =
    useState(false);
  const [changeDisplayImageError, setChangeDisplayImageError] = useState(false);
  const handleOnSetDisplayImage = async (path) => {
    const modifiedVenue = {
      ...thisVenue,
      displayImagePath: path,
      operator: { ...thisVenue.operator, password: "" },
    };
    setThisVenue(modifiedVenue);
    console.log("modifiedVenue is: ", modifiedVenue);

    // trying using individual endpoint; just testing for now
    const newDisplayImagePath = path;
    FetchOwnerInfoAPI.updateVenueDisplayImagePath(
      encodedToken,
      id,
      newDisplayImagePath
    )
      .then((response) => setChangeDisplayImageSuccess(true))
      .catch((error) => setChangeDisplayImageError(error.message));

    // FetchOwnerInfoAPI.updateVenue(encodedToken, modifiedVenue)
    //     .then((response) => setChangeDisplayImageSuccess(true))
    //     .catch((error) => setChangeDisplayImageError(error.message));
  };
  // !== END OF HANDLE ON SET DISPLAY IMAGE CODE FOR CAROUSEL ===

  // !== BREADCRUMBS CODE ===
  // if ownerData is undefined (means its operator) then we don't render the breadcrumbs
  function ActiveLastBreadcrumb({ name }) {
    return (
      <div role="presentation">
        {ownerData ? (
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" className="text-lightgray-100" to="/venues">
              Home
            </Link>
            <Link underline="hover" className="text-lightgray-100" to="/venues">
              Venues
            </Link>
            <Link
              underline="hover"
              className="text-custom-yellow"
              to={`/venues/${id}`}
              aria-current="page"
            >
              {name}
            </Link>
          </Breadcrumbs>
        ) : (
          <> </>
        )}
      </div>
    );
  }
  // !== END OF BREADCRUMBS CODE ===

  return (
      <PageStructure
          title={`${thisVenue?.venueName}'s Dashboard`}
          breadcrumbs={ActiveLastBreadcrumb({ name: thisVenue?.venueName })}
          actionButton={
              ownerData && (
                  <Link to={`/venues/${id}/details`}>
                      <Button
                          variant="contained"
                          className={ButtonClassSets.primary}
                      >
                          Edit venue
                      </Button>
                  </Link>
              )
          }
      >
          {ownerData && (
              <PrevNextVenueBar
                  ownerVenuesList={ownerData.venues}
                  thisVenueId={id}
              />
          )}

          {thisVenue && (
              <BodyCard className={"grid grid-cols-12 gap-2"}>
                  <ContentCard id="bookingsCard" className={"col-span-8"}>
                      <h2 className="text-xl font-bold pb-3">Bookings</h2>
                      {thisVenueBookingsInfo.length > 0 ? (
                          <BookingsInfoTable
                              bookingsInfo={thisVenueBookingsInfo}
                          />
                      ) : (
                          <FieldInfo className={"text-center"}>
                              No bookings yet
                          </FieldInfo>
                      )}

                      <div className="flex flex-row justify-center mt-2">
                          <Link to={linkToBookingSchedule}>
                              <button className={ButtonClassSets.primary}>
                                  View Booking Day Schedules
                              </button>
                          </Link>
                      </div>
                  </ContentCard>
                  <ContentCard id="venueStatusCard" className={"col-span-4"}>
                      <h2 className="text-xl font-bold pb-3">
                          Status and Crowd Level
                      </h2>
                      {thisVenue.adminBanned ? (
                          <p className="text-red-500 text-sm mb-5">
                              This venue is disabled by Admin. 🚫 Please contact
                              our user support team for assistance. 🤝
                          </p>
                      ) : (
                          <p> </p>
                      )}
                      {thisVenue && (
                          <VenueStatuses
                              venue={thisVenue}
                              isOperator={token.role == "Operator"}
                          />
                      )}
                  </ContentCard>
                  <ContentCard id="qrCode" className={"col-span-6"}>
                      {/* using pb-3 and pt-3 this liberally is bad practice... we can refactor later*/}
                      <h2 className="text-xl font-bold pb-3">Venue QR Code</h2>
                      <img
                          src={
                              "http://localhost:5001/public/generateqrcode/venue/" +
                              thisVenue.venueId
                          }
                          className={"mx-auto"}
                          alt="Venue QR Code"
                      />
                      <FieldInfo className={"pt-3"}>
                          Print this out for users to scan with their
                          StudyGoWhere app!
                      </FieldInfo>
                      <br />
                      <FieldInfo>
                          Scanning this QR code will directly bring them to your
                          venue page in the app.
                      </FieldInfo>
                  </ContentCard>
                  <ContentCard id="venueImages" className={"col-span-6"}>
                      <h2 className="text-xl font-bold pb-3">Venue Images</h2>
                      {/* VERY HACKY WAY TO FIX A BUG.*/}
                      {/* The DashboardImageCarousel somehow can't detect changes in thisVenue nor thisVenue.images, and so
                it doesn't rerender upon page change*/}
                      {/* however this div that is immediately below can; and will rerender accordingly*/}

                      {/*{console.log("logging thisVenue.images before dashboard carousel", thisVenue.images)}*/}
                      <div key={thisVenueImageItems}>
                          {thisVenueImageItems.length > 0 ? (
                              <DashboardImageCarousel
                                  venueImageItems={thisVenueImageItems}
                                  onSetDisplayImage={
                                      ownerData
                                          ? handleOnSetDisplayImage
                                          : false
                                  }
                              />
                          ) : (
                              <p className={"text-center"}>
                                  No images uploaded yet
                              </p>
                          )}
                      </div>
                      {/*    need to do the above null check because my dummy operator is not set up properly xD*/}
                  </ContentCard>
                  <ContentCard id="venueReviews" className={"col-span-6"}>
                      <h2 className={`${TextClassSets.h2} pb-3`}>
                          Venue Reviews
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-6 justify-items-center">
                          <div className="lg:col-span-1"></div>
                          <div className="col-span-1 lg:col-span-4 w-full">
                              <RatingStats />
                          </div>
                          <div className="lg:col-span-1"></div>
                          <div className="col-span-1 lg:col-span-6 m-8">
                              <Link to={`${linkToReviews}`}>
                                  <button className={ButtonClassSets.primary}>
                                      View All Reviews
                                  </button>
                              </Link>
                          </div>
                      </div>
                  </ContentCard>
                  <ContentCard id="venueMenu" className={"col-span-6 h-2/3"}>
                      <div className="flex flex-row justify-between">
                          <h2 className={`${TextClassSets.h2} pb-3`}>
                              Venue Menu
                          </h2>
                          <AddMenuToVenue thisVenue={thisVenue} />
                      </div>

                      <div className="flex w-full flex-col">
                          {thisVenue.menu ? (
                              <div className="mt-4">
                                  <div className="card border border-solid border-gray-300 px-5 py-8 rounded-lg shadow-sm bg-lightgray-80">
                                      <div>
                                          <h2
                                              className={`${TextClassSets.h2} pb-3`}
                                          >
                                              Current Menu
                                          </h2>
                                          <h3 className="text-xl font-semibold text-gray-800 pb-2">
                                              Name: {thisVenue.menu.menuName}
                                          </h3>
                                          <p className="text-gray-600 text-base pb-4">
                                              Description:{" "}
                                              {thisVenue.menu.menuDescription}
                                          </p>
                                      </div>
                                      <div className="flex justify-end mt-4">
                                          <Link
                                              to={`/edit-menu/${thisVenue.menu.menuId}`}
                                          >
                                              <button
                                                  className={`${ButtonClassSets.primary} text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-300 px-4 py-2 rounded shadow`}
                                              >
                                                  Edit Menu
                                              </button>
                                          </Link>
                                      </div>
                                  </div>
                              </div>
                          ) : (
                              /* <p className={"text-center"}>No menus uploaded yet</p> */
                              <div className="mt-4">
                                  <p className={"text-center"}>
                                      This venue does not have a menu
                                  </p>
                              </div>
                          )}
                      </div>
                  </ContentCard>
              </BodyCard>
          )}

          {/*<Button onClick={() => console.log(operatorData)}>*/}
          {/*    console.log operatordata*/}
          {/*</Button>*/}
          {/*<Button onClick={() => console.log(thisVenue)}>*/}
          {/*    console.log thisvenue*/}
          {/*</Button>*/}

          {/*  !== SNACKBARS ===*/}

          <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={changeDisplayImageSuccess}
              onClose={() => setChangeDisplayImageSuccess(false)}
              message="Success"
              autoHideDuration={5000}
              key={"displaySuccessSnackbar"}
          >
              <Alert
                  onClose={() => setChangeDisplayImageSuccess(false)}
                  severity="success"
              >
                  Successfully set image as display image!
              </Alert>
          </Snackbar>

          <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={changeDisplayImageError}
              onClose={() => setChangeDisplayImageError(false)}
              message="Error!"
              autoHideDuration={5000}
              key={"displayErrorSnackbar"}
          >
              <Alert
                  onClose={() => setChangeDisplayImageError(false)}
                  severity="error"
              >
                  Something went wrong ! Please try again. Error message:{" "}
                  {changeDisplayImageError}
              </Alert>
          </Snackbar>

          {/*  !== END OF SNACKBARS ===*/}
      </PageStructure>
  );
}
