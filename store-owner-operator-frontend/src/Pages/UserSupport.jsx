import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { TableHead } from "@mui/material";
import "../index.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ImageIcon from "@mui/icons-material/Image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../firebase";
import Button from "@mui/material/Button";
import ImageDialog from "../Components/UserSupport/ImageDialog";
import { searchTicket, markAsRead } from "../FunctionsAndContexts/UserSupportAPI";
import CreateTicketForm from "../Components/UserSupport/CreateTicketForm";
import useToken from "../FunctionsAndContexts/useToken";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import SideBar from "../Components/SideBar/SideBar";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import SearchComponent from "../Components/UserSupport/SearchComponent";
import { visuallyHidden } from "@mui/utils";
import useEncodedToken from "../FunctionsAndContexts/useEncodedToken";
import FetchOwnerInfoAPI from "../FunctionsAndContexts/FetchOwnerInfoAPI";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePaginationActions from "../Components/UserSupport/TablePaginationActions";
import AdminResponseDialog from "../Components/UserSupport/AdminResponseDialog";
import CustomButton from "../utilities/CustomButton";
import PageStructure from "../Components/PageStructure/PageStructure";
import { Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";
import ChatButton from "../Components/UserSupport/HelperComponents";
import { BiSupport } from "react-icons/bi";

export default function UserSupport() {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const emptyTicket = {
    ticketId: null,
    subject: "",
    description: "",
    ticketStatus: "UNRESOLVED",
    ticketCategory: "",
    images: [],
  };
  const [openResponse, setOpenResponse] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [category, setCategory] = React.useState("subject");
  const [search, setSearch] = useState("");
  const [ticket, setTicket] = useState({ ...emptyTicket });
  const [tickets, setTickets] = useState([]);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [paths, setPaths] = useState([]);
  const [error, setError] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("");
  const [ticketDialog, setTicketDialog] = useState(null);
  const headCells = [
    { label: "Subject", field: "subject", align: "left" },
    { label: "Description", field: "description", align: "left" },
    { label: "Category", field: "ticketCategory", align: "left" },
    { label: "Status", field: "ticketStatus", align: "left" },
    { label: "Created At", field: "createdAt", align: "left" },
  ];

  const { encodedToken } = useEncodedToken();
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);

  useEffect(() => {
    FetchOwnerInfoAPI.getOwner(encodedToken).then((response) => {
      if (response.status == 200) setOwnerData(response.data);
    });
  }, []);
  const searchTickets = () => {
    const searchObj = {
      keyword: search,
      field: category,
      pageNum: page,
      pageSize: rowsPerPage,
      sortField: sortField,
      sortOrder: sortOrder,
    };
    console.log(searchObj);
    searchTicket(searchObj, encodedToken)
      .then((obj) => {
        console.log(obj.first);
        setTickets(obj.first);
        setTotalRowCount(obj.second);
      })
      .catch((error) => {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      });
  };

  const changeSearch = (e) => {
    setSearch(e.target.value);
  };

  const clearForm = () => {
    setTicket({ ...emptyTicket });
  };
  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const handleUploadError = () => {
    setUploadError(true);
    setTimeout(() => {
      setUploadError(false);
    }, 5000);
  };
  const handleCloseAdminResponseDialog = () => {
    setOpenResponse(false);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    searchTickets();
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalRowCount) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onInputChange = (field, e) => {
    setTicket((ticket) => {
      const _ticket = { ...ticket };
      _ticket[field] = e.target.value;
      console.log(_ticket);
      return _ticket;
    });
  };
  const handleViewImage = (p) => {
    setPaths(p);
    handleOpen();
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setPaths([]);
  };
  const onImageChange = (images) => {
    setTicket((ticket) => {
      const _ticket = { ...ticket };
      _ticket["images"] = images;
      return _ticket;
    });
  };
  const handleViewResponse = (t) => {
    markAsRead(t.ticketId, encodedToken)
    .then(res => {
      searchTickets();
    }).catch(error => {
      console.log(error);
    })
    setOpenResponse(true);
    setTicketDialog(t);
  };
  const createSortHandler = (property) => (event) => {
    const isAsc = sortField === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(property);
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      color: theme.palette.common.black,
      fontSize: 16,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
    },
  }));

  const conditionalColor = (category) => {
    if (category == "ACCOUNT") {
      return "bg-purple-500";
    } else if (category == "FINANCE") {
      return "bg-green-500";
    } else if (category == "BOOKING") {
      return "bg-blue-500";
    } else if (category == "VOUCHER") {
      return "bg-yellow-500";
    } else if (category == "OTHERS") {
      return "bg-pink-600";
    }
  };

  useEffect(() => {
    searchTickets();
  }, [category, page, rowsPerPage, sortOrder, sortField]);

  useEffect(() => {
    if (search == "") {
      searchTickets();
    }
  }, [search]);

  // === BreadCrumbs ===
  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb");
  }
  function ActiveLastBreadcrumb() {
    return (
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/venues">
            Home
          </Link>
          <Link
            underline="hover"
            className="text-custom-yellow"
            href="/user-support"
            aria-current="page"
          >
            User Support
          </Link>
        </Breadcrumbs>
      </div>
    );
  }
  // === End of BreadCrumbs ===

  return (
    <PageStructure
      icon={<BiSupport className="text-4xl" />}
      title={"User Support"}
      breadcrumbs={<ActiveLastBreadcrumb />}
    >
      <div className="bg-lightgray-80 w-full overflow-y-visible">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={error}
          onClose={handleClose}
          message="Error"
          key={"top" + "center"}
        >
          <Alert severity="error">Error in Searching</Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={uploadError}
          onClose={handleClose}
          message="Error"
          key={"top" + "center2"}
        >
          <Alert severity="error">Error in Uploading Image(s)</Alert>
        </Snackbar>

        <div className="grid grid-cols-6 lg:grid-cols-12 px-4 items-center">
          <SearchComponent
            searchTickets={searchTickets}
            handleSearch={handleSearch}
            changeSearch={changeSearch}
            category={category}
            handleChange={handleChange}
          />
          <div className="grid col-span-2 justify-items-end">
            <CreateTicketForm
              onInputChange={onInputChange}
              searchTickets={searchTickets}
              ticket={ticket}
              clearForm={clearForm}
              onImageChange={onImageChange}
              handleUploadError={handleUploadError}
            ></CreateTicketForm>
          </div>
        </div>
        <div className="grid grid-cols-12 px-4">
          <div></div>
          <div className="col-span-12">
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 500 }}
                aria-label="custom pagination table"
              >
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => {
                      return (
                        <StyledTableCell
                          key={headCell.field}
                          align={headCell.align}
                          padding={"normal"}
                          sortDirection={
                            sortField === headCell.field ? sortOrder : false
                          }
                          onClick={createSortHandler(headCell.field)}
                        >
                          <TableSortLabel
                            direction={
                              sortField === headCell.field ? sortOrder : "asc"
                            }
                            onClick={createSortHandler(headCell.field)}
                            active={headCell.field === sortField}
                          >
                            {headCell.label}
                            {sortField === headCell.field ? (
                              <Box component="span" sx={visuallyHidden}>
                                {sortOrder === "desc"
                                  ? "sorted descending"
                                  : "sorted ascending"}
                              </Box>
                            ) : null}
                          </TableSortLabel>
                        </StyledTableCell>
                      );
                    })}
                    <StyledTableCell align={"left"}>{"Chat"}</StyledTableCell>
                    <StyledTableCell align={"left"}>{"Images"}</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((row) => (
                    <TableRow key={row.ticketId}>
                      <TableCell style={{ width: 160 }} align="left">
                        {row.subject}
                      </TableCell>
                      <TableCell style={{ width: 300 }} align="left">
                        {row.description}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="left">
                        <span
                          className={
                            "py-2 px-2 text-white rounded " +
                            conditionalColor(row.ticketCategory)
                          }
                        >
                          {row.ticketCategory}
                        </span>
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="left">
                        {row.ticketStatus === "UNRESOLVED" ? (
                          <CloseIcon sx={{ color: "red" }} />
                        ) : (
                          <CheckBoxIcon color="success" />
                        )}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="left">
                        {row.createdAt &&
                          new Date(row.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="left">
                        <ChatButton
                          row={row}
                          handleViewResponse={handleViewResponse}
                        />
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="left">
                        <IconButton
                          onClick={(e) => handleViewImage(row.images)}
                        >
                          <ImageIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={3}
                      count={totalRowCount}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: {
                          "aria-label": "rows per page",
                        },

                        native: true,
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </div>
          <ImageDialog
            paths={paths}
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
          />
          <AdminResponseDialog
            open={openResponse}
            ticketDialog={ticketDialog}
            handleCloseAdminResponseDialog={handleCloseAdminResponseDialog}
          />
        </div>
      </div>
    </PageStructure>
  );
}
