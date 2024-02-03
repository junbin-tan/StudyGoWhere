import {
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    TextField,
    Typography,
    Snackbar,
    Alert,
  } from "@mui/material";
  import React from "react";
  import { useState, useEffect } from "react";
  import Api from "../../Helpers/Api";
  import { useNavigate } from "react-router-dom";
  import useEncodedToken from "../../Helpers/useEncodedToken";
  import ToggleButton from '@mui/material/ToggleButton';
  import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
  import ImageDialog from "./ImageDialog";
  import ImageIcon from "@mui/icons-material/Image";
  import IconButton from "@mui/material/IconButton/IconButton";
  import AdminResponseDialog from './AdminResponseDialog';

  const EditTicketForm = ({ ticket, reloadTicket }) => {
    const { encodedToken } = useEncodedToken();
    const navigate = useNavigate();
    const [openResponse, setOpenResponse] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [paths, setPaths] = useState([]);
    const [open, setOpen] = useState(false);
    const handleCloseSnackbar = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setOpenSnackbar(false);
    };
    
    const [formTicket, setFormTicket] = useState({...ticket});
  


    useEffect(() => {
        setFormTicket({...ticket})
    }, [ticket]);

    const handleChange = (e) => {
        console.log(e.target.value)
      setFormTicket({
        ...formTicket,
        [e.target.name]: e.target.value,
      });
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
    const updateTicket = async () => {
      try {
        let response = await Api.updateTicket(
          formTicket,
          formTicket.ticketId,
          encodedToken
        );
        if (response.ok) {
          setOpenSnackbar(true);
          setSnackbarMessage("Ticket has been updated");
          setTimeout(() => {
            navigate('/user-support')
          }, 1000)
        } else {

        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const openChatDialog = (e) => {
      setOpenResponse(true);
      Api.markAsRead(ticket.ticketId, encodedToken)
      .then(res => {
        reloadTicket();
      })
      .catch(error => {
        console.log(error);
      })
      setFormTicket(prev => {
        return {...prev, notifyAdmin : false};
      })
    }
    const handleSubmit = (event) => {
      event.preventDefault();
      updateTicket(); // Call the async function here
    };

    return (
      <div className="">
        <div className="w-screen rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
              <span className="text-gray-700">
                Ticket ID: {ticket?.ticketId}
              </span>
            </h1>
            <div>
                <label
                  htmlFor="generalUser"
                  className="block mb-2 text-sm font-medium "
                >
                  Username
                </label>
                <input
                  type="text"
                  name="generalUser"
                  value={formTicket.generalUser}
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium "
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formTicket.subject}
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                />
              </div>
              <div>
                <label
                  htmlFor="Description"
                  className="block mb-2 text-sm font-medium "
                >
                  Description
                </label>
                <textarea
                  type="text"
                  name="description"
                  value={formTicket.description}
                  rows={4}
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                />
              </div>
              <div>
                <label
                  htmlFor="createdAt"
                  className="block mb-2 text-sm font-medium "
                >
                  Created At
                </label>
                <input
                  type="text"
                  name="createdAt"
                  value={new Date(formTicket.createdAt).toLocaleString()}
                  className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  readOnly
                />
              </div>
  
              <div>
                <label
                  htmlFor="images"
                  className="block mb-2 text-sm font-medium "
                >
                  Images
                </label>
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={(e) => handleViewImage(formTicket.images)}
                        className=" text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                  View Images
                  <span className='px-1'><ImageIcon /></span>
                </button>
                </div>
                <ImageDialog paths={paths} open={open} handleClose={handleClose} handleOpen={handleOpen}/>
              </div>
              <div>
                <label
                  htmlFor="ticketStatus"
                  className="block mb-2 text-sm font-medium "
                >
                  Ticket Status
                </label>
                <div className="flex justify-center">
                <ToggleButtonGroup
                    value={formTicket.ticketStatus}
                    exclusive
                    onChange={handleChange}
                    aria-label="Ticket Status"
                    name="ticketStatus"
                    >
                    <ToggleButton name="ticketStatus" value="RESOLVED">Resolved</ToggleButton>
                    <ToggleButton name="ticketStatus" value="UNRESOLVED">Unresolved</ToggleButton>
                </ToggleButtonGroup>
                </div>
              </div>
              <div className="relative">
                <label
                  htmlFor="chat"
                  className="block mb-1 text-sm font-medium "
                >
                  Chat
                </label>
                <div className="flex flex-row justify-center">
                  <button
                          type="button"
                          onClick={openChatDialog}
                          className={` text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-8 py-2.5 text-center`}
                          >
                    View Chat
                  </button>
                  {ticket.notifyAdmin &&<span class="relative flex h-3 w-3 top-0 right-1">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>}
                </div>
                <AdminResponseDialog
                  open={openResponse}
                  ticketDialog={ticket}
                  handleCloseAdminResponseDialog={(e) => setOpenResponse(false)}
                />
              </div>
  
              <div className="flex justify-end">
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <button
                  type="submit"
                  className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Update details
                </button>
                </form>
              </div>
          </div>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleCloseSnackbar} severity="success">
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    );
  };
  
  export default EditTicketForm;