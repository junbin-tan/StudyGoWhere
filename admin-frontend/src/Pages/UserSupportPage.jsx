import React, {useState, useEffect, useContext} from "react";
import Box from "@mui/material/Box";
import Api from "../Helpers/Api";
import PageHeaderListing from "../Components/PageHeaderListing";
import Button from "../Components/Button";
import useEncodedToken from "../Helpers/useEncodedToken";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { TableHead } from "@mui/material";
import "../index.css";  
import ImageIcon from '@mui/icons-material/Image';
import ImageDialog from "../Components/UserSupport/ImageDialog";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import SearchComponent from "../Components/UserSupport/SearchComponent";
import { visuallyHidden } from '@mui/utils';
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePaginationActions from "../Components/UserSupport/TablePaginationActions";
import EditTicketButton from "../Components/UserSupport/EditTicketButton";
const UserSupport = () => {
    const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
      const emptyTicket = {
      ticketId : null,
      subject : "",
      description : "",
      ticketCategory : "",
      ticketStatus : "UNRESOLVED",
      images : [],
      generalUser : ""
    }
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [category, setCategory] = React.useState('generalUser');
    const [search, setSearch] = useState('');
    const [ticket, setTicket] = useState({...emptyTicket});
    const [open, setOpen] = useState(false);
    const [paths, setPaths] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [totalRowCount, setTotalRowCount] = useState(0);
    const [error, setError] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('');
    const headCells = [
        { label: "Subject", field: "subject", align: "left" },
        { label: "Description", field: "description", align: "left" },
        { label: "Category", field: "ticketCategory", align: "left" },
        { label: "Status", field: "ticketStatus", align: "left" },
        { label: "Created At", field: "createdAt", align: "left" },
      ];
      
    const { encodedToken } = useEncodedToken();


    const searchTickets = () => {
      const searchObj = { keyword : search, 
                          field : category,
                          pageNum : page,
                          pageSize : rowsPerPage,
                          sortField : sortField,
                          sortOrder : sortOrder
                         };
                      console.log(searchObj)
      Api.searchTicket(searchObj, encodedToken)
          .then(obj => {
              setTickets(obj.first);
              setTotalRowCount(obj.second);
          }).catch(error => {
            setError(true)
            setTimeout(() => {
              setError(false);
            }, 5000)
          });
  }

  const changeSearch = (e) => {
     setSearch(e.target.value);
  }

  const clearForm = () => {
    setTicket({...emptyTicket});
  }
  const handleChange = (event) => {
      setCategory(event.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchTickets();
}
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
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(false);
  };
  const handleViewImage = (p) => {
    setPaths(p);
    handleOpen();
  }
  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
    setPaths([]);
  }
  const createSortHandler = (property) => (event) => {
    const isAsc = sortField === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(property);
  };

  useEffect(() => {
    searchTickets();
  }, [category, page, rowsPerPage, sortOrder, sortField])

  useEffect(() => {
    if (search == '') {
      searchTickets();
    }
  }, [search])

  return (
    <div className="flex flex-col max-h-screen">
      <div>
        <PageHeaderListing title="Ticket">
        </PageHeaderListing>
      </div>
      <div className="py-5 px-10 ">
        <div className="">
        <SearchComponent searchTickets={searchTickets}
                                      handleSearch={handleSearch} 
                                      changeSearch={changeSearch} 
                                      category={category}
                                      handleChange={handleChange}/>
        </div>
        <div className="p-5 items-center align-middle justify-center rounded-lg shadow-lg">
          <div className="">
          <ImageDialog paths={paths} open={open} handleClose={handleClose} handleOpen={handleOpen}/>
            <Box sx={{ height: "100%", width: "100%" }}>
                  <Snackbar
                      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                      open={error}
                      onClose={handleCloseSnackbar}
                      message="Error"
                      key={"top" + "center"}
                      > 
                      <Alert severity="error">Error in Searching</Alert>
                </Snackbar>
                  <div className="grid grid-cols-12 px-4">
                      <div></div>
                      <div className='col-span-12'>
                              <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                              <TableHead>
                                  <TableRow>
                                    <TableCell align={"left"}>
                                            {"Username"}
                                    </TableCell>
                                    {
                                    headCells.map(headCell => {
                                            return (<TableCell
                                                key={headCell.field}
                                                align={headCell.align}
                                                padding={'normal'}
                                                sortDirection={sortField === headCell.field ? sortOrder : false}
                                              >
                                                <TableSortLabel
                                                  direction={sortField === headCell.field ? sortOrder : 'asc'}
                                                  onClick={createSortHandler(headCell.field)}
                                                  active={headCell.field === sortField}
                                                >
                                                  {headCell.label}
                                                  {sortField === headCell.field ? (
                                                    <Box component="span" sx={visuallyHidden}>
                                                      {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                  ) : null}
                                                </TableSortLabel>
                                              </TableCell>)
                                          })
                                          }
                                          <TableCell align={"left"}>
                                            {"Action"}
                                          </TableCell>
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                  {(tickets
                                  ).map((row) => (
                                  <TableRow key={row.ticketId}>
                                      <TableCell style={{ width: 160 }} align="left">
                                      {row.generalUser}
                                      </TableCell>
                                      <TableCell style={{ width: 160 }} align="left">
                                      {row.subject}
                                      </TableCell>
                                      <TableCell style={{ width: 300 }} align="left">
                                      {row.description}
                                      </TableCell>
                                      <TableCell style={{ width: 160 }} align="left">
                                      {row.ticketCategory}
                                      </TableCell>
                                      <TableCell style={{ width: 160 }} align="left">
                                      {row.ticketStatus === "UNRESOLVED" ? <CloseIcon/> : <CheckBoxIcon/> }
                                      </TableCell>
                                      <TableCell style={{ width: 160 }} align="left">
                                      {row.createdAt && new Date(row.createdAt).toLocaleString()}
                                      </TableCell>
                                      <TableCell style={{ width: 160 }} align="left">
                                        <EditTicketButton ticket={row}></EditTicketButton>
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
                                          'aria-label': 'rows per page',
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
                  </div>
            </div>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSupport;